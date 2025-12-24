/* guided-tour/patch-cta.js
   Robust patching for:
   - Guided Tour start buttons (card + header)
   - Stripe payment links in Pricing section
*/

(function () {
  const STRIPE = {
    singleReport: "https://buy.stripe.com/7sYdR91YJcM2cfG5OW2ZO02",
    pro6: "https://buy.stripe.com/28EaEX7j3fYe0wYdho2ZO01",
    pro12: "https://buy.stripe.com/7sYbJ10UF3bsfrS7X42ZO00",
  };

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else fn();
  }

  function openTourCaseA(e) {
    if (e) e.preventDefault();
    if (window.TVACProductTour && typeof window.TVACProductTour.open === "function") {
      window.TVACProductTour.open("case-a");
    } else {
      // failsafe: don't break UX
      alert("Product Tour failed to load. Please refresh, or email michael@tvacai.com.");
    }
  }

  function patchGuidedTourButtons() {
    // 1) Button inside the Guided Tour card
    // We match by common patterns (text + class + href)
    const candidates = Array.from(document.querySelectorAll("a, button")).filter((node) => {
      const t = (node.textContent || "").trim().toLowerCase();
      if (t.includes("start guided tour")) return true;
      if (t.includes("view guided tour")) return true;
      if (t.includes("guided tour (see real output)")) return true;
      return false;
    });

    candidates.forEach((node) => {
      node.addEventListener("click", openTourCaseA);
      // If it is an <a>, neutralize mailto/# behaviour
      if (node.tagName === "A") node.setAttribute("href", "#product-tour");
    });

    // 2) Header CTA "View Guided Tour →" (often an <a>)
    const headerLinks = Array.from(document.querySelectorAll("a")).filter((a) => {
      const t = (a.textContent || "").trim().toLowerCase();
      return t === "view guided tour →" || t === "guided tour" || t.includes("guided tour");
    });

    // We only attach to those that point to guided tour section or are nav items
    headerLinks.forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href.startsWith("mailto:")) return;
      // allow other anchors, but still open modal on click
      a.addEventListener("click", openTourCaseA);
    });
  }

  function patchPricingLinks() {
    // Strategy:
    // - Find anchors/buttons with key phrases and set href to Stripe URLs
    // - Also fix any "mailto:michael@tvacai.com" that sits on pricing CTAs

    const anchors = Array.from(document.querySelectorAll("a"));

    function setHrefIfMatch(matchFn, href) {
      anchors.forEach((a) => {
        const txt = (a.textContent || "").trim().toLowerCase();
        if (matchFn(txt)) {
          a.setAttribute("href", href);
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
      });
    }

    setHrefIfMatch((t) => t.includes("order deep assessment") || t.includes("order deep report"), STRIPE.singleReport);
    setHrefIfMatch((t) => t.includes("start 6-month pro") || t.includes("6-month pro") || t.includes("€325"), STRIPE.pro6);
    setHrefIfMatch((t) => t.includes("start 12-month pro") || t.includes("12-month pro") || t.includes("€275"), STRIPE.pro12);

    // Failsafe: if pricing CTAs are mailto, replace them
    anchors.forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const txt = (a.textContent || "").trim().toLowerCase();

      if (href.startsWith("mailto:")) {
        if (txt.includes("order")) {
          a.setAttribute("href", STRIPE.singleReport);
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
        if (txt.includes("12-month") || txt.includes("€275")) {
          a.setAttribute("href", STRIPE.pro12);
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
        if (txt.includes("6-month") || txt.includes("€325")) {
          a.setAttribute("href", STRIPE.pro6);
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
      }
    });
  }

  ready(() => {
    patchGuidedTourButtons();
    patchPricingLinks();
  });
})();
