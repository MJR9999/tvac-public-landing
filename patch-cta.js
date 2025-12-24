/* patch-cta.js — Ensure CTAs point to Stripe (not mailto) + expose TVAC_OPEN_ORDER()
   Safe for static landing pages. No dependencies.
*/

(function () {
  const STRIPE = {
    single: "https://buy.stripe.com/7sYdR91YJcM2cfG5OW2ZO02",
    pro6: "https://buy.stripe.com/28EaEX7j3fYe0wYdho2ZO01",
    pro12: "https://buy.stripe.com/7sYbJ10UF3bsfrS7X42ZO00"
  };

  // Used by the tour CTA step
  window.TVAC_OPEN_ORDER = function () {
    window.open(STRIPE.single, "_blank", "noopener,noreferrer");
  };

  function normalize(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function patchAnchors() {
    const links = Array.from(document.querySelectorAll("a, button"));
    links.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const text = normalize(el.textContent);

      // If it's a button acting as a link (data-href pattern)
      const href =
        tag === "a" ? el.getAttribute("href") :
        el.getAttribute("data-href");

      // Only patch mailto-ish or missing links for pricing CTAs
      const looksBroken = !href || href.startsWith("mailto:");

      if (!looksBroken) return;

      // Match by visible label (adjust if you rename buttons)
      if (text.includes("single tvac report") || text.includes("deep assessment") || text.includes("order deep")) {
        setLink(el, STRIPE.single);
        return;
      }
      if (text.includes("tvac pro") && text.includes("6")) {
        setLink(el, STRIPE.pro6);
        return;
      }
      if (text.includes("tvac pro") && text.includes("12")) {
        setLink(el, STRIPE.pro12);
        return;
      }

      // Optional: match by custom attributes if you later add them
      const key = el.getAttribute("data-stripe");
      if (key && STRIPE[key]) {
        setLink(el, STRIPE[key]);
        return;
      }
    });
  }

  function setLink(el, url) {
    if (!url) return;
    const tag = el.tagName.toLowerCase();

    if (tag === "a") {
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    } else {
      // button
      el.addEventListener("click", function () {
        window.open(url, "_blank", "noopener,noreferrer");
      });
      el.setAttribute("data-href", url);
    }
  }

  document.addEventListener("DOMContentLoaded", patchAnchors);
})();
