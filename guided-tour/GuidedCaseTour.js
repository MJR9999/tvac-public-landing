/* GuidedCaseTour.js — Full-screen Product Tour modal with thumbnail strip
   Drop-in, no dependencies.
   Exposes window.TVAC_TOUR.open() and window.TVAC_TOUR.openCase(caseId)
*/

import { TVAC_TOUR_CASES } from "./guidedTourData.js";

(function () {
  const STYLE_ID = "tvac-tour-style-v2";
  const ROOT_ID = "tvac-tour-root-v2";

  const STRIPE_FALLBACK_SINGLE_REPORT = "https://buy.stripe.com/7sYdR91YJcM2cfG5OW2ZO02";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --tvac-tour-bg: rgba(10,10,12,0.72);
        --tvac-tour-card: #ffffff;
        --tvac-tour-text: #111827;
        --tvac-tour-muted: #6b7280;
        --tvac-tour-border: rgba(17,24,39,0.10);
        --tvac-tour-shadow: 0 30px 80px rgba(0,0,0,0.35);
        --tvac-tour-radius: 20px;
        --tvac-tour-accent: #f97316; /* TVAC orange-ish */
      }

      .tvac-tour-lock { overflow: hidden !important; }

      .tvac-tour-overlay {
        position: fixed; inset: 0;
        background: var(--tvac-tour-bg);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 18px;
      }
      .tvac-tour-overlay.is-open { display: flex; }

      .tvac-tour-shell {
        width: min(1240px, 96vw);
        height: min(820px, 92vh);
        background: var(--tvac-tour-card);
        border-radius: var(--tvac-tour-radius);
        box-shadow: var(--tvac-tour-shadow);
        overflow: hidden;
        display: grid;
        grid-template-rows: auto 1fr auto;
        border: 1px solid var(--tvac-tour-border);
      }

      .tvac-tour-topbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        padding: 18px 18px 12px 18px;
        border-bottom: 1px solid var(--tvac-tour-border);
      }
      .tvac-tour-top-left { min-width: 0; }
      .tvac-tour-eyebrow {
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--tvac-tour-muted);
        margin-bottom: 6px;
      }
      .tvac-tour-title {
        font-size: 22px;
        line-height: 1.15;
        font-weight: 750;
        color: var(--tvac-tour-text);
        margin: 0 0 6px 0;
      }
      .tvac-tour-subtitle {
        color: var(--tvac-tour-muted);
        font-size: 14px;
        line-height: 1.35;
        margin: 0;
        max-width: 920px;
      }

      .tvac-tour-actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .tvac-tour-btn {
        appearance: none;
        border: 1px solid var(--tvac-tour-border);
        background: #fff;
        color: #111827;
        border-radius: 999px;
        padding: 10px 12px;
        font-weight: 650;
        font-size: 13px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
      }
      .tvac-tour-btn:hover { border-color: rgba(17,24,39,0.18); }
      .tvac-tour-btn.primary {
        background: linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%);
        border-color: rgba(249,115,22,0.30);
      }
      .tvac-tour-btn.primary:hover {
        border-color: rgba(249,115,22,0.45);
      }
      .tvac-tour-btn.close {
        background: #fff;
      }

      .tvac-tour-body {
        display: grid;
        grid-template-columns: 1.35fr 0.85fr;
        gap: 0;
        min-height: 0;
      }

      .tvac-tour-media {
        border-right: 1px solid var(--tvac-tour-border);
        background: #0b0f19; /* makes screenshots pop */
        position: relative;
        min-height: 0;
      }
      .tvac-tour-media-inner {
        position: absolute; inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
      }
      .tvac-tour-media img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 14px;
        box-shadow: 0 18px 50px rgba(0,0,0,0.35);
        background: #fff;
      }
      .tvac-tour-noimg {
        width: 100%;
        height: 100%;
        border-radius: 14px;
        border: 1px dashed rgba(255,255,255,0.22);
        color: rgba(255,255,255,0.72);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        text-align: center;
        padding: 18px;
      }

      .tvac-tour-content {
        padding: 18px 18px 10px 18px;
        overflow: auto;
      }
      .tvac-tour-bullets {
        margin: 12px 0 0 0;
        padding-left: 18px;
        color: #111827;
      }
      .tvac-tour-bullets li {
        margin: 8px 0;
        line-height: 1.35;
        color: #111827;
      }

      .tvac-tour-footer {
        border-top: 1px solid var(--tvac-tour-border);
        padding: 10px 12px;
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 12px;
        background: #fff;
      }

      .tvac-tour-thumbs {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding: 6px 4px;
        scrollbar-width: thin;
      }
      .tvac-thumb {
        flex: 0 0 auto;
        width: 118px;
        border-radius: 12px;
        border: 1px solid var(--tvac-tour-border);
        background: #f9fafb;
        cursor: pointer;
        padding: 8px;
        display: grid;
        gap: 6px;
      }
      .tvac-thumb.is-active {
        outline: 2px solid rgba(249,115,22,0.55);
        border-color: rgba(249,115,22,0.35);
        background: #fff7ed;
      }
      .tvac-thumb .k {
        font-size: 11px;
        color: var(--tvac-tour-muted);
        text-transform: uppercase;
        letter-spacing: .08em;
      }
      .tvac-thumb .t {
        font-size: 12px;
        color: #111827;
        font-weight: 650;
        line-height: 1.1;
      }

      .tvac-tour-nav {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .tvac-tour-progress {
        font-size: 12px;
        color: var(--tvac-tour-muted);
        margin-right: 8px;
        white-space: nowrap;
      }

      .tvac-tour-casebar {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 10px;
      }
      .tvac-pill {
        border: 1px solid var(--tvac-tour-border);
        background: #fff;
        border-radius: 999px;
        padding: 8px 10px;
        font-size: 12px;
        font-weight: 650;
        cursor: pointer;
      }
      .tvac-pill.is-active {
        border-color: rgba(249,115,22,0.40);
        background: #fff7ed;
      }
      .tvac-pill.is-disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      /* Mobile: maximize image area, compact thumbs (variant 3 feel) */
      @media (max-width: 860px) {
        .tvac-tour-shell { width: 98vw; height: 94vh; border-radius: 16px; }
        .tvac-tour-body { grid-template-columns: 1fr; grid-template-rows: 1.1fr 0.9fr; }
        .tvac-tour-media { border-right: none; border-bottom: 1px solid var(--tvac-tour-border); }
        .tvac-tour-media-inner { padding: 10px; }
        .tvac-tour-content { padding: 12px 12px 8px 12px; }
        .tvac-thumb { width: 92px; padding: 7px; }
        .tvac-thumb .k { display: none; } /* more space */
        .tvac-tour-title { font-size: 18px; }
        .tvac-tour-actions { gap: 8px; }
        .tvac-tour-btn { padding: 9px 10px; }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureRoot() {
    let root = document.getElementById(ROOT_ID);
    if (root) return root;

    root = document.createElement("div");
    root.id = ROOT_ID;
    root.innerHTML = `
      <div class="tvac-tour-overlay" role="dialog" aria-modal="true" aria-label="TVAC Product Tour">
        <div class="tvac-tour-shell">
          <div class="tvac-tour-topbar">
            <div class="tvac-tour-top-left">
              <div class="tvac-tour-eyebrow" data-eyebrow></div>
              <h2 class="tvac-tour-title" data-title></h2>
              <p class="tvac-tour-subtitle" data-subtitle></p>
              <div class="tvac-tour-casebar" data-casebar></div>
            </div>
            <div class="tvac-tour-actions">
              <button class="tvac-tour-btn close" data-close type="button">Close ✕</button>
            </div>
          </div>

          <div class="tvac-tour-body">
            <div class="tvac-tour-media">
              <div class="tvac-tour-media-inner" data-media></div>
            </div>
            <div class="tvac-tour-content">
              <ul class="tvac-tour-bullets" data-bullets></ul>
            </div>
          </div>

          <div class="tvac-tour-footer">
            <div class="tvac-tour-thumbs" data-thumbs></div>
            <div class="tvac-tour-nav">
              <div class="tvac-tour-progress" data-progress></div>
              <button class="tvac-tour-btn" data-back type="button">← Back</button>
              <button class="tvac-tour-btn primary" data-next type="button">Next →</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    return root;
  }

  const state = {
    isOpen: false,
    caseId: "case-a",
    index: 0,
    touchStartX: null
  };

  function getCaseById(caseId) {
    return TVAC_TOUR_CASES.find((c) => c.id === caseId) || TVAC_TOUR_CASES[0];
  }

  function getActiveSteps() {
    const c = getCaseById(state.caseId);
    return (c.steps || []).slice(0, 9); // max 9 steps
  }

  function render() {
    const root = ensureRoot();
    const overlay = root.querySelector(".tvac-tour-overlay");
    const c = getCaseById(state.caseId);
    const steps = getActiveSteps();
    const step = steps[state.index] || steps[0];

    // top text
    root.querySelector("[data-eyebrow]").textContent = step?.eyebrow || "PRODUCT TOUR";
    root.querySelector("[data-title]").textContent = step?.title || "Product Tour";
    root.querySelector("[data-subtitle]").textContent = step?.subtitle || "";

    // case chooser
    const casebar = root.querySelector("[data-casebar]");
    casebar.innerHTML = "";
    TVAC_TOUR_CASES.forEach((cc) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tvac-pill" +
        (cc.id === state.caseId ? " is-active" : "") +
        (cc.status !== "ready" ? " is-disabled" : "");
      btn.textContent = cc.name;
      btn.disabled = cc.status !== "ready";
      btn.addEventListener("click", () => openCase(cc.id));
      casebar.appendChild(btn);
    });

    // media
    const media = root.querySelector("[data-media]");
    media.innerHTML = "";
    if (step?.image) {
      const img = document.createElement("img");
      img.alt = step.label ? `${step.label} — TVAC report screenshot` : "TVAC report screenshot";
      img.src = step.image;
      img.loading = "eager";
      media.appendChild(img);
    } else {
      const box = document.createElement("div");
      box.className = "tvac-tour-noimg";
      box.textContent = "No image for this step.";
      media.appendChild(box);
    }

    // bullets
    const bullets = root.querySelector("[data-bullets]");
    bullets.innerHTML = "";
    (step?.bullets || []).forEach((b) => {
      const li = document.createElement("li");
      li.textContent = b;
      bullets.appendChild(li);
    });

    // thumbs
    const thumbs = root.querySelector("[data-thumbs]");
    thumbs.innerHTML = "";
    steps.forEach((s, i) => {
      const th = document.createElement("button");
      th.type = "button";
      th.className = "tvac-thumb" + (i === state.index ? " is-active" : "");
      th.innerHTML = `
        <div class="k">${(s.eyebrow || "Step").toString()}</div>
        <div class="t">${s.label || `Step ${i + 1}`}</div>
      `;
      th.addEventListener("click", () => {
        state.index = i;
        render();
      });
      thumbs.appendChild(th);
    });

    // progress + nav
    const progress = root.querySelector("[data-progress]");
    progress.textContent = `Step ${state.index + 1} of ${steps.length}`;

    const back = root.querySelector("[data-back]");
    const next = root.querySelector("[data-next]");
    back.disabled = state.index === 0;

    const isLast = state.index === steps.length - 1;
    if (isLast && step?.kind === "cta") {
      next.textContent = "Order Deep Assessment →";
    } else if (isLast) {
      next.textContent = "Finish →";
    } else {
      next.textContent = "Next →";
    }

    overlay.classList.toggle("is-open", state.isOpen);
  }

  function close() {
    state.isOpen = false;
    document.documentElement.classList.remove("tvac-tour-lock");
    render();
  }

  function open() {
    injectStyles();
    ensureRoot();
    state.isOpen = true;
    document.documentElement.classList.add("tvac-tour-lock");
    render();
  }

  function openCase(caseId) {
    const c = getCaseById(caseId);
    if (c.status !== "ready") return;
    state.caseId = caseId;
    state.index = 0;
    open();
  }

  function next() {
    const steps = getActiveSteps();
    const step = steps[state.index];
    const isLast = state.index === steps.length - 1;

    if (isLast && step?.kind === "cta") {
      // Prefer a global handler if you have one (index.html can define it)
      if (typeof window.TVAC_OPEN_ORDER === "function") {
        window.TVAC_OPEN_ORDER();
      } else {
        window.open(STRIPE_FALLBACK_SINGLE_REPORT, "_blank", "noopener,noreferrer");
      }
      return;
    }

    if (isLast) {
      close();
      return;
    }

    state.index = Math.min(state.index + 1, steps.length - 1);
    render();
  }

  function back() {
    state.index = Math.max(state.index - 1, 0);
    render();
  }

  function bindOnce() {
    const root = ensureRoot();
    const overlay = root.querySelector(".tvac-tour-overlay");

    // close handlers
    root.querySelector("[data-close]").addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    // nav
    root.querySelector("[data-next]").addEventListener("click", next);
    root.querySelector("[data-back]").addEventListener("click", back);

    // keyboard
    window.addEventListener("keydown", (e) => {
      if (!state.isOpen) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    });

    // swipe (mobile)
    overlay.addEventListener("touchstart", (e) => {
      if (!state.isOpen) return;
      state.touchStartX = e.touches?.[0]?.clientX ?? null;
    }, { passive: true });

    overlay.addEventListener("touchend", (e) => {
      if (!state.isOpen) return;
      const endX = e.changedTouches?.[0]?.clientX ?? null;
      if (state.touchStartX == null || endX == null) return;
      const dx = endX - state.touchStartX;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) next(); else back();
      state.touchStartX = null;
    }, { passive: true });
  }

  // Init
  injectStyles();
  ensureRoot();
  bindOnce();

  // Public API
  window.TVAC_TOUR = {
    open,
    close,
    openCase
  };
})();
