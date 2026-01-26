/* guided-tour/GuidedCaseTour.js
   Product Tour modal (SaaS-style)
   - Two-column layout (image left, bullets right)
   - Full-screen-ish modal with robust CSS isolation
   - Mobile: single column + hides thumbnail strip
*/

(function () {
  const DATA = () => window.TVAC_GUIDED_TOUR_DATA;

  const STRINGS = {
    title: "Product Tour",
    close: "Close ×",
    back: "← Back",
    next: "Next →",
    caseChooserAria: "Choose case",
    comingSoon: "Coming soon",
    imageAltPrefix: "TVAC report screenshot:",
  };

  function injectStylesOnce() {
    if (document.getElementById("tvac-pt-styles")) return;

    const css = `
/* ===== TVAC Product Tour (isolated) ===== */
#tvac-pt-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 18, 22, 0.60);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  box-sizing: border-box;
}

#tvac-pt-modal {
  color: #0f172a;
  width: min(1280px, calc(100vw - 36px));
  height: min(820px, calc(100vh - 36px));
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 80px rgba(0,0,0,0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

#tvac-pt-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  background: #fff;
  box-sizing: border-box;
}

#tvac-pt-topbar .pt-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

#tvac-pt-topbar .pt-title {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  opacity: 0.7;
  white-space: nowrap;
}

#tvac-pt-topbar select {
  max-width: 520px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.12);
  background: #fff;
  font-size: 14px;
}

#tvac-pt-topbar .pt-close {
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.12);
  background: #fff;
  cursor: pointer;
  font-weight: 600;
}

#tvac-pt-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
}

#tvac-pt-tabs {
  padding: 10px 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  background: #fff;
  box-sizing: border-box;
}

#tvac-pt-tabs .pt-tab {
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.10);
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  white-space: nowrap;
}

#tvac-pt-tabs .pt-tab[aria-current="true"] {
  border-color: rgba(255, 138, 0, 0.55);
  box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.12);
}

.ptProgressWrap{
  height: 6px;
  margin: 10px 14px 0;
  border-radius: 999px;
  background: rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.08);
  overflow: hidden;
}
.ptProgress{
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255,178,95,1), rgba(255,154,60,1));
  box-shadow: 0 10px 26px rgba(255,154,60,0.18);
  transition: width 240ms ease;
}

/* Subtle entrance animation for step changes */
#tvac-pt-content.enter-next{ animation: ptEnterNext 220ms ease both; }
#tvac-pt-content.enter-back{ animation: ptEnterBack 220ms ease both; }
@keyframes ptEnterNext{
  from{ opacity: 0; transform: translateX(14px); }
  to{ opacity: 1; transform: translateX(0); }
}
@keyframes ptEnterBack{
  from{ opacity: 0; transform: translateX(-14px); }
  to{ opacity: 1; transform: translateX(0); }
}

#tvac-pt-content {
  flex: 1;
  min-height: 0;
  padding: 14px;
  box-sizing: border-box;
}

#tvac-pt-grid {
  height: 100%;
  display: grid;
  grid-template-columns: 1.25fr 0.85fr;
  gap: 14px;
  min-height: 0;
}

#tvac-pt-panel {
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  min-height: 0;
}

#tvac-pt-imageWrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

#tvac-pt-imageHeader {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

#tvac-pt-imageHeader h2 {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
}

#tvac-pt-imageHeader p {
  margin: 6px 0 0 0;
  font-size: 13px;
  opacity: 0.75;
}

#tvac-pt-imageStage {
  flex: 1;
  min-height: 0;
  background: #f6f7fb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
}

#tvac-pt-imageStage img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 12px;
}

#tvac-pt-notes {
  padding: 12px 14px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

#tvac-pt-notes ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 10px;
  font-size: 14px;
  line-height: 1.45;
}

#tvac-pt-notes .pt-cta {
  margin-top: auto;
  padding-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
#tvac-pt-notes, #tvac-pt-notes li { color: #0f172a; }
#tvac-pt-notes { font-size: 14px; line-height: 1.5; }


#tvac-pt-notes .pt-cta button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.12);
  background: #fff;
  font-weight: 700;
  cursor: pointer;
}

#tvac-pt-notes .pt-cta button.primary {
  border-color: rgba(255, 138, 0, 0.50);
  box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.10);
}

#tvac-pt-footer {
  padding: 12px 14px;
  border-top: 1px solid rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #fff;
  box-sizing: border-box;
}

#tvac-pt-footer .pt-nav {
  display: flex;
  gap: 10px;
}

#tvac-pt-footer button {
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.12);
  background: #fff;
  cursor: pointer;
  font-weight: 700;
}

#tvac-pt-thumbs {
  padding: 10px 14px 14px;
  border-top: 1px solid rgba(0,0,0,0.06);
  background: #fff;
}

#tvac-pt-thumbs .strip {
  display: flex;
  gap: 10px;
  overflow: auto;
  padding-bottom: 2px;
}

#tvac-pt-thumbs button {
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 12px;
  background: #fff;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  flex: 0 0 auto;
  width: 110px;
  height: 68px;
}

#tvac-pt-thumbs button[aria-current="true"] {
  border-color: rgba(255, 138, 0, 0.55);
  box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.12);
}

#tvac-pt-thumbs img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f6f7fb;
  display: block;
}

/* Mobile: maximize space */
@media (max-width: 900px) {
  #tvac-pt-modal {
  color: #0f172a;
    width: calc(100vw - 24px);
    height: calc(100vh - 24px);
    border-radius: 18px;
  }
  #tvac-pt-grid {
    grid-template-columns: 1fr;
  }
  #tvac-pt-thumbs {
    display: none;
  }
  #tvac-pt-topbar select {
    max-width: 56vw;
  }
}
    `.trim();

    const style = document.createElement("style");
    style.id = "tvac-pt-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined) node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  let _state = null;

  function close() {
    if (!_state) return;
    try {
      if (_state._esc) document.removeEventListener("keydown", _state._esc);
      if (_state.overlay && _state.overlay.parentNode) _state.overlay.parentNode.removeChild(_state.overlay);
    } finally {
      _state = null;
    }
  }

  function jumpTo(id) {
    close();
    setTimeout(() => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        location.hash = "#" + id;
      }
    }, 60);
  }

  function getCase(state) {
    const cases = DATA()?.cases || [];
    return cases.find((c) => c.id === state.caseId) || cases.find((c) => c.status === "live") || cases[0];
  }

  function getSteps(state) {
    const c = getCase(state);
    return (c && Array.isArray(c.steps) ? c.steps : []).slice(0, 9);
  }

  function buildOverlay(state) {
    injectStylesOnce();

    const overlay = el("div", { id: "tvac-pt-overlay", role: "dialog", "aria-modal": "true" });
    const modal = el("div", { id: "tvac-pt-modal" });

    const title = el("div", { class: "pt-title", text: STRINGS.title });

    const select = el("select", { "aria-label": STRINGS.caseChooserAria });
    const cases = DATA()?.cases || [];
    cases.forEach((c) => {
      const opt = el("option", {
        value: c.id,
        text: c.status === "coming_soon" ? `${c.label} — ${STRINGS.comingSoon}` : c.label,
        ...(c.status === "coming_soon" ? { disabled: "disabled" } : {}),
      });
      select.appendChild(opt);
    });
    select.value = state.caseId;

    select.addEventListener("change", () => {
      state.caseId = select.value;
      state.stepIndex = 0;
      renderAll(state);
    });

    const closeBtn = el("button", { class: "pt-close", type: "button", text: STRINGS.close });
    closeBtn.addEventListener("click", () => close());

    const topbar = el("div", { id: "tvac-pt-topbar" }, [
      el("div", { class: "pt-left" }, [title, select]),
      closeBtn,
    ]);

    const tabs = el("div", { id: "tvac-pt-tabs" });
    const content = el("div", { id: "tvac-pt-content" });

    const backBtn = el("button", { type: "button", text: STRINGS.back });
    const nextBtn = el("button", { type: "button", text: STRINGS.next });

    backBtn.addEventListener("click", () => {
      state.stepIndex = clamp(state.stepIndex - 1, 0, getSteps(state).length - 1);
      renderAll(state);
    });
    nextBtn.addEventListener("click", () => {
      state.stepIndex = clamp(state.stepIndex + 1, 0, getSteps(state).length - 1);
      renderAll(state);
    });

    const footer = el("div", { id: "tvac-pt-footer" }, [
      el("div", { style: "font-size:12px; opacity:0.7;" }),
      el("div", { class: "pt-nav" }, [backBtn, nextBtn]),
    ]);

    const thumbs = el("div", { id: "tvac-pt-thumbs" }, [el("div", { class: "strip" })]);

    const progressWrap = el("div", { class: "ptProgressWrap", "aria-hidden": "true" }, [
      el("div", { class: "ptProgress", id: "tvac-pt-progress" })
    ]);

    const body = el("div", { id: "tvac-pt-body" }, [tabs, progressWrap, content, footer, thumbs]);
    modal.appendChild(topbar);
    modal.appendChild(body);
    overlay.appendChild(modal);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener("keydown", state._esc = (e) => {
      if (e.key === "Escape") close();
    });

    state._nodes = {
      overlay,
      modal,
      tabs,
      content,
      progress: overlay.querySelector("#tvac-pt-progress"),
      footer,
      backBtn,
      nextBtn,
      thumbsStrip: thumbs.querySelector(".strip")
    };

    return overlay;
  }

  function renderTabs(state) {
    const steps = getSteps(state);
    const { tabs } = state._nodes;
    tabs.innerHTML = "";

    steps.forEach((s, i) => {
      const b = el("button", {
        class: "pt-tab",
        type: "button",
        text: s.title,
        "aria-current": i === state.stepIndex ? "true" : "false",
      });
      b.addEventListener("click", () => {
        state.stepIndex = i;
        renderAll(state);
      });
      tabs.appendChild(b);
    });
}

  function renderContent(state) {
    const steps = getSteps(state);
    const step = steps[state.stepIndex] || steps[0];
    const { content } = state._nodes;

    content.innerHTML = "";

    const left = el("div", { id: "tvac-pt-panel" }, [
      el("div", { id: "tvac-pt-imageWrap" }, [
        el("div", { id: "tvac-pt-imageHeader" }, [
          el("h2", { text: step?.title || "" }),
          el("p", { text: step?.subtitle || "" }),
        ]),
        el("div", { id: "tvac-pt-imageStage" }, [
          el("img", {
            src: step?.image || "",
            alt: `${STRINGS.imageAltPrefix} ${step?.title || ""}`,
            loading: "eager",
          }),
        ]),
      ]),
    ]);

    const right = el("div", { id: "tvac-pt-panel" }, [
      el("div", { id: "tvac-pt-notes" }, [
        el("ul", {}, ((step?.bullets || step?.points || step?.notes || [])).map((b) => el("li", {}, [b]))),

        el("div", { class: "pt-cta" }, [
          el("button", { type: "button", class: "primary", text: "Order a Deep Assessment Report" }),
          el("button", { type: "button", text: "Methodology" }),
        ]),
      ]),
    ]);

    const [btnOrder, btnMeth] = right.querySelectorAll(".pt-cta button");
    btnOrder.addEventListener("click", () => jumpTo("pricing"));
    btnMeth.addEventListener("click", () => jumpTo("methodology"));

    const grid = el("div", { id: "tvac-pt-grid" }, [left, right]);
    content.appendChild(grid);

    const img = left.querySelector("img");
    img.addEventListener("error", () => {
      img.replaceWith(
        el("div", { style: "padding:14px; font-size:14px; opacity:0.75;" }, [
          "Image failed to load: ",
          step?.image || "(missing)",
          ". Check that the file exists in /assets and that the path is correct.",
        ])
      );
    });
  }

  function renderFooter(state) {
    const steps = getSteps(state);
    const { footer, backBtn, nextBtn } = state._nodes;

    backBtn.disabled = state.stepIndex <= 0;
    nextBtn.disabled = state.stepIndex >= steps.length - 1;

    const label = footer.querySelector("div");
    label.textContent = `Step ${state.stepIndex + 1} of ${steps.length}`;
  }

  function renderThumbs(state) {
    const steps = getSteps(state);
    const strip = state._nodes.thumbsStrip;
    strip.innerHTML = "";

    steps.forEach((s, i) => {
      const b = el("button", { type: "button", "aria-current": i === state.stepIndex ? "true" : "false" }, [
        el("img", { src: s.image || "", alt: s.title || "", loading: "lazy" }),
      ]);
      b.addEventListener("click", () => {
        state.stepIndex = i;
        renderAll(state);
      });
      strip.appendChild(b);
    });
  }

  function renderAll(state) {
    renderTabs(state);
    renderContent(state);
    renderFooter(state);
    renderThumbs(state);

    // Progress bar
    const steps = getSteps(state);
    if (state._nodes.progress) {
      const pct = Math.round(((state.stepIndex + 1) / Math.max(1, steps.length)) * 100);
      state._nodes.progress.style.width = pct + "%";
    }

    // Subtle entrance animation for content on step change
    const dir = (state._prevIndex == null || state.stepIndex >= state._prevIndex) ? "next" : "back";
    state._prevIndex = state.stepIndex;
    if (state._nodes.content) {
      state._nodes.content.classList.remove("enter-next", "enter-back");
      // force reflow so animation restarts
      void state._nodes.content.offsetWidth;
      state._nodes.content.classList.add(dir === "next" ? "enter-next" : "enter-back");
    }
  }

  function open(caseId = "case-a") {
    const live = (DATA()?.cases || []).find((c) => c.id === caseId && c.status !== "coming_soon");
    const fallback = (DATA()?.cases || []).find((c) => c.status === "live");
    const chosen = live ? caseId : (fallback ? fallback.id : caseId);

    if (_state?.overlay) close();

    _state = {
      caseId: chosen,
      stepIndex: 0,
      overlay: null,
      _nodes: null,
      _esc: null,
    };

    const overlay = buildOverlay(_state);
    _state.overlay = overlay;
    document.body.appendChild(overlay);

    renderAll(_state);
  }

  window.TVACProductTour = { open, close };
})();
