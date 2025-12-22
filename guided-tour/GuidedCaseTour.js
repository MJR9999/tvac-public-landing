/* guided-tour/GuidedCaseTour.js
   Vanilla JS guided tour renderer (no frameworks).
   Renders inside <section id="guidedTour">.
*/

(function () {
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        if (k === "class") node.className = attrs[k];
        else if (k === "style") node.setAttribute("style", attrs[k]);
        else if (k.startsWith("on") && typeof attrs[k] === "function") {
          node.addEventListener(k.substring(2).toLowerCase(), attrs[k]);
        } else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach((c) => {
      if (c == null) return;
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    });
    return node;
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function safeText(x) {
    return (x == null ? "" : String(x)).trim();
  }

  function buildStyles() {
    // This is intentionally minimal and “landingpage-consistent”
    // Uses neutral glass panels and existing site background.
    const css = `
      /* Guided Tour: minimal, professional, landing-friendly */
      .gt-wrap { margin-top: 28px; }
      .gt-panel {
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.10);
        background: rgba(255,255,255,0.03);
        padding: 18px;
      }
      .gt-title { font-size: 22px; font-weight: 900; letter-spacing: .2px; }
      .gt-badge {
        font-size: 12px; font-weight: 800;
        padding: 6px 10px; border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
        opacity: .95;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .gt-subtitle { margin-top: 6px; opacity: .9; }
      .gt-disclaimer { margin-top: 10px; font-size: 13px; opacity: .72; line-height: 1.45; }

      .gt-tourtabs { margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; }
      .gt-tab {
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.05);
        color: rgba(255,255,255,0.92);
        padding: 10px 12px;
        cursor: pointer;
        text-align: left;
        min-width: 240px;
      }
      .gt-tab:hover { background: rgba(255,255,255,0.07); }
      .gt-tab--active {
        border: 1px solid rgba(255,255,255,0.30);
        background: rgba(255,255,255,0.10);
      }
      .gt-tab-title { font-weight: 900; font-size: 13px; }
      .gt-tab-sub { font-size: 12px; opacity: .75; margin-top: 2px; }

      .gt-grid { margin-top: 14px; display: grid; grid-template-columns: minmax(260px, 340px) 1fr; gap: 14px; }
      @media (max-width: 980px) { .gt-grid { grid-template-columns: 1fr; } }

      .gt-aside { border-radius: 18px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.03); padding: 14px; }
      .gt-aside-title { font-weight: 900; font-size: 13px; opacity: .9; margin-bottom: 10px; }
      .gt-progress {
        height: 8px; border-radius: 999px;
        background: rgba(255,255,255,0.10);
        overflow: hidden;
      }
      .gt-progress > div {
        height: 100%;
        border-radius: 999px;
        background: rgba(255,255,255,0.55);
        width: 0%;
      }
      .gt-meta { margin-top: 10px; font-size: 12px; opacity: .75; }

      .gt-chlist { margin-top: 14px; display: flex; flex-direction: column; gap: 10px; }
      .gt-chbtn {
        text-align: left; border-radius: 14px; padding: 12px;
        border: 1px solid rgba(255,255,255,0.10);
        background: rgba(255,255,255,0.03);
        color: rgba(255,255,255,0.92);
        cursor: pointer;
      }
      .gt-chbtn:hover { background: rgba(255,255,255,0.05); }
      .gt-chbtn--active {
        border: 1px solid rgba(255,255,255,0.26);
        background: rgba(255,255,255,0.08);
      }
      .gt-chbtn-title { font-weight: 900; font-size: 13px; }
      .gt-chbtn-sum { margin-top: 4px; font-size: 12px; opacity: .75; line-height: 1.35; }

      .gt-view { border-radius: 18px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.03); padding: 14px; }
      .gt-view-top { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
      .gt-kicker { font-size: 12px; opacity: .75; font-weight: 900; }
      .gt-step-title { font-size: 18px; font-weight: 950; margin-top: 4px; }
      .gt-step-body { margin-top: 8px; opacity: .9; line-height: 1.55; max-width: 920px; }

      .gt-nav { display: flex; gap: 10px; align-items: flex-start; }
      .gt-btn {
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.06);
        color: rgba(255,255,255,0.92);
        padding: 10px 12px;
        cursor: pointer;
        font-weight: 800;
      }
      .gt-btn:hover { background: rgba(255,255,255,0.08); }
      .gt-btn:disabled { cursor: not-allowed; opacity: .55; background: rgba(255,255,255,0.03); }

      .gt-media { margin-top: 14px; }
      .gt-figure {
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.10);
        background: rgba(0,0,0,0.25);
      }
      .gt-figure img { display: block; width: 100%; height: auto; }
      .gt-fallback { padding: 14px; opacity: .75; font-size: 13px; }
      .gt-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }

      .gt-callouts { margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap; }
      .gt-pill {
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.06);
        color: rgba(255,255,255,0.92);
        padding: 10px 12px;
        cursor: pointer;
        font-weight: 900;
        font-size: 12px;
      }
      .gt-pill:hover { background: rgba(255,255,255,0.08); }

      /* Modal */
      .gt-modal-backdrop {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.55);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
        z-index: 9999;
      }
      .gt-modal {
        width: min(920px, 100%);
        border-radius: 18px;
        background: rgba(15,15,18,0.92);
        border: 1px solid rgba(255,255,255,0.10);
        box-shadow: 0 12px 40px rgba(0,0,0,0.45);
        overflow: hidden;
      }
      .gt-modal-head {
        padding: 16px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .gt-modal-title { font-size: 16px; font-weight: 900; }
      .gt-modal-body { padding: 18px; line-height: 1.6; opacity: .95; }
      .gt-footnote { margin-top: 10px; font-size: 12px; opacity: .65; }
    `;
    const style = document.createElement("style");
    style.setAttribute("data-guided-tour", "true");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function render(container, tours) {
    let tourId = tours[0]?.id || "case-a";
    let idx = 0;
    let modalState = null;

    function getTour() {
      return tours.find((t) => t.id === tourId) || tours[0];
    }

    function flattenSteps(tour) {
      const flat = [];
      (tour.chapters || []).forEach((ch) => {
        (ch.steps || []).forEach((s) => flat.push({ chapter: ch, step: s }));
      });
      return flat;
    }

    function openModal(title, body) {
      modalState = { title, body };
      repaint();
    }

    function closeModal() {
      modalState = null;
      repaint();
    }

    function setTour(id) {
      tourId = id;
      idx = 0;
      repaint();
    }

    function go(delta) {
      const tour = getTour();
      const flat = flattenSteps(tour);
      idx = clamp(idx + delta, 0, Math.max(0, flat.length - 1));
      repaint();
    }

    function jumpToChapter(chId) {
      const tour = getTour();
      const flat = flattenSteps(tour);
      const i = flat.findIndex((x) => x.chapter.id === chId);
      idx = i >= 0 ? i : 0;
      repaint();
    }

    function repaint() {
      const tour = getTour();
      const flat = flattenSteps(tour);
      const current = flat[idx] || flat[0];
      const progress = flat.length ? Math.round(((idx + 1) / flat.length) * 100) : 0;

      container.innerHTML = "";

      // Header panel
      const header = el("div", { class: "gt-panel" }, [
        el("div", { style: "display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;" }, [
          el("div", { class: "gt-title" }, [safeText(tour.title)]),
          el("span", { class: "gt-badge" }, [safeText(tour.badge || "Guided Tour")]),
        ]),
        el("div", { class: "gt-subtitle" }, [safeText(tour.subtitle)]),
        tour.disclaimer ? el("div", { class: "gt-disclaimer" }, [safeText(tour.disclaimer)]) : null,

        // Tour tabs
        el("div", { class: "gt-tourtabs" }, tours.map((t) => {
          const active = t.id === tourId;
          return el("button", {
            class: "gt-tab" + (active ? " gt-tab--active" : ""),
            onclick: () => setTour(t.id),
            type: "button"
          }, [
            el("div", { class: "gt-tab-title" }, [safeText(t.subtitle)]),
            el("div", { class: "gt-tab-sub" }, [safeText(t.badge || "")]),
          ]);
        })),
      ]);

      // Aside (chapters)
      const progressInner = el("div", { style: `width:${progress}%;` }, []);
      const aside = el("aside", { class: "gt-aside" }, [
        el("div", { class: "gt-aside-title" }, ["Tour chapters"]),
        el("div", { class: "gt-progress" }, [progressInner]),
        el("div", { class: "gt-meta" }, [`Step ${idx + 1} / ${flat.length}`]),
        el("div", { class: "gt-chlist" },
          (tour.chapters || []).map((ch) => {
            const active = current && current.chapter && current.chapter.id === ch.id;
            return el("button", {
              class: "gt-chbtn" + (active ? " gt-chbtn--active" : ""),
              onclick: () => jumpToChapter(ch.id),
              type: "button",
            }, [
              el("div", { class: "gt-chbtn-title" }, [safeText(ch.title)]),
              el("div", { class: "gt-chbtn-sum" }, [safeText(ch.summary)]),
            ]);
          })
        ),
      ]);

      // Step view
      const view = el("div", { class: "gt-view" }, [
        el("div", { class: "gt-view-top" }, [
          el("div", {}, [
            el("div", { class: "gt-kicker" }, [safeText(current?.chapter?.title || "")]),
            el("div", { class: "gt-step-title" }, [safeText(current?.step?.title || "")]),
            el("div", { class: "gt-step-body" }, [safeText(current?.step?.body || "")]),
          ]),
          el("div", { class: "gt-nav" }, [
            el("button", {
              class: "gt-btn",
              onclick: () => go(-1),
              disabled: idx === 0 ? "disabled" : null,
              type: "button",
            }, ["Back"]),
            el("button", {
              class: "gt-btn",
              onclick: () => go(1),
              disabled: idx >= flat.length - 1 ? "disabled" : null,
              type: "button",
              style: "font-weight:950;background:rgba(255,255,255,0.10);",
            }, ["Next"]),
          ]),
        ]),

        // Media box
        el("div", { class: "gt-media" }, [
          (function () {
            const figure = el("div", { class: "gt-figure" }, []);
            const img = new Image();
            const src = safeText(current?.step?.image || "");
            img.alt = safeText(current?.step?.title || "TVAC screenshot");
            img.onload = function () {
              // Replace fallback with image
              figure.innerHTML = "";
              figure.appendChild(img);
            };
            img.onerror = function () {
              figure.innerHTML = "";
              figure.appendChild(el("div", { class: "gt-fallback" }, [
                "Screenshot not added yet. Place it at: ",
                el("span", { class: "gt-mono" }, [src || "(no path set)"]),
              ]));
            };
            // Trigger load
            if (src) img.src = src;
            else img.onerror();
            return figure;
          })(),
        ]),

        // Callouts pills
        Array.isArray(current?.step?.callouts) && current.step.callouts.length
          ? el("div", { class: "gt-callouts" }, current.step.callouts.map((c) => {
              return el("button", {
                class: "gt-pill",
                onclick: () => openModal(safeText(c.title), safeText(c.body)),
                type: "button",
              }, [safeText(c.title)]);
            }))
          : null,
      ]);

      const grid = el("div", { class: "gt-grid" }, [aside, view]);

      // Modal
      const modalBackdrop = el("div", {
        class: "gt-modal-backdrop",
        style: modalState ? "display:flex;" : "display:none;",
        onclick: closeModal,
      }, [
        el("div", { class: "gt-modal", onclick: (e) => e.stopPropagation() }, [
          el("div", { class: "gt-modal-head" }, [
            el("div", { class: "gt-modal-title" }, [safeText(modalState?.title || "Note")]),
            el("button", { class: "gt-btn", onclick: closeModal, type: "button" }, ["Close"]),
          ]),
          el("div", { class: "gt-modal-body" }, [safeText(modalState?.body || "")]),
        ]),
      ]);

      container.appendChild(el("div", { class: "gt-wrap" }, [header, grid, modalBackdrop, el("div", { class: "gt-footnote" }, [
        "Tip: You can add screenshots gradually. The tour works without them.",
      ])]));
    }

    repaint();
  }

  function init() {
    const data = window.TVACTourData;
    if (!data || !Array.isArray(data.tours) || data.tours.length === 0) return;

    // Inject CSS once
    if (!document.querySelector("style[data-guided-tour='true']")) buildStyles();

    const container = document.getElementById("guidedTour");
    if (!container) return;

    render(container, data.tours);
  }

  // Run after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
