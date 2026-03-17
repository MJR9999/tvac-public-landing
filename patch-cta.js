/* guided-tour/patch-cta.js
   Robust patching for:
   - Product Tour buttons (hero + card)
   - Stripe payment links in Pricing section
   - In-tour buttons + copy polish (Step 1 titles, remove 'WOW' etc.)
*/

(function () {
 const STRIPE = {
  singleReport: "https://buy.stripe.com/28E4gz6eZ8vM7Zq2CK2ZO08",
  pro6: "https://buy.stripe.com/cNieVd1YJ4fwgvW9182ZO0a",
  pro12: "https://buy.stripe.com/3cIdR932NcM24Nefpw2ZO0b",
};

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function safeOpenTour(caseId) {
    if (window.TVACProductTour && typeof window.TVACProductTour.open === "function") {
      window.TVACProductTour.open(caseId || "case-a");
      return true;
    }
    return false;
  }

  function openTourCaseA(e) {
    if (e) e.preventDefault();
    if (!safeOpenTour("case-a")) {
      alert("Product Tour failed to load. Please refresh and try again.");
    }
  }

  function patchTourEntryButtons() {
    // Explicit targets (preferred)
    document.querySelectorAll('[data-gt="start"], [data-gt="toc"]').forEach((node) => {
      node.addEventListener("click", openTourCaseA);
      if (node.tagName === "A") node.setAttribute("href", "#product-tour");
    });

    // Fallback matching by text (in case markup changes)
    const candidates = Array.from(document.querySelectorAll("a, button")).filter((node) => {
      const t = (node.textContent || "").trim().toLowerCase();
      return (
        t.includes("start guided tour") ||
        t.includes("view product tour") ||
        t.includes("view guided tour") ||
        t.includes("guided tour (see real output)") ||
        (t === "product tour") ||
        t.includes("see report structure (toc)")
      );
    });

    candidates.forEach((node) => {
      node.addEventListener("click", openTourCaseA);
      if (node.tagName === "A") node.setAttribute("href", "#product-tour");
    });
  }

  function patchPricingLinks() {
    const anchors = Array.from(document.querySelectorAll("a"));

    function applyToText(matchFn, href) {
      anchors.forEach((a) => {
        const txt = (a.textContent || "").trim().toLowerCase();
        if (matchFn(txt)) {
          a.setAttribute("href", href);
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
      });
    }

    applyToText(
      (t) => t.includes("order deep assessment") || t.includes("order a deep assessment"),
      STRIPE.singleReport
    );
    applyToText((t) => t.includes("start 6-month pro") || t.includes("6-month") || t.includes("€325"), STRIPE.pro6);
    applyToText((t) => t.includes("start 12-month pro") || t.includes("12-month") || t.includes("€275"), STRIPE.pro12);

    // Failsafe: replace mailto: links on pricing CTAs
    anchors.forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const txt = (a.textContent || "").trim().toLowerCase();
      if (!href.startsWith("mailto:")) return;

      if (txt.includes("order")) {
        a.setAttribute("href", STRIPE.singleReport);
      } else if (txt.includes("12-month") || txt.includes("€275")) {
        a.setAttribute("href", STRIPE.pro12);
      } else if (txt.includes("6-month") || txt.includes("€325")) {
        a.setAttribute("href", STRIPE.pro6);
      } else {
        return;
      }
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
  }

  // ---- In-tour polish ----

  function inTourRoot() {
    // The tour is injected as a lightbox modal. We try multiple selectors.
    return (
      document.querySelector('#lightbox[aria-hidden="false"]') ||
      document.querySelector("#lightbox:not([aria-hidden])") ||
      document.querySelector('.lightbox:not([aria-hidden])') ||
      null
    );
  }

  function polishTourCopy(root) {
    // Remove "(WOW)" if present
    root.querySelectorAll("h2, h3, .stepTitle").forEach((el) => {
      const t = (el.textContent || "").trim();
      if (t.includes("(WOW)")) el.textContent = t.replace("(WOW)", "").trim();
    });

    // Replace internal-sounding lead lines (best-effort; only if exact-ish match)
    root.querySelectorAll("p, li").forEach((el) => {
      const t = (el.textContent || "").trim();
      if (!t) return;

      if (t === "Start with the actual report structure and the top-level result snapshot.") {
        el.textContent = "A decision-maker friendly snapshot of the report structure and outcome.";
      }
      if (t === "Start with what decision-makers care about: the structure and the result snapshot.") {
        el.textContent = "This first screen shows the report structure and the top-level outcome snapshot.";
      }
    });
  }

  function wireTourInternalButtons(root) {
    const btns = Array.from(root.querySelectorAll("a, button"));

    btns.forEach((b) => {
      const label = (b.textContent || "").trim().toLowerCase();

      // Order button inside the tour (right panel)
      if (
        label === "order a deep assessment report" ||
        label === "order deep assessment" ||
        label === "order a deep assessment"
      ) {
        b.addEventListener("click", (e) => {
          e.preventDefault();
          window.open(STRIPE.singleReport, "_blank", "noopener,noreferrer");
        });
        if (b.tagName === "A") b.setAttribute("href", STRIPE.singleReport);
      }

      // Methodology button inside the tour (right panel)
      if (label === "methodology") {
        b.addEventListener("click", (e) => {
          e.preventDefault();

          // close the tour if possible (click Close)
          const closeBtn = btns.find((x) => (x.textContent || "").toLowerCase().includes("close"));
          if (closeBtn) closeBtn.click();

          // jump to methodology section
          setTimeout(() => {
            const target = document.querySelector("#methodology") || document.querySelector('[id*="methodology"]');
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
            else window.location.hash = "#methodology";
          }, 60);
        });

        if (b.tagName === "A") b.setAttribute("href", "#methodology");
      }
    });
  }

  function observeTourOpen() {
    const obs = new MutationObserver(() => {
      const root = inTourRoot();
      if (!root) return;
      polishTourCopy(root);
      wireTourInternalButtons(root);
    });

    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  ready(() => {
    patchTourEntryButtons();
    patchPricingLinks();
    observeTourOpen();
  });
})();
