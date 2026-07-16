/* ---------- constants ---------- */
const AXIS_VALUES = {
  version: ["3.0", "2.0"],
  platform: ["aos", "ios", "web"],
  feature: ["getting-started", "survey", "3d-workspace", "admin", "whats-new", "appendix"],
  user: ["all", "surveyor", "admin"],
  step: ["1", "2", "3", "4"]
};
const AXIS_ORDER = ["feature", "step", "version", "platform", "user"];
/* simple single-color line icons (currentColor) replacing the old emoji set */
const AXIS_ICON_SVG = {
  version: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M10 3h5.5a1.5 1.5 0 0 1 1.5 1.5V10L9.5 17.5a1.5 1.5 0 0 1-2.12 0L3 13.12a1.5 1.5 0 0 1 0-2.12L10 3Z" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="13" cy="7" r="1.1" fill="currentColor" stroke="none"/></svg>',
  platform: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><rect x="2.5" y="4" width="15" height="10" rx="1.5" stroke-width="1.6"/><path d="M7 17.5h6M10 14v3.5" stroke-width="1.6" stroke-linecap="round"/></svg>',
  feature: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><rect x="2.5" y="2.5" width="6" height="6" rx="1.2" stroke-width="1.6"/><rect x="11.5" y="2.5" width="6" height="6" rx="1.2" stroke-width="1.6"/><rect x="2.5" y="11.5" width="6" height="6" rx="1.2" stroke-width="1.6"/><rect x="11.5" y="11.5" width="6" height="6" rx="1.2" stroke-width="1.6"/></svg>',
  user: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><circle cx="10" cy="6.5" r="3.3" stroke-width="1.6"/><path d="M3.5 17c0-3.4 3-5.5 6.5-5.5s6.5 2.1 6.5 5.5" stroke-width="1.6" stroke-linecap="round"/></svg>',
  step: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M3 17v-3.5h3.5V17M8.5 17V9.5H12V17M13.5 17V5h3.5v12" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
const SOCIAL_ICON_SVG = {
  LinkedIn: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.83v2h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.11V23h-4v-6.9c0-1.64-.03-3.76-2.29-3.76-2.29 0-2.64 1.79-2.64 3.64V23h-4V8.5z"/></svg>',
  YouTube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5v-7l6.4 3.5-6.4 3.5z"/></svg>',
  Instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none"/></svg>',
  Facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.12 8.5H17V5.14C16.67 5.1 15.55 5 14.24 5c-2.73 0-4.6 1.66-4.6 4.7V12H6.6v3.5h3.04V23h3.62v-7.5h3.04L17 12h-3.74v-1.94c0-1 .27-1.56 1.86-1.56z"/></svg>',
  X: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.9 10.5 21.3 2h-1.8l-6.4 7.4L8 2H2l7.8 11.3L2 22h1.8l6.8-7.9L16 22h6L13.9 10.5zm-2.4 2.8-.8-1.1L4.4 3.3h2.7l5 7.2.8 1.1 6.6 9.4h-2.7l-5.3-7.7z"/></svg>'
};
const SHARE_ICON_SVG = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><circle cx="15" cy="4.5" r="2.2" stroke-width="1.6"/><circle cx="5" cy="10" r="2.2" stroke-width="1.6"/><circle cx="15" cy="15.5" r="2.2" stroke-width="1.6"/><path d="M6.9 8.8l6.2-3.2M6.9 11.2l6.2 3.2" stroke-width="1.6" stroke-linecap="round"/></svg>';

const state = {
  lang: "ko",
  axis: "version",
  value: null,
  articleKey: null,
  searchMode: false,
  searchQuery: ""
};

/* ---------- helpers ---------- */
function t() { return UI[state.lang]; }

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesAxisValue(article, axis, value) {
  switch (axis) {
    case "version":
      return article.version === value;
    case "platform":
      return article.platform.includes(value);
    case "feature":
      return article.feature === value;
    case "user":
      return article.user.includes(value) || (value !== "all" && article.user.includes("all"));
    case "step":
      return String(article.step) === value;
    default:
      return false;
  }
}

function getArticlesFor(axis, value) {
  return ARTICLES
    .filter(a => matchesAxisValue(a, axis, value))
    .sort((a, b) => {
      if (a.version !== b.version) return a.version === "3.0" ? -1 : 1;
      return (a.order || 0) - (b.order || 0);
    });
}

function searchArticles(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ARTICLES.filter(a => {
    const c = a.i18n[state.lang] || a.i18n.en;
    const hay = (c.title + " " + stripHtml(c.html)).toLowerCase();
    return hay.includes(q);
  });
}

function valueLabel(axis, value) {
  return (t().values[axis] && t().values[axis][value]) || value;
}

function articleBadge(article) {
  const v = valueLabel("version", article.version);
  const f = valueLabel("feature", article.feature);
  return `${v} · ${f}`;
}

function getArticleByKey(key) {
  return ARTICLES.find(a => a.key === key);
}

function snippetFor(article) {
  const c = article.i18n[state.lang] || article.i18n.en;
  const plain = stripHtml(c.html);
  return plain.length > 120 ? plain.slice(0, 120) + "…" : plain;
}

/* ---------- render: header / hero / footer ---------- */
function renderHeader() {
  document.getElementById("site-name").innerHTML =
    state.lang === "ko"
      ? `beamo <span>매뉴얼</span>`
      : state.lang === "ja"
      ? `beamo <span>マニュアル</span>`
      : `beamo <span>Manual</span>`;
  document.getElementById("header-search-input").placeholder = t().headerSearchPlaceholder;
  document.querySelectorAll(".lang-switch button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === state.lang);
  });
}

