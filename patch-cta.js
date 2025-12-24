/* guided-tour/patch-cta.js
   Robust patching for:
   - Product Tour start buttons (card + header)
   - Stripe payment links in Pricing section
   This is a safety net if HTML changes later.
*/
(function () {
  const STRIPE = {
    singleReport: "https://buy.stripe.com/7sYdR91YJcM2cfG5OW2ZO02",
    pro6: "https://buy.stripe.com/28EaEX7j3fYe0wYdho2ZO01",
    pro12: "https://buy.stripe.com/7sYbJ10UF3bsfrS7X42ZO00",
  };

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function openTourCaseA(e) {
    if (e) e.preventDefault();
    // Support both APIs (old/new)
    if (window.TVACProductTour && typeof window.TVACProductTour.open === "function") {
      try { window.TVACProductTour.open("case-a"); return; } catch (_) {}
    }
    if (typeof window.TVAC_START_GUIDED_TOUR === "function") {
      try { window.TVAC_START_GUIDED_TOUR("case-a"); return; } catch (_) {}
      try { window.TVAC_START_GUIDED_TOUR(); return; } catch (_) {}
    }
    alert("Product Tour failed to load. Please refresh, or email michael@tvacai.com.");
  }

  function patchTourButtons() {
    const nodes = Array.from(document.querySelectorAll("a,button"));
    nodes.forEach((node) => {
      const t = (node.textContent || "").trim().toLowerCase();
      if (t.includes("start product tour") || t.includes("start guided tour") || t.includes("view product tour") || t.includes("view guided tour")) {
        node.addEventListener("click", openTourCaseA);
        if (node.tagName === "A") node.setAttribute("href", "#product-tour");
      }
    });
  }

  function patchPricingLinks() {
    const anchors = Array.from(document.querySelectorAll("a"));
    anchors.forEach((a) => {
      const txt = (a.textContent || "").trim().toLowerCase();
      const href = (a.getAttribute("href") || "").toLowerCase();
      const isMail = href.startsWith("mailto:");
      const set = (url) => {
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      };

      if (txt.includes("order deep assessment") || txt.includes("single tvac report")) {
        if (isMail) set(STRIPE.singleReport);
      }
      if (txt.includes("6-month") || txt.includes("€325") || txt.includes("eur 325")) {
        if (isMail) set(STRIPE.pro6);
      }
      if (txt.includes("12-month") || txt.includes("€275") || txt.includes("eur 275")) {
        if (isMail) set(STRIPE.pro12);
      }
    });
  }

  ready(() => {
    patchTourButtons();
    patchPricingLinks();
  });
})();
