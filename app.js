/* ---------- constants ---------- */
const AXIS_VALUES = {
  version: ["3.0", "2.0"],
  platform: ["aos", "ios", "web"],
  feature: ["getting-started", "survey", "3d-workspace", "admin", "whats-new", "appendix"],
  user: ["all", "surveyor", "admin"],
  step: ["1", "2", "3", "4"]
};
const AXIS_ORDER = ["version", "platform", "feature", "user", "step"];
const AXIS_ICON = { version: "🏷️", platform: "📱", feature: "🧩", user: "👤", step: "🪜" };

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
  linksEl.innerHTML = t().footerLinks.map(l => `<button type="button">${escapeHtml(l)}</button>`).join("");
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
      <span class="tab-title">${AXIS_ICON[axis]} ${escapeHtml(ax.label)}</span>
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
      <button type="button" class="back-btn" id="detail-back-btn">← ${escapeHtml(t().backToList)}</button>
      <div class="a-badge-row"><span>${escapeHtml(articleBadge(article))}</span></div>
      <h3 class="a-doc-title">${escapeHtml(c.title)}</h3>
      <div class="article-body">${c.html}</div>
    </div>
  `;

  document.getElementById("detail-back-btn").addEventListener("click", () => {
    state.articleKey = null;
    renderAll();
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
  state.searchMode = false;
  state.searchQuery = "";
  state.axis = "version";
  state.value = article.version;
  state.articleKey = key;
  renderAll();
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

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
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

  renderAll();
});
