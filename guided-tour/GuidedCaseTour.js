/* guided-tour/GuidedCaseTour.js
   Vanilla JS guided tour (frontend-only).
   Mounts into: #guided-tour-app
   Uses data from: window.TVAC_GUIDED_TOURS
*/

(function () {
  const mount = document.getElementById("guided-tour-app");
  if (!mount) return;

  // Inject minimal CSS (scoped with .gt-*)
  const css = `
  .gt-shell{ margin-top:14px; }
  .gt-note{ color: var(--muted); font-size: 14px; margin: 10px 0 0; }
  .gt-pill{
    display:inline-flex; align-items:center; gap:8px;
    padding: 8px 10px; border-radius: 999px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.03);
    color: var(--muted);
    font-size: 12.5px;
  }
  [data-theme="light"] .gt-pill{ background: rgba(0,0,0,0.02); }

  .gt-modal{
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.72);
    display: none; align-items: center; justify-content: center;
    z-index: 2000;
    padding: 20px;
  }
  .gt-modal.open{ display:flex; }

  .gt-card{
    width: min(1060px, 100%);
    max-height: 88vh;
    background: rgba(10,12,18,0.92);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 30px 110px rgba(0,0,0,0.55);
  }
  [data-theme="light"] .gt-card{
    background: rgba(255,255,255,0.95);
    border-color: rgba(0,0,0,0.14);
  }

  .gt-top{
    display:flex; align-items:center; justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.10);
  }
  [data-theme="light"] .gt-top{ border-bottom-color: rgba(0,0,0,0.10); }

  .gt-title{
    font-weight: 650;
    font-size: 13px;
    color: var(--muted);
    display:flex; flex-wrap: wrap; gap: 10px; align-items:center;
  }

  .gt-close{
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.04);
    color: var(--text);
    border-radius: 999px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 12px;
  }
  [data-theme="light"] .gt-close{ background: rgba(0,0,0,0.02); }

  .gt-body{
    display:grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 0;
    max-height: calc(88vh - 56px);
  }
  @media (max-width: 980px){
    .gt-body{ grid-template-columns: 1fr; }
  }

  .gt-imageWrap{
    background: rgba(0,0,0,0.20);
    display:flex; align-items:center; justify-content:center;
    padding: 10px;
    border-right: 1px solid rgba(255,255,255,0.10);
  }
  [data-theme="light"] .gt-imageWrap{
    background: rgba(0,0,0,0.03);
    border-right-color: rgba(0,0,0,0.10);
  }
  @media (max-width: 980px){
    .gt-imageWrap{ border-right: none; border-bottom: 1px solid rgba(255,255,255,0.10); }
    [data-theme="light"] .gt-imageWrap{ border-bottom-color: rgba(0,0,0,0.10); }
  }

  .gt-image{
    width: 100%;
    height: 100%;
    max-height: 78vh;
    object-fit: contain;
    display:block;
  }

  .gt-right{
    padding: 16px 16px 14px;
    overflow: auto;
  }

  .gt-kicker{
    color: var(--accent);
    font-weight: 700;
    letter-spacing: 2.2px;
    text-transform: uppercase;
    font-size: 11.5px;
    margin: 0 0 8px;
  }
  .gt-h{
    margin: 0 0 10px;
    font-size: 22px;
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.2px;
  }
  .gt-p{
    margin: 0;
    color: var(--muted);
    font-size: 14.5px;
    line-height: 1.6;
  }

  .gt-progress{
    margin-top: 14px;
    display:flex; align-items:center; justify-content: space-between;
    gap: 12px;
  }
  .gt-bar{
    flex: 1;
    height: 7px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.08);
    overflow:hidden;
  }
  [data-theme="light"] .gt-bar{ background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.06); }
  .gt-barFill{
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--accent-2), var(--accent));
    width: 0%;
  }
  .gt-stepText{ color: var(--muted-2); font-size: 12.5px; white-space: nowrap; }

  .gt-controls{
    display:flex; flex-wrap: wrap; gap: 10px;
    margin-top: 14px;
  }

  .gt-btn{
    display:inline-flex; align-items:center; justify-content:center;
    gap:8px;
    padding: 10px 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.03);
    color: var(--text);
    font-weight: 650;
    font-size: 13px;
    cursor: pointer;
    text-decoration:none;
    transition: 140ms ease;
    white-space: nowrap;
  }
  [data-theme="light"] .gt-btn{ background: rgba(0,0,0,0.02); }
  .gt-btn:hover{ transform: translateY(-1px); border-color: var(--border-2); text-decoration:none; }
  .gt-btnPrimary{
    border: none;
    color: #15110b;
    background: linear-gradient(90deg, var(--accent-2), var(--accent));
    box-shadow: 0 10px 30px rgba(255,154,60,0.18);
  }
  .gt-btn:disabled{
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }
  `;
  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // Data
  const data = window.TVAC_GUIDED_TOURS;
  const tours = (data && data.tours) ? data.tours : [];
  const defaultId = (data && data.defaultTourId) ? data.defaultTourId : (tours[0] && tours[0].id);

  function getTourById(id) {
    return tours.find(t => t.id === id) || tours[0] || null;
  }

  const tour = getTourById(defaultId);
  if (!tour || !Array.isArray(tour.steps) || tour.steps.length === 0) {
    mount.innerHTML = `<div class="gt-shell"><span class="gt-pill">Guided Tour unavailable</span><div class="gt-note">No tour data found.</div></div>`;
    return;
  }

  // Modal skeleton
  const modal = document.createElement("div");
  modal.className = "gt-modal";
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <div class="gt-card" role="dialog" aria-modal="true" aria-label="TVAC Guided Tour">
      <div class="gt-top">
        <div class="gt-title">
          <span class="gt-pill">GUIDED TOUR</span>
          <span>${escapeHtml(tour.title || "TVAC Guided Tour")}</span>
        </div>
        <button class="gt-close" type="button" aria-label="Close">Close ✕</button>
      </div>

      <div class="gt-body">
        <div class="gt-imageWrap">
          <img class="gt-image" alt="" />
        </div>
        <div class="gt-right">
          <div class="gt-kicker"></div>
          <div class="gt-h"></div>
          <p class="gt-p"></p>

          <div class="gt-progress" aria-label="Tour progress">
            <div class="gt-bar"><div class="gt-barFill"></div></div>
            <div class="gt-stepText"></div>
          </div>

          <div class="gt-controls">
            <button class="gt-btn" type="button" data-action="prev">← Previous</button>
            <button class="gt-btn gt-btnPrimary" type="button" data-action="next">Next →</button>
            <a class="gt-btn" data-action="ctaPrimary" href="#" style="display:none;">Request Deep Assessment →</a>
            <a class="gt-btn" data-action="ctaSecondary" href="#" style="display:none;">Ask a question</a>
          </div>

          <p class="gt-note" style="margin-top:12px;">
            Tip: Use <b>←</b>/<b>→</b> to navigate and <b>Esc</b> to close.
          </p>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const imgEl = modal.querySelector(".gt-image");
  const kickerEl = modal.querySelector(".gt-kicker");
  const hEl = modal.querySelector(".gt-h");
  const pEl = modal.querySelector(".gt-p");
  const barFill = modal.querySelector(".gt-barFill");
  const stepText = modal.querySelector(".gt-stepText");
  const closeBtn = modal.querySelector(".gt-close");
  const prevBtn = modal.querySelector('[data-action="prev"]');
  const nextBtn = modal.querySelector('[data-action="next"]');
  const ctaPrimary = modal.querySelector('[data-action="ctaPrimary"]');
  const ctaSecondary = modal.querySelector('[data-action="ctaSecondary"]');

  let idx = 0;

  function render() {
    const steps = tour.steps;
    const step = steps[idx];

    kickerEl.textContent = step.kicker || "";
    hEl.textContent = step.title || "";
    pEl.textContent = step.body || "";

    imgEl.alt = step.imageAlt || step.title || "Guided tour image";
    imgEl.onerror = null;
    imgEl.src = step.image || "";

    // Buttons
    prevBtn.disabled = idx === 0;
    const last = idx === steps.length - 1;
    nextBtn.textContent = last ? "Finish ✕" : "Next →";

    // Progress
    const pct = Math.round(((idx + 1) / steps.length) * 100);
    barFill.style.width = pct + "%";
    stepText.textContent = `Step ${idx + 1} / ${steps.length}`;

    // CTA only on last step
    if (last && tour.cta && tour.cta.primaryHref) {
      ctaPrimary.style.display = "inline-flex";
      ctaPrimary.textContent = tour.cta.primaryLabel || "Request Deep Assessment →";
      ctaPrimary.href = tour.cta.primaryHref;
      ctaPrimary.target = tour.cta.primaryHref.startsWith("http") ? "_blank" : "_self";
      ctaPrimary.rel = "noreferrer";

      if (tour.cta.secondaryHref) {
        ctaSecondary.style.display = "inline-flex";
        ctaSecondary.textContent = tour.cta.secondaryLabel || "Ask a question";
        ctaSecondary.href = tour.cta.secondaryHref;
        ctaSecondary.target = tour.cta.secondaryHref.startsWith("http") ? "_blank" : "_self";
        ctaSecondary.rel = "noreferrer";
      } else {
        ctaSecondary.style.display = "none";
      }
    } else {
      ctaPrimary.style.display = "none";
      ctaSecondary.style.display = "none";
    }
  }

  function open() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    render();
  }

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  function next() {
    const steps = tour.steps;
    if (idx >= steps.length - 1) {
      close();
      return;
    }
    idx += 1;
    render();
  }

  function prev() {
    if (idx <= 0) return;
    idx -= 1;
    render();
  }

  // Wire modal controls
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  // Keyboard nav
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Mount small status (optional)
  mount.innerHTML = `
    <div class="gt-shell">
      <span class="gt-pill">Ready: ${escapeHtml(tour.steps.length + " steps")}</span>
    </div>
  `;

  // Wire landing page buttons
  const startBtn = document.getElementById("gtStartBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      idx = 0;
      open();
    });
  }

  const openTocBtn = document.getElementById("gtOpenTocBtn");
  if (openTocBtn) {
    openTocBtn.addEventListener("click", () => {
      // Open the existing screenshot in your lightbox if present; otherwise open tour at TOC step.
      const tocCard = document.querySelector('.shotCard[data-src="assets/tvac-report-toc-result.png"]');
      if (tocCard) tocCard.click();
      else {
        idx = 1;
        open();
      }
    });
  }

  // Helper
  function escapeHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