function renderHero() {
  document.getElementById("hero-label").textContent = t().heroLabel;
  document.getElementById("hero-title").textContent = t().heroTitle;
  document.getElementById("hero-subtitle").textContent = t().heroSubtitle;
  document.getElementById("hero-search-input").placeholder = t().heroSearchPlaceholder;
}

function renderFooter() {
  const linksEl = document.getElementById("footer-links");
  const BEAMO_HOME_INDEX = 0; // "beamo 홈페이지" / "beamo Website" / "beamo ウェブサイト" — same position in every language array
  const BEAMO_HOME_URL = "https://www.beamo.ai/";
  const ABOUT_US_INDEX = 1; // "회사 소개" / "About Us" / "会社概要" — same position in every language array
  const ABOUT_US_URL = "https://3i.ai/";
  const CONTACT_INDEX = 2; // "문의하기" / "Contact" / "お問い合わせ" — same position in every language array
  linksEl.innerHTML = t().footerLinks.map((l, i) => {
    if (i === BEAMO_HOME_INDEX) {
      return `<a href="${BEAMO_HOME_URL}" target="_blank" rel="noopener">${escapeHtml(l)}</a>`;
    }
    if (i === ABOUT_US_INDEX) {
      return `<a href="${ABOUT_US_URL}" target="_blank" rel="noopener">${escapeHtml(l)}</a>`;
    }
    if (i === CONTACT_INDEX) {
      const url = CONTACT_URL[state.lang] || CONTACT_URL.en;
      return `<a href="${url}" target="_blank" rel="noopener">${escapeHtml(l)}</a>`;
    }
    return `<button type="button">${escapeHtml(l)}</button>`;
  }).join("");

  const socialEl = document.getElementById("footer-social");
  socialEl.innerHTML = SOCIAL_LINKS.map(s =>
    `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${escapeHtml(s.name)}" class="social-link">${SOCIAL_ICON_SVG[s.name]}</a>`
  ).join("");

  document.getElementById("footer-copy").textContent = t().footerCopy;
}

function renderSectionHead() {
  document.getElementById("browse-eng").textContent = t().browseByEng;
  document.getElementById("browse-title").textContent = t().browseByTitle;
  document.getElementById("browse-desc").textContent = t().browseByDesc;
}

