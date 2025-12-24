/* guided-tour/patch-cta.js (v2)
   Robust patching for:
   - Product Tour start buttons (hero/card/header/nav)
   - Stripe payment links in Pricing section
   - Stripe CTA inside the Product Tour modal

   Works even if buttons/anchors change slightly.
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
    if (window.TVACProductTour && typeof window.TVACProductTour.open === "function") {
      window.TVACProductTour.open("case-a");
      return;
    }
    alert("Product Tour failed to load. Please refresh, or email michael@tvacai.com.");
  }

  function norm(s) {
    return (s || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function setAsExternalLink(a, href) {
    a.setAttribute("href", href);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  }

  function patchTourButtons() {
    // Match all likely tour-launch CTAs (header + hero + card)
    const nodes = Array.from(document.querySelectorAll("a,button"));

    nodes.forEach((node) => {
      const t = norm(node.textContent);
      const isTour =
        t.includes("start guided tour") ||
        t.includes("start product tour") ||
        t === "view guided tour →" ||
        t === "view product tour →" ||
        t === "guided tour (see real output) →" ||
        t.includes("guided tour") ||
        t.includes("product tour");

      if (!isTour) return;

      // Avoid hijacking genuine nav anchors like "#pricing" etc, but allow #product-tour
      if (node.tagName === "A") {
        const href = (node.getAttribute("href") || "").toLowerCase();
        if (href.startsWith("mailto:")) return; // keep email links intact
        // force it to look like an anchor but actually open the modal
        node.setAttribute("href", "#product-tour");
      }

      node.addEventListener("click", openTourCaseA);
    });
  }

  function patchPricingLinks() {
    const pricing = document.getElementById("pricing");
    if (!pricing) return;

    // Only touch pricing-area anchors so we don't mess with email links elsewhere
    const anchors = Array.from(pricing.querySelectorAll("a"));

    anchors.forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const t = norm(a.textContent);

      // If CTA is already a stripe link, keep it
      if (href.includes("buy.stripe.com")) return;

      // Replace mailto on pricing CTAs
      if (href.startsWith("mailto:") || href === "" || href === "#") {
        // Decide which product based on nearby text
        if (t.includes("12-month") || t.includes("12 month") || t.includes("€275") || t.includes("275")) {
          setAsExternalLink(a, STRIPE.pro12);
          return;
        }
        if (t.includes("6-month") || t.includes("6 month") || t.includes("€325") || t.includes("325")) {
          setAsExternalLink(a, STRIPE.pro6);
          return;
        }
        if (t.includes("order") || t.includes("deep assessment") || t.includes("deep report") || t.includes("single")) {
          setAsExternalLink(a, STRIPE.singleReport);
          return;
        }
      }
    });

    // Extra failsafe: if pricing cards have buttons (not anchors), wrap with click-to-open
    const buttons = Array.from(pricing.querySelectorAll("button"));
    buttons.forEach((btn) => {
      const t = norm(btn.textContent);
      if (t.includes("12-month") || t.includes("12 month") || t.includes("€275") || t.includes("275")) {
        btn.addEventListener("click", () => window.open(STRIPE.pro12, "_blank", "noopener"));
      }
      if (t.includes("6-month") || t.includes("6 month") || t.includes("€325") || t.includes("325")) {
        btn.addEventListener("click", () => window.open(STRIPE.pro6, "_blank", "noopener"));
      }
      if (t.includes("order") || t.includes("deep assessment") || t.includes("deep report") || t.includes("single")) {
        btn.addEventListener("click", () => window.open(STRIPE.singleReport, "_blank", "noopener"));
      }
    });
  }

  function patchTourModalStripeCTA() {
    // The modal is injected dynamically; use event delegation.
    document.addEventListener("click", function (e) {
      const el = e.target && e.target.closest ? e.target.closest("a,button") : null;
      if (!el) return;

      const t = norm(el.textContent);
      if (!t.includes("order deep assessment")) return;

      // if it's an <a> currently pointing to mailto, fix it
      if (el.tagName === "A") {
        e.preventDefault();
        setAsExternalLink(el, STRIPE.singleReport);
        window.open(STRIPE.singleReport, "_blank", "noopener");
        return;
      }

      // if it's a <button>, open Stripe
      e.preventDefault();
      window.open(STRIPE.singleReport, "_blank", "noopener");
    });
  }

  ready(() => {
    patchTourButtons();
    patchPricingLinks();
    patchTourModalStripeCTA();
  });
})();
