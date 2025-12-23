/* guided-tour/GuidedCaseTour.js
   Frontend-only Guided Tour renderer (no dependencies).
   Renders into: <div id="guidedTour"></div>
   Requires: guidedTourData.js loaded before this file.
*/
(function () {
  "use strict";

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k.startsWith("on") && typeof attrs[k] === "function") node.addEventListener(k.slice(2), attrs[k]);
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (children && children.length) {
      children.forEach((c) => {
        if (c === null || c === undefined) return;
        node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function injectStylesOnce() {
    if (document.getElementById("gt-styles")) return;

    const css = `
      .gt-wrap {
        margin-top: 14px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 16px;
        padding: 14px;
      }
      .gt-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .gt-meta {
        color: rgba(255,255,255,0.70);
        font-size: 13px;
      }
      .gt-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .gt-btn {
        appearance: none;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.06);
        color: rgba(255,255,255,0.92);
        padding: 10px 12px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        transition: transform .08s ease, background .12s ease, border-color .12s ease;
      }
      .gt-btn:hover {
        background: rgba(255,255,255,0.10);
        border-color: rgba(255,255,255,0.18);
      }
      .gt-btn:active { transform: translateY(1px); }
      .gt-btn.primary {
        background: linear-gradient(180deg, rgba(255,127,48,0.95), rgba(255,127,48,0.78));
        border-color: rgba(255,127,48,0.35);
        color: #071018;
      }
      .gt-btn.primary:hover {
        background: linear-gradient(180deg, rgba(255,145,72,0.95), rgba(255,127,48,0.82));
      }

      /* Modal */
      .gt-modal {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: none;
      }
      .gt-modal.open { display: block; }
      .gt-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.66);
        backdrop-filter: blur(6px);
      }
      .gt-dialog {
        position: relative;
        width: min(980px, calc(100vw - 28px));
        max-height: calc(100vh - 28px);
        margin: 14px auto;
        background: rgba(10,16,24,0.92);
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 30px 80px rgba(0,0,0,0.55);
      }
      .gt-header {
        padding: 16px 16px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.10);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }
      .gt-title {
        font-size: 16px;
        font-weight: 900;
        color: rgba(255,255,255,0.92);
        margin: 0;
      }
      .gt-subtitle {
        margin-top: 6px;
        color: rgba(255,255,255,0.70);
        font-size: 13px;
        line-height: 1.35;
      }
      .gt-close {
        appearance: none;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
        color: rgba(255,255,255,0.88);
        padding: 8px 10px;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 800;
      }

      .gt-body {
        padding: 14px 16px 16px;
        overflow: auto;
        max-height: calc(100vh - 150px);
      }

      .gt-progress {
        height: 8px;
        border-radius: 999px;
        background: rgba(255,255,255,0.08);
        overflow: hidden;
        margin: 10px 0 0;
      }
      .gt-progress > div {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, rgba(255,127,48,0.95), rgba(255,210,140,0.85));
      }

      .gt-step-kicker {
        color: rgba(255,127,48,0.95);
        font-weight: 900;
        letter-spacing: .14em;
        text-transform: uppercase;
        font-size: 11px;
        margin: 0 0 8px;
      }
      .gt-step-title {
        margin: 0 0 10px;
        font-size: 22px;
        line-height: 1.15;
        font-weight: 950;
        color: rgba(255,255,255,0.92);
      }
      .gt-step-body {
        color: rgba(255,255,255,0.75);
        line-height: 1.55;
        margin: 0 0 12px;
        font-size: 14px;
      }
      .gt-grid {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 14px;
      }
      @media (max-width: 860px) {
        .gt-grid { grid-template-columns: 1fr; }
      }

      .gt-card {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 16px;
        padding: 12px;
      }
      .gt-card h4 {
        margin: 0 0 8px;
        font-size: 13px;
        color: rgba(255,255,255,0.86);
      }
      .gt-card p, .gt-card li {
        color: rgba(255,255,255,0.70);
        font-size: 13px;
        line-height: 1.5;
      }
      .gt-bullets {
        margin: 0;
        padding-left: 18px;
      }

      .gt-image {
        display: block;
        width: 100%;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(0,0,0,0.35);
        cursor: zoom-in;
      }
      .gt-caption {
        margin-top: 8px;
        font-size: 12px;
        color: rgba(255,255,255,0.62);
      }

      .gt-footer {
        padding: 12px 16px 16px;
        border-top: 1px solid rgba(255,255,255,0.10);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .gt-nav {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .gt-link {
        color: rgba(255,127,48,0.95);
        font-weight: 800;
        text-decoration: none;
      }
      .gt-stepcount {
        color: rgba(255,255,255,0.60);
        font-size: 13px;
      }

      /* Image zoom */
      .gt-zoom {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: none;
      }
      .gt-zoom.open { display: block; }
      .gt-zoom .gt-backdrop { background: rgba(0,0,0,0.78); }
      .gt-zoom img {
        position: relative;
        display: block;
        margin: 18px auto;
        max-width: min(1200px, calc(100vw - 36px));
        max-height: calc(100vh - 36px);
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(0,0,0,0.35);
        cursor: zoom-out;
      }
    `;

    const style = document.createElement("style");
    style.id = "gt-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function GuidedTour(mount, data) {
    injectStylesOnce();

    const tour = (data && data.tours && data.tours[0]) || null;
    if (!tour) {
      mount.innerHTML =
        '<div style="color:rgba(255,255,255,0.70);font-size:13px;">Guided Tour data not found.</div>';
      return;
    }

    let stepIndex = 0;

    // Inline widget
    const wrap = el("div", { class: "gt-wrap" }, []);
    const metaText =
      (tour.meta && (tour.meta.durationLabel || tour.meta.audienceLabel))
        ? `${tour.meta.durationLabel ? `⏱ ${tour.meta.durationLabel}` : ""}${
            tour.meta.durationLabel && tour.meta.audienceLabel ? " · " : ""
          }${tour.meta.audienceLabel ? `For: ${tour.meta.audienceLabel}` : ""}`
        : "";

    const top = el("div", { class: "gt-top" }, [
      el("div", null, [
        el("div", { class: "gt-meta" }, [metaText || "Preview a decision-grade TVAC report walkthrough."]),
      ]),
      el("div", { class: "gt-actions" }, [
        el(
          "button",
          {
            class: "gt-btn primary",
            onclick: function () {
              openModal();
            },
            type: "button",
          },
          ["Start Guided Tour →"]
        ),
        el(
          "button",
          {
            class: "gt-btn",
            onclick: function () {
              // Smooth scroll to Product Proof section (optional) if user wants.
              const proof = document.querySelector("#productproof") || document.querySelector("#product-proof");
              if (proof) proof.scrollIntoView({ behavior: "smooth", block: "start" });
            },
            type: "button",
          },
          ["Skip to Product Proof ↓"]
        ),
      ]),
    ]);

    wrap.appendChild(top);
    mount.appendChild(wrap);

    // Modal skeleton
    const modal = el("div", { class: "gt-modal", role: "dialog", "aria-modal": "true" }, []);
    const backdrop = el("div", {
      class: "gt-backdrop",
      onclick: function () {
        closeModal();
      },
    });

    const dialog = el("div", { class: "gt-dialog" }, []);
    const header = el("div", { class: "gt-header" }, []);
    const headerLeft = el("div", null, [
      el("div", { class: "gt-title" }, [tour.title]),
      el("div", { class: "gt-subtitle" }, [tour.subtitle || ""]),
      el("div", { class: "gt-progress" }, [el("div", { id: "gt-progressbar" }, [])]),
    ]);

    const closeBtn = el(
      "button",
      {
        class: "gt-close",
        onclick: function () {
          closeModal();
        },
        type: "button",
      },
      ["Close ✕"]
    );

    header.appendChild(headerLeft);
    header.appendChild(closeBtn);

    const body = el("div", { class: "gt-body", id: "gt-body" }, []);
    const footer = el("div", { class: "gt-footer" }, []);
    const stepCount = el("div", { class: "gt-stepcount", id: "gt-stepcount" }, []);
    const nav = el("div", { class: "gt-nav" }, []);

    const prevBtn = el(
      "button",
      {
        class: "gt-btn",
        onclick: function () {
          stepIndex = clamp(stepIndex - 1, 0, tour.steps.length - 1);
          renderStep();
        },
        type: "button",
      },
      ["← Back"]
    );
    const nextBtn = el(
      "button",
      {
        class: "gt-btn primary",
        onclick: function () {
          stepIndex = clamp(stepIndex + 1, 0, tour.steps.length - 1);
          renderStep();
        },
        type: "button",
      },
      ["Next →"]
    );

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);

    footer.appendChild(stepCount);
    footer.appendChild(nav);

    dialog.appendChild(header);
    dialog.appendChild(body);
    dialog.appendChild(footer);

    modal.appendChild(backdrop);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    // Image zoom overlay
    const zoom = el("div", { class: "gt-zoom", id: "gt-zoom" }, []);
    const zoomBackdrop = el("div", {
      class: "gt-backdrop",
      onclick: function () {
        closeZoom();
      },
    });
    const zoomImg = el("img", { id: "gt-zoom-img", alt: "Zoomed image" }, []);
    zoomImg.addEventListener("click", closeZoom);
    zoom.appendChild(zoomBackdrop);
    zoom.appendChild(zoomImg);
    document.body.appendChild(zoom);

    function openZoom(src, alt) {
      zoomImg.src = src;
      zoomImg.alt = alt || "Zoomed image";
      zoom.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeZoom() {
      zoom.classList.remove("open");
      zoomImg.src = "";
      zoomImg.alt = "Zoomed image";
      // keep body locked if modal still open
      if (!modal.classList.contains("open")) document.body.style.overflow = "";
    }

    function renderStep() {
      const step = tour.steps[stepIndex];
      if (!step) return;

      // Progress
      const pct = ((stepIndex + 1) / tour.steps.length) * 100;
      const pb = document.getElementById("gt-progressbar");
      if (pb) pb.style.width = pct.toFixed(1) + "%";

      // Step count + button state
      const sc = document.getElementById("gt-stepcount");
      if (sc) sc.textContent = `Step ${stepIndex + 1} of ${tour.steps.length}`;
      prevBtn.disabled = stepIndex === 0;
      prevBtn.style.opacity = stepIndex === 0 ? "0.55" : "1";
      nextBtn.textContent = stepIndex === tour.steps.length - 1 ? "Done ✓" : "Next →";

      // Body render
      body.innerHTML = "";

      const left = el("div", { class: "gt-card" }, [
        el("div", { class: "gt-step-kicker" }, [step.kicker || ""]),
        el("h3", { class: "gt-step-title" }, [step.title || ""]),
        step.body ? el("p", { class: "gt-step-body" }, [step.body]) : null,
      ]);

      if (step.bullets && step.bullets.length) {
        left.appendChild(el("ul", { class: "gt-bullets" }, step.bullets.map((b) => el("li", null, [b]))));
      }

      if (step.ctas && step.ctas.length) {
        const ctaWrap = el("div", { style: "margin-top:12px;display:flex;gap:12px;flex-wrap:wrap;" }, []);
        step.ctas.forEach((c) => {
          ctaWrap.appendChild(
            el(
              "a",
              {
                class: "gt-link",
                href: c.href,
              },
              [c.label]
            )
          );
        });
        left.appendChild(ctaWrap);
      }

      const right = el("div", { class: "gt-card" }, []);

      // Image block
      if (step.image && step.image.src) {
        const img = el("img", {
          class: "gt-image",
          src: step.image.src,
          alt: step.image.alt || "Guided tour image",
          onclick: function () {
            openZoom(step.image.src, step.image.alt);
          },
        });
        right.appendChild(img);
        if (step.image.caption) {
          right.appendChild(el("div", { class: "gt-caption" }, [step.image.caption]));
        }
      } else {
        right.appendChild(
          el("div", { style: "color:rgba(255,255,255,0.65);font-size:13px;line-height:1.5;" }, [
            "No screenshot on this step — focus is on the logic and what the report provides.",
          ])
        );
      }

      // Callouts
      if (step.callouts && step.callouts.length) {
        const calloutBox = el("div", { style: "margin-top:12px;" }, []);
        step.callouts.forEach((c) => {
          const box = el("div", { style: "margin-top:10px;" }, [
            el("h4", null, [c.title || "Note"]),
            el("p", { style: "margin:0;" }, [c.text || ""]),
          ]);
          calloutBox.appendChild(box);
        });
        right.appendChild(calloutBox);
      }

      const grid = el("div", { class: "gt-grid" }, [left, right]);
      body.appendChild(grid);

      // Done button behavior
      if (stepIndex === tour.steps.length - 1) {
        nextBtn.onclick = function () {
          closeModal();
        };
      } else {
        nextBtn.onclick = function () {
          stepIndex = clamp(stepIndex + 1, 0, tour.steps.length - 1);
          renderStep();
        };
      }
    }

    function openModal() {
      stepIndex = 0;
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      renderStep();
    }

    function closeModal() {
      modal.classList.remove("open");
      closeZoom();
      document.body.style.overflow = "";
    }

    // Keyboard controls
    document.addEventListener("keydown", function (e) {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepIndex = clamp(stepIndex + 1, 0, tour.steps.length - 1);
        renderStep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepIndex = clamp(stepIndex - 1, 0, tour.steps.length - 1);
        renderStep();
      }
    });
  }

  function boot() {
    const mount = document.getElementById("guidedTour");
    if (!mount) return;

    const data = window.GUIDED_TOUR_DATA;
    try {
      GuidedTour(mount, data);
    } catch (err) {
      console.error("[GuidedTour] render error:", err);
      mount.innerHTML =
        '<div style="color:rgba(255,255,255,0.70);font-size:13px;">Guided Tour failed to load. Email <a href="mailto:michael@tvacai.com">michael@tvacai.com</a>.</div>';
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