/* ---------- render: tabs / breadcrumb ---------- */
function renderTabs() {
  const tabsEl = document.getElementById("tabs");
  tabsEl.innerHTML = AXIS_ORDER.map(axis => {
    const active = state.axis === axis && !state.searchMode ? "active" : "";
    const ax = t().axes[axis];
    return `<button type="button" class="tab-btn ${active}" data-axis="${axis}">
      <span class="tab-icon">${AXIS_ICON_SVG[axis]}</span>
      <span class="tab-title">${escapeHtml(ax.label)}</span>
      <span class="tab-sub">${escapeHtml(ax.sub)}</span>
    </button>`;
  }).join("");

  tabsEl.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.axis = btn.dataset.axis;
      state.value = null;
      state.articleKey = null;
      state.searchMode = false;
      renderAll();
    });
  });
}

function renderBreadcrumb() {
  const el = document.getElementById("breadcrumb");
  const parts = [`<b data-goto="home">${escapeHtml(t().home)}</b>`];

  if (state.searchMode) {
    parts.push(`<span class="crumb-current">${escapeHtml(t().searchResultsFor)}: "${escapeHtml(state.searchQuery)}"</span>`);
  } else {
    const ax = t().axes[state.axis];
    if (state.value === null) {
      parts.push(`<span class="crumb-current">${escapeHtml(ax.label)}</span>`);
    } else if (!state.articleKey) {
      parts.push(`<b data-goto="axis">${escapeHtml(ax.label)}</b>`);
      parts.push(`<span class="crumb-current">${escapeHtml(valueLabel(state.axis, state.value))}</span>`);
    } else {
      const article = getArticleByKey(state.articleKey);
      const c = article ? (article.i18n[state.lang] || article.i18n.en) : null;
      parts.push(`<b data-goto="axis">${escapeHtml(ax.label)}</b>`);
      parts.push(`<b data-goto="value">${escapeHtml(valueLabel(state.axis, state.value))}</b>`);
      parts.push(`<span class="crumb-current">${escapeHtml(c ? c.title : "")}</span>`);
    }
  }
  el.innerHTML = parts.join(`<span>›</span>`);

  el.querySelectorAll("[data-goto]").forEach(elm => {
    elm.addEventListener("click", () => {
      const kind = elm.dataset.goto;
      if (kind === "home") resetToHome();
      else if (kind === "axis") { state.value = null; state.articleKey = null; renderAll(); }
      else if (kind === "value") { state.articleKey = null; renderAll(); }
    });
  });
}

/* ---------- render: chip list ---------- */
function renderChipList() {
  const el = document.getElementById("chip-list");
  if (state.searchMode) { el.innerHTML = ""; return; }

  const values = AXIS_VALUES[state.axis];
  el.innerHTML = values.map(v => {
    const count = getArticlesFor(state.axis, v).length;
    const active = state.value === v ? "active" : "";
    return `<button type="button" class="chip ${active}" data-value="${v}">
      <span>${escapeHtml(valueLabel(state.axis, v))}</span>
      <span class="count">${count}</span>
    </button>`;
  }).join("");

  el.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      state.value = chip.dataset.value;
      state.articleKey = null;
      renderAll();
    });
  });
}

