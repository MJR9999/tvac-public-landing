/* guided-tour/GuidedCaseTour.js
   Fullscreen Product Tour modal with thumbnail strip + mobile optimization.
   Depends on window.TVACTourData (from guidedTourData.js).
*/

(function () {
  const DATA = () => window.TVACTourData;

  const state = {
    isOpen: false,
    caseId: null,
    stepIndex: 0,
    lastFocus: null,
  };

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "style") node.setAttribute("style", v);
      else if (k.startsWith("on") && typeof v === "function")
        node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v !== null && v !== undefined) node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c === null || c === undefined) return;
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    });
    return node;
  }

  function css() {
    return `
/* ---- TVAC Product Tour (SaaS-style) ---- */
:root{
  --tvac-bg: rgba(0,0,0,.55);
  --tvac-card: #fff;
  --tvac-text: #111;
  --tvac-muted: rgba(0,0,0,.62);
  --tvac-border: rgba(0,0,0,.10);
  --tvac-shadow: 0 18px 60px rgba(0,0,0,.28);
  --tvac-radius: 22px;
  --tvac-radius-sm: 14px;
  --tvac-accent: #ff7a18;
}

.tvac-tour-overlay{
  position: fixed; inset: 0;
  background: var(--tvac-bg);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 18px;
}

.tvac-tour-overlay[data-open="true"]{ display:flex; }

.tvac-tour-modal{
  width: min(1180px, 100%);
  height: min(760px, calc(100vh - 36px));
  background: var(--tvac-card);
  border-radius: var(--tvac-radius);
  box-shadow: var(--tvac-shadow);
  border: 1px solid var(--tvac-border);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.tvac-tour-header{
  padding: 18px 18px 12px 18px;
  border-bottom: 1px solid var(--tvac-border);
  display:flex;
  gap: 12px;
  align-items:flex-start;
  justify-content: space-between;
}

.tvac-tour-kicker{
  font-size: 11px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--tvac-accent);
  margin-bottom: 6px;
}

.tvac-tour-title{
  font-size: 22px;
  line-height: 1.15;
  margin: 0;
  color: var(--tvac-text);
}

.tvac-tour-sub{
  margin-top: 6px;
  color: var(--tvac-muted);
  font-size: 13.5px;
  line-height: 1.45;
  max-width: 72ch;
}

.tvac-tour-controls{
  display:flex;
  gap: 10px;
  align-items:center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.tvac-tour-select{
  border: 1px solid var(--tvac-border);
  background: #fff;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--tvac-text);
}

.tvac-tour-close{
  border: 1px solid var(--tvac-border);
  background: #fff;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
}

.tvac-tour-body{
  display: grid;
  grid-template-columns: 1.55fr 1fr;
  gap: 14px;
  padding: 14px 18px;
  overflow: hidden;
}

.tvac-tour-imageWrap{
  border: 1px solid var(--tvac-border);
  border-radius: var(--tvac-radius-sm);
  overflow: hidden;
  background: #fafafa;
  position: relative;
  display:flex;
  align-items:center;
  justify-content:center;
}

.tvac-tour-imageWrap img{
  width: 100%;
  height: 100%;
  object-fit: contain;
  display:block;
  background: #f6f6f6;
}

.tvac-tour-noimg{
  padding: 18px;
  color: var(--tvac-muted);
  font-size: 13px;
}

.tvac-tour-panel{
  border: 1px solid var(--tvac-border);
  border-radius: var(--tvac-radius-sm);
  padding: 14px 14px;
  overflow: auto;
}

.tvac-tour-bullets{
  margin: 10px 0 0 0;
  padding-left: 18px;
  color: var(--tvac-text);
  font-size: 14px;
  line-height: 1.55;
}

.tvac-tour-bullets li{ margin: 6px 0; }

.tvac-tour-footer{
  border-top: 1px solid var(--tvac-border);
  padding: 10px 12px 12px 12px;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
}

.tvac-tour-progress{
  color: var(--tvac-muted);
  font-size: 13px;
}

.tvac-tour-nav{
  display:flex;
  gap: 10px;
  align-items:center;
}

.tvac-tour-btn{
  border: 1px solid var(--tvac-border);
  background: #fff;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  color: var(--tvac-text);
}

.tvac-tour-btn.primary{
  border-color: rgba(0,0,0,.14);
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
  font-weight: 600;
}

.tvac-tour-btn.primary[data-accent="true"]{
  border-color: rgba(255,122,24,.35);
}

.tvac-tour-cta{
  display:flex;
  gap: 10px;
  align-items:center;
  flex-wrap: wrap;
  margin-top: 12px;
}

.tvac-tour-cta a{
  text-decoration: none;
}

.tvac-tour-ctaNote{
  font-size: 12.5px;
  color: var(--tvac-muted);
}

/* Thumbnail strip */
.tvac-tour-thumbs{
  display:flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 12px 0 12px;
}

.tvac-tour-thumb{
  border: 1px solid var(--tvac-border);
  border-radius: 12px;
  padding: 8px 10px;
  background: #fff;
  cursor: pointer;
  white-space: nowrap;
  font-size: 12.5px;
  color: var(--tvac-text);
  flex: 0 0 auto;
}

.tvac-tour-thumb[data-active="true"]{
  border-color: rgba(255,122,24,.55);
  box-shadow: 0 8px 22px rgba(255,122,24,.10);
}

@media (max-width: 900px){
  .tvac-tour-modal{
    height: calc(100vh - 28px);
    border-radius: 18px;
  }
  .tvac-tour-body{
    grid-template-columns: 1fr;
  }
  .tvac-tour-imageWrap{
    min-height: 240px;
  }
  .tvac-tour-thumbs{
    padding-top: 8px;
  }
}

@media (max-width: 520px){
  /* Mobile: maximize space (your "Valg 1", but with compact thumbs) */
  .tvac-tour-header{ padding: 14px 14px 10px 14px; }
  .tvac-tour-body{ padding: 10px 14px; }
  .tvac-tour-title{ font-size: 18px; }
  .tvac-tour-sub{ font-size: 13px; }
  .tvac-tour-thumbs{ gap: 8px; }
  .tvac-tour-thumb{ font-size: 12px; padding: 7px 9px; }
}
`;
  }

  function ensureStyles() {
    if (document.getElementById("tvac-tour-styles")) return;
    document.head.appendChild(
      el("style", { id: "tvac-tour-styles" }, css())
    );
  }

  function getCaseById(caseId) {
    const data = DATA();
    if (!data || !data.cases) return null;
    return data.cases.find((c) => c.id === caseId) || null;
  }

  function currentCase() {
    return getCaseById(state.caseId);
  }

  function steps() {
    const c = currentCase();
    return c && Array.isArray(c.steps) ? c.steps : [];
  }

  function clampStep(i) {
    const s = steps();
    if (!s.length) return 0;
    return Math.max(0, Math.min(i, s.length - 1));
  }

  function render() {
    const c = currentCase();
    const s = steps();
    const step = s[state.stepIndex];

    const overlay = document.getElementById("tvac-tour-overlay");
    if (!overlay) return;

    // Header content
    const kicker = overlay.querySelector("[data-role='kicker']");
    const title = overlay.querySelector("[data-role='title']");
    const sub = overlay.querySelector("[data-role='sub']");
    kicker.textContent = (step && step.kicker) || "PRODUCT TOUR";
    title.textContent =
      (step && step.title) || (c ? c.title : "Product Tour");
    sub.textContent =
      (step && step.body && step.body[0]) ||
      (c ? c.description : "A guided walkthrough of TVAC output.");

    // Case chooser
    const select = overlay.querySelector("[data-role='caseSelect']");
    if (select && DATA()) {
      select.innerHTML = "";
      DATA().cases.forEach((cc) => {
        const opt = document.createElement("option");
        opt.value = cc.id;
        opt.textContent =
          cc.title + (cc.badge ? ` (${cc.badge})` : "");
        if (cc.comingSoon) opt.disabled = true;
        if (cc.id === state.caseId) opt.selected = true;
        select.appendChild(opt);
      });
    }

    // Thumbnails
    const thumbs = overlay.querySelector("[data-role='thumbs']");
    thumbs.innerHTML = "";
    s.forEach((st, idx) => {
      const t = el(
        "button",
        {
          class: "tvac-tour-thumb",
          type: "button",
          "data-active": idx === state.stepIndex ? "true" : "false",
          onclick: () => goTo(idx),
          title: st.title || st.label || `Step ${idx + 1}`,
        },
        st.label || st.title || `Step ${idx + 1}`
      );
      thumbs.appendChild(t);
    });

    // Image
    const imageWrap = overlay.querySelector("[data-role='imageWrap']");
    imageWrap.innerHTML = "";
    if (step && step.image) {
      const img = el("img", { src: step.image, alt: step.imageAlt || "" });
      img.onerror = () => {
        imageWrap.innerHTML = "";
        imageWrap.appendChild(
          el("div", { class: "tvac-tour-noimg" }, [
            "Image failed to load: ",
            step.image,
            ".",
          ])
        );
      };
      imageWrap.appendChild(img);
    } else {
      imageWrap.appendChild(
        el("div", { class: "tvac-tour-noimg" }, "No image for this step.")
      );
    }

    // Bullet panel
    const bullets = overlay.querySelector("[data-role='bullets']");
    bullets.innerHTML = "";
    const list = el("ul", { class: "tvac-tour-bullets" });
    if (step && Array.isArray(step.body)) {
      step.body.slice(0, 6).forEach((b) => list.appendChild(el("li", {}, b)));
    }
    bullets.appendChild(list);

    // CTA
    const cta = overlay.querySelector("[data-role='cta']");
    cta.innerHTML = "";
    if (step && step.cta && step.cta.href) {
      const a = el(
        "a",
        { href: step.cta.href, target: "_blank", rel: "noopener noreferrer" },
        el(
          "button",
          {
            type: "button",
            class: "tvac-tour-btn primary",
            "data-accent": "true",
          },
          step.cta.label || "Order"
        )
      );
      cta.appendChild(a);
      if (step.cta.note) {
        cta.appendChild(el("div", { class: "tvac-tour-ctaNote" }, step.cta.note));
      }
    }

    // Progress + nav
    overlay.querySelector("[data-role='progress']").textContent =
      s.length ? `Step ${state.stepIndex + 1} of ${s.length}` : "No steps";

    const backBtn = overlay.querySelector("[data-role='back']");
    const nextBtn = overlay.querySelector("[data-role='next']");
    backBtn.disabled = state.stepIndex <= 0;
    nextBtn.disabled = !s.length || state.stepIndex >= s.length - 1;
  }

  function open(caseId) {
    ensureStyles();
    const data = DATA();
    const chosen = getCaseById(caseId) || getCaseById(data?.defaultCaseId);
    if (!chosen || chosen.comingSoon) return;

    state.lastFocus = document.activeElement;
    state.isOpen = true;
    state.caseId = chosen.id;
    state.stepIndex = 0;

    let overlay = document.getElementById("tvac-tour-overlay");
    if (!overlay) overlay = mount();
    overlay.setAttribute("data-open", "true");
    document.body.style.overflow = "hidden";
    render();

    // Focus close button for accessibility
    const closeBtn = overlay.querySelector("[data-role='close']");
    closeBtn && closeBtn.focus();
  }

  function close() {
    const overlay = document.getElementById("tvac-tour-overlay");
    if (!overlay) return;

    state.isOpen = false;
    overlay.setAttribute("data-open", "false");
    document.body.style.overflow = "";
    if (state.lastFocus && typeof state.lastFocus.focus === "function") {
      state.lastFocus.focus();
    }
  }

  function goTo(i) {
    state.stepIndex = clampStep(i);
    render();
  }

  function next() {
    goTo(state.stepIndex + 1);
  }

  function back() {
    goTo(state.stepIndex - 1);
  }

  function onKey(e) {
    if (!state.isOpen) return;
    if (e.key === "Escape") return close();
    if (e.key === "ArrowRight") return next();
    if (e.key === "ArrowLeft") return back();
  }

  function mount() {
    const overlay = el("div", {
      id: "tvac-tour-overlay",
      class: "tvac-tour-overlay",
      "data-open": "false",
      onclick: (e) => {
        // click outside closes
        if (e.target && e.target.id === "tvac-tour-overlay") close();
      },
    });

    const headerLeft = el("div", {}, [
      el("div", { class: "tvac-tour-kicker", "data-role": "kicker" }, "PRODUCT TOUR"),
      el("h2", { class: "tvac-tour-title", "data-role": "title" }, "Product Tour"),
      el("div", { class: "tvac-tour-sub", "data-role": "sub" }, ""),
    ]);

    const caseSelect = el("select", {
      class: "tvac-tour-select",
      "data-role": "caseSelect",
      onchange: (e) => {
        const v = e.target.value;
        if (v && v !== state.caseId) open(v);
      },
      title: "Choose case",
    });

    const closeBtn = el(
      "button",
      {
        type: "button",
        class: "tvac-tour-close",
        "data-role": "close",
        onclick: close,
      },
      "Close ✕"
    );

    const headerRight = el("div", { class: "tvac-tour-controls" }, [
      caseSelect,
      closeBtn,
    ]);

    const thumbs = el("div", { class: "tvac-tour-thumbs", "data-role": "thumbs" });

    const body = el("div", { class: "tvac-tour-body" }, [
      el("div", { class: "tvac-tour-imageWrap", "data-role": "imageWrap" }),
      el("div", { class: "tvac-tour-panel" }, [
        el("div", { "data-role": "bullets" }),
        el("div", { class: "tvac-tour-cta", "data-role": "cta" }),
      ]),
    ]);

    const footer = el("div", { class: "tvac-tour-footer" }, [
      el("div", { class: "tvac-tour-progress", "data-role": "progress" }, ""),
      el("div", { class: "tvac-tour-nav" }, [
        el(
          "button",
          { type: "button", class: "tvac-tour-btn", "data-role": "back", onclick: back },
          "← Back"
        ),
        el(
          "button",
          { type: "button", class: "tvac-tour-btn primary", "data-role": "next", onclick: next },
          "Next →"
        ),
      ]),
    ]);

    const modal = el("div", { class: "tvac-tour-modal", role: "dialog", "aria-modal": "true" }, [
      el("div", { class: "tvac-tour-header" }, [headerLeft, headerRight]),
      el("div", {}, [thumbs, body]),
      footer,
    ]);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    window.addEventListener("keydown", onKey);
    return overlay;
  }

  // Public API
  window.TVACProductTour = {
    open: (caseId) => open(caseId || DATA()?.defaultCaseId || "case-a"),
    close,
  };
})();
