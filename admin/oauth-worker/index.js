// Decap CMS (GitHub backend) OAuth proxy — Cloudflare Workers.
//
// Decap's "github" backend can't talk to GitHub's OAuth endpoints directly
// from the browser (GitHub requires a server-side client_secret exchange).
// This worker is that small server: it sends the user to GitHub to log in,
// then exchanges the returned code for an access token and hands it back to
// the CMS popup window using the standard netlify-cms/decap-cms
// postMessage handshake.
//
// Deploy with `wrangler deploy` from this folder (see README.md here).
// Required secrets (set with `wrangler secret put <NAME>`):
//   GITHUB_CLIENT_ID
//   GITHUB_CLIENT_SECRET

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

function randomState() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? match[1] : null;
}

// Renders the tiny page the popup shows while it hands the result back to
// the Decap CMS window that opened it. Decap listens for a message shaped
// like `authorization:github:success:{"token":"...","provider":"github"}`
// (or `:error:` with a message), but only after it sees an
// `authorizing:github` ping from the popup - hence the two-step handshake.
function renderHandshakePage(status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const html = `<!doctype html>
<html>
<body>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${JSON.stringify(message)}, e.origin);
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function handleAuth(request, env) {
  if (!env.GITHUB_CLIENT_ID) {
    return new Response("Missing GITHUB_CLIENT_ID secret on the worker.", { status: 500 });
  }

  const url = new URL(request.url);
  const state = randomState();
  const redirectUri = `${url.origin}/callback`;

  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo,user");
  authorizeUrl.searchParams.set("state", state);

  const headers = new Headers({ Location: authorizeUrl.toString() });
  headers.append(
    "Set-Cookie",
    `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/`,
  );
  return new Response(null, { status: 302, headers });
}

async function handleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = getCookie(request, "oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return renderHandshakePage("error", {
      message: "OAuth state mismatch - please close this window and try logging in again.",
    });
  }

  const tokenRes = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/callback`,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || tokenData.error || !tokenData.access_token) {
    return renderHandshakePage("error", {
      message: tokenData.error_description || "Failed to obtain an access token from GitHub.",
    });
  }

  return renderHandshakePage("success", {
    token: tokenData.access_token,
    provider: "github",
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/auth") return handleAuth(request, env);
    if (url.pathname === "/callback") return handleCallback(request, env);
    return new Response("Beamo manual CMS OAuth proxy is running.", { status: 200 });
  },
};