/* ---------- render: result area ---------- */
function renderResultArea() {
  const panelEl = document.getElementById("panel");
  const titleEl = document.getElementById("result-title");
  const areaEl = document.getElementById("result-area");

  panelEl.classList.toggle("reading-mode", !!state.articleKey);

  if (state.articleKey) {
    renderArticleDetail(areaEl);
    titleEl.textContent = "";
    return;
  }

  if (state.searchMode) {
    const results = searchArticles(state.searchQuery);
    titleEl.innerHTML = "";
    if (results.length === 0) {
      areaEl.innerHTML = `<div class="empty-state"><div class="em-icon">🔍</div><div>${escapeHtml(t().noResults)}</div></div>`;
      return;
    }
    areaEl.innerHTML =
      `<div class="search-info">"<b>${escapeHtml(state.searchQuery)}</b>" ${escapeHtml(t().searchResultsCount)}: <b>${results.length}</b></div>` +
      renderArticleCards(results);
    bindArticleCards(areaEl);
    return;
  }

  titleEl.textContent = t().resultsTitle;

  if (state.value === null) {
    areaEl.innerHTML = `<div class="empty-state"><div class="em-icon">📄</div><div>${escapeHtml(t().emptyState)}</div></div>`;
    return;
  }

  // beamo 2.0 external notice — only relevant when browsing by version = 2.0
  let extraBox = "";
  if (state.axis === "version" && state.value === "2.0") {
    const url = V2_SUPPORT_URL[state.lang] || V2_SUPPORT_URL.en;
    extraBox = `<div class="external-link-box">
      <span>${escapeHtml(t().v2ExternalNotice)}</span>
      <a class="ext-btn" href="${url}" target="_blank" rel="noopener">${escapeHtml(t().v2ExternalBtn)}</a>
    </div>`;
  }

  const results = getArticlesFor(state.axis, state.value);
  if (results.length === 0) {
    areaEl.innerHTML = `<div class="empty-state"><div class="em-icon">📄</div><div>${escapeHtml(t().noResults)}</div></div>` + extraBox;
    return;
  }
  areaEl.innerHTML = renderArticleCards(results) + extraBox;
  bindArticleCards(areaEl);
}

function renderArticleCards(list) {
  return list.map(a => {
    const c = a.i18n[state.lang] || a.i18n.en;
    return `<div class="article-card" data-key="${a.key}">
      <span class="badge">${escapeHtml(articleBadge(a))}</span>
      <div>
        <div class="a-title">${escapeHtml(c.title)}</div>
        <div class="a-snippet">${escapeHtml(snippetFor(a))}</div>
      </div>
    </div>`;
  }).join("");
}

function bindArticleCards(container) {
  container.querySelectorAll(".article-card").forEach(card => {
    card.addEventListener("click", () => {
      gotoArticle(card.dataset.key);
    });
  });
}

function renderArticleDetail(areaEl) {
  const article = getArticleByKey(state.articleKey);
  if (!article) {
    areaEl.innerHTML = `<div class="empty-state">${escapeHtml(t().noResults)}</div>`;
    return;
  }
  const c = article.i18n[state.lang] || article.i18n.en;
  areaEl.innerHTML = `
    <div class="article-detail">
      <div class="a-top-row">
        <button type="button" class="back-btn" id="detail-back-btn">← ${escapeHtml(t().backToList)}</button>
        <button type="button" class="share-btn" id="detail-share-btn">${SHARE_ICON_SVG}<span>${escapeHtml(t().shareBtn)}</span></button>
      </div>
      <div class="a-badge-row"><span>${escapeHtml(articleBadge(article))}</span></div>
      <h3 class="a-doc-title">${escapeHtml(c.title)}</h3>
      <div class="article-body">${c.html}</div>
    </div>
  `;

  document.getElementById("detail-back-btn").addEventListener("click", () => {
    state.articleKey = null;
    renderAll();
    clearArticleUrl();
  });

  document.getElementById("detail-share-btn").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    const url = buildShareUrl(article.key, state.lang);
    const showCopied = () => {
      const original = btn.innerHTML;
      btn.classList.add("copied");
      btn.innerHTML = `${SHARE_ICON_SVG}<span>${escapeHtml(t().shareCopied)}</span>`;
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = original;
      }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(showCopied).catch(() => window.prompt(t().shareBtn, url));
    } else {
      window.prompt(t().shareBtn, url);
    }
  });

  // cross-article link navigation
  areaEl.querySelectorAll("a[data-goto-key]").forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const key = a.getAttribute("data-goto-key");
      if (key) gotoArticle(key);
    });
  });

  // scroll reading area to top when opening an article
  const box = areaEl.closest(".result-box");
  if (box && typeof box.scrollIntoView === "function") {
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (typeof window.scrollTo === "function") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function gotoArticle(key) {
  const article = getArticleByKey(key);
  if (!article) return;

  // Keep whatever list the user was already browsing (axis/value) so that
  // "back to list" returns to that same filtered list instead of jumping
  // all the way back to the version list. Only reset the axis/value when
  // the article was reached from search, or from a context (e.g. a
  // cross-article link) whose current axis/value wouldn't even include it.
  const cameFromMatchingList =
    !state.searchMode &&
    state.value !== null &&
    matchesAxisValue(article, state.axis, state.value);

  if (!cameFromMatchingList) {
    state.searchMode = false;
    state.searchQuery = "";
    state.axis = "version";
    state.value = article.version;
  }

  state.articleKey = key;
  renderAll();
  pushArticleUrl(key);
}

/* ---------- shareable article URLs ---------- */
function buildShareUrl(key, lang) {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("doc", key);
  url.searchParams.set("lang", lang || state.lang);
  return url.toString();
}

function pushArticleUrl(key) {
  const url = buildShareUrl(key, state.lang);
  if (url !== window.location.href) {
    window.history.pushState({ articleKey: key, lang: state.lang }, "", url);
  }
}

function clearArticleUrl() {
  const url = new URL(window.location.href);
  if (url.search) {
    url.search = "";
    window.history.pushState({}, "", url.toString());
  }
}

function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  const doc = params.get("doc");
  if (lang && UI[lang]) state.lang = lang;
  if (doc) {
    const article = getArticleByKey(doc);
    if (article) {
      state.searchMode = false;
      state.searchQuery = "";
      state.axis = "version";
      state.value = article.version;
      state.articleKey = doc;
    }
  }
}

