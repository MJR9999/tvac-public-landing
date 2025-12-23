/* guided-tour/GuidedCaseTour.js
   TVAC Guided Tour – robust loader + modal tour (frontend-only)

   Goals:
   - Do NOT require index.html edits
   - If window.guidedTourData is missing, load guided-tour/guidedTourData.js dynamically
   - Hook into existing buttons (Start Guided Tour / View Guided Tour)
   - Provide a clean modal with Next/Back + keyboard + close
*/

(function () {
  const DATA_SCRIPT_SRC = "guided-tour/guidedTourData.js";

  // ---------- utilities ----------
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function getTourSteps() {
    // Accept multiple shapes to be future-proof
    if (Array.isArray(window.guidedTourData)) return window.guidedTourData;
    if (window.TVAC_GUIDED_TOUR && Array.isArray(window.TVAC_GUIDED_TOUR.steps))
      return window.TVAC_GUIDED_TOUR.steps;
    if (window.TVAC_GUIDED_TOUR && Array.isArray(window.TVAC_GUIDED_TOUR.steps?.steps))
      return window.TVAC_GUIDED_TOUR.steps.steps;
    return null;
  }

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      // already loaded?
      const existing = Array.from(document.scripts).find((s) => (s.src || "").includes(src));
      if (existing) return resolve(true);

      const s = document.createElement("script");
      // cache-bust to avoid stale CDN/browser cache while you iterate
      s.src = src + (src.includes("?") ? "&" : "?") + "v=" + Date.now();
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.head.appendChild(s);
    });
  }

  function ensureTourDataLoaded() {
    return new Promise(async (resolve) => {
      // quick path
      if (getTourSteps()) return resolve(true);

      // try to load data file
      try {
        await loadScriptOnce(DATA_SCRIPT_SRC);

        // give the script a tick to attach window.guidedTourData
        await sleep(25);

        if (getTourSteps()) return resolve(true);
        return resolve(false);
      } catch (e) {
        return resolve(false);
      }
    });
  }

  // ---------- UI: small status line under buttons ----------
  function setStatus(kind, text) {
    const el =
      document.querySelector("[data-guided-tour-status]") ||
      document.getElementById("guidedTourStatus") ||
      null;

    if (!el) return;

    el.textContent = text || "";
    el.style.display = text ? "block" : "none";

    // optional mild styling
    el.style.marginTop = "12px";
    el.style.fontSize = "14px";
    el.style.opacity = "0.85";

    if (kind === "error") el.style.opacity = "0.95";
  }

  // ---------- Modal ----------
  function buildModal() {
    // If already exists, reuse
    let overlay = document.getElementById("tvacGuidedTourOverlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "tvacGuidedTourOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(6px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 24px;
    `;

    const panel = document.createElement("div");
    panel.id = "tvacGuidedTourPanel";
    panel.style.cssText = `
      width: min(980px, 100%);
      max-height: 90vh;
      overflow: auto;
      background: rgba(255,255,255,0.96);
      border-radius: 18px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.35);
      border: 1px solid rgba(0,0,0,0.08);
    `;

    panel.innerHTML = `
      <div style="padding: 18px 18px 10px 18px; display:flex; gap:12px; align-items:center; justify-content:space-between;">
        <div style="display:flex; flex-direction:column; gap:2px;">
          <div id="tvacGTKicker" style="font-size:12px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.7;">GUIDED TOUR</div>
          <div id="tvacGTTitle" style="font-size:22px; font-weight:700; line-height:1.25;">—</div>
          <div id="tvacGTSub" style="font-size:14px; opacity:0.8; line-height:1.4;">—</div>
        </div>

        <button id="tvacGTClose" aria-label="Close" style="
          border: 1px solid rgba(0,0,0,0.12);
          background: rgba(255,255,255,0.7);
          border-radius: 12px;
          padding: 10px 12px;
          cursor: pointer;
          font-weight: 600;
        ">Close ✕</button>
      </div>

      <div style="padding: 0 18px 18px 18px;">
        <div id="tvacGTImageWrap" style="
          background: rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 16px;
          overflow: hidden;
          margin-top: 10px;
        ">
          <img id="tvacGTImage" alt="" style="display:none; width:100%; height:auto;" />
          <div id="tvacGTNoImage" style="padding: 18px; font-size:14px; opacity:0.8;">
            No image for this step.
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr; gap: 14px; margin-top: 14px;">
          <ul id="tvacGTBullets" style="margin:0; padding-left: 18px; line-height:1.55; font-size: 15px;"></ul>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; gap: 10px; margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.08);">
          <div id="tvacGTStepCounter" style="font-size:13px; opacity:0.8;">Step —</div>

          <div style="display:flex; gap:10px; align-items:center;">
            <button id="tvacGTPrev" style="
              border: 1px solid rgba(0,0,0,0.12);
              background: rgba(255,255,255,0.7);
              border-radius: 12px;
              padding: 10px 12px;
              cursor: pointer;
              font-weight: 600;
              min-width: 92px;
            ">← Back</button>

            <button id="tvacGTNext" style="
              border: 1px solid rgba(0,0,0,0.12);
              background: rgba(255,255,255,0.9);
              border-radius: 12px;
              padding: 10px 12px;
              cursor: pointer;
              font-weight: 700;
              min-width: 92px;
            ">Next →</button>
          </div>
        </div>
      </div>
    `;

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // close on backdrop click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) hideModal();
    });

    // close on button
    panel.querySelector("#tvacGTClose").addEventListener("click", hideModal);

    // keyboard
    document.addEventListener("keydown", (e) => {
      if (overlay.style.display !== "flex") return;
      if (e.key === "Escape") hideModal();
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    });

    // nav buttons
    panel.querySelector("#tvacGTNext").addEventListener("click", nextStep);
    panel.querySelector("#tvacGTPrev").addEventListener("click", prevStep);

    return overlay;
  }

  let currentIndex = 0;
  let stepsCache = null;

  function renderStep() {
    const overlay = buildModal();
    const panel = document.getElementById("tvacGuidedTourPanel");
    const step = stepsCache[currentIndex];

    panel.querySelector("#tvacGTKicker").textContent = step.kicker || "GUIDED TOUR";
    panel.querySelector("#tvacGTTitle").textContent = step.title || "—";
    panel.querySelector("#tvacGTSub").textContent = step.subtitle || "";

    const img = panel.querySelector("#tvacGTImage");
    const noImg = panel.querySelector("#tvacGTNoImage");

    if (step.image) {
      img.src = step.image;
      img.alt = step.imageAlt || step.title || "Guided Tour step image";
      img.style.display = "block";
      noImg.style.display = "none";
    } else {
      img.removeAttribute("src");
      img.style.display = "none";
      noImg.style.display = "block";
    }

    const ul = panel.querySelector("#tvacGTBullets");
    ul.innerHTML = "";
    (step.bullets || []).forEach((b) => {
      const li = document.createElement("li");
      li.textContent = b;
      ul.appendChild(li);
    });

    panel.querySelector("#tvacGTStepCounter").textContent =
      `Step ${currentIndex + 1} of ${stepsCache.length}`;

    // button disable states
    panel.querySelector("#tvacGTPrev").disabled = currentIndex === 0;
    panel.querySelector("#tvacGTPrev").style.opacity = currentIndex === 0 ? "0.5" : "1";
    panel.querySelector("#tvacGTPrev").style.cursor = currentIndex === 0 ? "not-allowed" : "pointer";

    const isLast = currentIndex === stepsCache.length - 1;
    panel.querySelector("#tvacGTNext").textContent = isLast ? "Done ✓" : "Next →";
  }

  function showModal() {
    const overlay = buildModal();
    overlay.style.display = "flex";
    renderStep();
  }

  function hideModal() {
    const overlay = document.getElementById("tvacGuidedTourOverlay");
    if (overlay) overlay.style.display = "none";
  }

  function nextStep() {
    if (!stepsCache) return;
    if (currentIndex >= stepsCache.length - 1) return hideModal();
    currentIndex += 1;
    renderStep();
  }

  function prevStep() {
    if (!stepsCache) return;
    if (currentIndex <= 0) return;
    currentIndex -= 1;
    renderStep();
  }

  // ---------- Hook into existing landing buttons ----------
  function findStartButtons() {
    const candidates = [];

    // common ids / data attrs (try a lot, but harmless)
    [
      "#startGuidedTour",
      "#start-guided-tour",
      "[data-action='start-guided-tour']",
      "[data-guided-tour-start]",
      "a[href*='#guided-tour']",
      "a[href*='#guidedTour']",
      "button"
    ].forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => candidates.push(el));
    });

    // Filter to only elements that look like the start buttons
    return candidates.filter((el) => {
      const t = (el.textContent || "").trim().toLowerCase();
      return (
        t.includes("start guided tour") ||
        t.includes("view guided tour") ||
        t === "guided tour" ||
        (el.getAttribute("href") || "").toLowerCase().includes("guided")
      );
    });
  }

  async function startTour() {
    setStatus("", "Loading tour…");

    const ok = await ensureTourDataLoaded();
    stepsCache = getTourSteps();

    if (!ok || !stepsCache || !stepsCache.length) {
      setStatus("error", "Guided Tour unavailable. No tour data found.");
      return;
    }

    setStatus("", ""); // clear
    currentIndex = 0;
    showModal();
  }

  function attach() {
    // status line (optional)
    // If your index.html already has a place for this, great.
    // If not, we won’t inject anything disruptive.
    const statusEl =
      document.querySelector("[data-guided-tour-status]") ||
      document.getElementById("guidedTourStatus") ||
      null;

    if (statusEl) {
      statusEl.style.display = "none";
    }

    // hook buttons
    const btns = findStartButtons();
    btns.forEach((b) => {
      // Avoid double-binding
      if (b.__tvacGuidedTourBound) return;
      b.__tvacGuidedTourBound = true;

      b.addEventListener("click", (e) => {
        // allow normal anchor jumps if user holds cmd/ctrl etc.
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        startTour();
      });
    });

    // If there’s a Start button inside the card rendered as a <button>,
    // it will be caught above. Otherwise, tour can still be started via nav.
  }

  // Wait until DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attach);
  } else {
    attach();
  }

  // Expose for debugging/manual triggering
  window.TVAC_START_GUIDED_TOUR = startTour;
})();
