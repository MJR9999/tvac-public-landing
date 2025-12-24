/* guided-tour/guidedTourData.js
   Guided Tour data (Case A live, Case B coming soon)
   Paths are relative to site root (index.html).
*/

(function () {
  const STRIPE = {
    singleReport: "https://buy.stripe.com/7sYdR91YJcM2cfG5OW2ZO02",
    pro6: "https://buy.stripe.com/28EaEX7j3fYe0wYdho2ZO01",
    pro12: "https://buy.stripe.com/7sYbJ10UF3bsfrS7X42ZO00",
  };

  // Case A: max 9 steps, WOW first
  const CASE_A = {
    id: "case-a",
    title: "Case A — Private company STO (example)",
    badge: "Live",
    description:
      "A visual, step-by-step Product Tour through a real TVAC report structure — showing why TVAC is case-specific and decision-grade.",
    steps: [
      {
        id: "wow",
        label: "WOW: Structure + result snapshot",
        kicker: "PRODUCT TOUR",
        title: "A real report — structured for decisions",
        body: [
          "Start with the actual report structure and the top-level result snapshot.",
          "This is not a generic LLM answer — it’s navigable, shareable, and built for stakeholder alignment.",
        ],
        image: "assets/tvac-report-toc-result.png",
        imageAlt: "TVAC report excerpt: table of contents and result snapshot",
      },
      {
        id: "asset-context",
        label: "Asset class & market context",
        kicker: "REPORT SECTION",
        title: "Asset class & market context",
        body: [
          "Positions the case in its typical tokenization landscape (market phase, recurring frictions, realistic expectations).",
          "Helps stakeholders understand what is “normal” vs what is case-specific.",
        ],
        image: "assets/guided-tour_assets_02-asset-class-market-context.png",
        imageAlt: "Asset class & market context — TVAC report screenshot",
      },
      {
        id: "risk-heatmap",
        label: "Risk register & heatmap",
        kicker: "RISK VIEW",
        title: "Risk register & heatmap",
        body: [
          "A structured risk view: what can go wrong, likelihood × impact, and where mitigations matter first.",
          "Designed for practical execution planning, not just commentary.",
        ],
        image: "assets/tvac-report-risk-heatmap.png",
        imageAlt: "TVAC report excerpt: risk heatmap",
      },
      {
        id: "core-logic",
        label: "Five-factor model",
        kicker: "CORE LOGIC",
        title: "The five-factor model (Added Value)",
        body: [
          "Separates upside drivers from downside costs/risks.",
          "Forces explicit trade-offs instead of hype — and makes the verdict auditable.",
        ],
        image: "assets/tvac-report-factor-breakdown.png",
        imageAlt: "TVAC report excerpt: factor breakdown",
      },
      {
        id: "investors",
        label: "Investors: value vs costs & risks",
        kicker: "STAKEHOLDER VIEW",
        title: "Investors: expected value vs costs & risks",
        body: [
          "Shows where investors get real upside (and under which enforceability conditions).",
          "Makes frictions explicit: transfer restrictions, cross-border compliance, information asymmetry.",
        ],
        image: "assets/guided-tour_assets_06-investors-plus-minus.png",
        imageAlt: "Investors section — expected value and costs/risks screenshot",
      },
      {
        id: "recommendations",
        label: "Recommendations & next steps",
        kicker: "WHAT TO DO NEXT",
        title: "Recommendations & next steps",
        body: [
          "Turns the evaluation into a practical plan.",
          "Calls out the most important design moves and the key blockers to address first.",
        ],
        image: "assets/guided-tour_assets_10-recommendations-next-steps.png",
        imageAlt: "Recommendations & next steps screenshot",
      },
      {
        id: "roadmap",
        label: "Implementation roadmap",
        kicker: "IMPLEMENTATION",
        title: "Indicative implementation roadmap",
        body: [
          "A phased roadmap: concept → legal/regulatory → technical/operational architecture.",
          "Helps teams scope and sequence workstreams realistically.",
        ],
        image: "assets/guided-tour_assets_11-implementation-roadmap.png",
        imageAlt: "Indicative implementation roadmap screenshot",
      },
      {
        id: "cta",
        label: "Order Deep Assessment",
        kicker: "NEXT STEP",
        title: "Want the full Deep Assessment for your case?",
        body: [
          "Order a full Deep Assessment Report (typically 15–20 pages / ~6,000 words).",
          "You’ll get a decision-grade verdict, assumptions, blockers, levers, and concrete next steps.",
        ],
        cta: {
          label: "Order Deep Assessment Report",
          href: STRIPE.singleReport,
          note: "Opens secure Stripe checkout.",
        },
      },
    ],
  };

  const CASE_B = {
    id: "case-b",
    title: "Case B — Coming soon",
    badge: "Coming soon",
    description:
      "A second Product Tour case will be added soon. (Shown here as a placeholder.)",
    comingSoon: true,
    steps: [],
  };

  window.TVACTourData = {
    version: "1.0",
    stripe: STRIPE,
    cases: [CASE_A, CASE_B],
    defaultCaseId: "case-a",
  };
})();