/* ---------- top-level render ---------- */
function resetToHome() {
  state.axis = "version";
  state.value = null;
  state.articleKey = null;
  state.searchMode = false;
  state.searchQuery = "";
  document.getElementById("header-search-input").value = "";
  document.getElementById("hero-search-input").value = "";
  renderAll();
  clearArticleUrl();
}

function renderAll() {
  renderHeader();
  renderHero();
  renderSectionHead();
  renderTabs();
  renderBreadcrumb();
  renderChipList();
  renderResultArea();
  renderFooter();
}

function handleSearchInput(value) {
  state.searchQuery = value;
  state.searchMode = value.trim().length > 0;
  if (state.searchMode) state.articleKey = null;
  renderAll();
}

/* ---------- image lightbox (click to enlarge) ---------- */
function ensureLightbox() {
  let lb = document.getElementById("img-lightbox");
  if (lb) return lb;
  lb = document.createElement("div");
  lb.id = "img-lightbox";
  lb.className = "lightbox-overlay";
  lb.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Close">&times;</button>
    <img class="lightbox-img" id="img-lightbox-img" src="" alt="">
  `;
  document.body.appendChild(lb);

  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.classList.contains("lightbox-close")) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
  return lb;
}

function openLightbox(src, alt) {
  const lb = ensureLightbox();
  const img = document.getElementById("img-lightbox-img");
  img.src = src;
  img.alt = alt || "";
  lb.classList.add("open");
}

function closeLightbox() {
  const lb = document.getElementById("img-lightbox");
  if (lb) lb.classList.remove("open");
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  ensureLightbox();

  // delegated click handler: any image inside a rendered article body
  // opens an enlarged view, regardless of how/when it was rendered
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".article-body img");
    if (img) openLightbox(img.getAttribute("src"), img.getAttribute("alt"));
  });

  document.querySelectorAll(".lang-switch button").forEach(btn => {
    btn.addEventListener("click", () => {
      state.lang = btn.dataset.lang;
      renderAll();
    });
  });

  const headerInput = document.getElementById("header-search-input");
  const heroInput = document.getElementById("hero-search-input");

  headerInput.addEventListener("input", (e) => {
    heroInput.value = e.target.value;
    handleSearchInput(e.target.value);
  });
  heroInput.addEventListener("input", (e) => {
    headerInput.value = e.target.value;
    handleSearchInput(e.target.value);
  });

  document.getElementById("logo-home").addEventListener("click", resetToHome);

  window.addEventListener("popstate", () => {
    state.articleKey = null;
    applyUrlParams();
    renderAll();
  });

  applyUrlParams();
  renderAll();
});
