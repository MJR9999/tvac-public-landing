/* guided-tour/guidedTourData.js
   Product Tour data (Case A live, Case B coming soon)
   Uses absolute /assets/... paths to avoid relative-path issues on Render.
*/
(function () {
  const IMG = (filename) => `/assets/${filename}`;

  const STRIPE = {
    singleReport: "https://buy.stripe.com/7sYdR91YJcM2cfG5OW2ZO02",
    pro6: "https://buy.stripe.com/28EaEX7j3fYe0wYdho2ZO01",
    pro12: "https://buy.stripe.com/7sYbJ10UF3bsfrS7X42ZO00",
  };

  const CASE_A = {
    id: "case-a",
    title: "Case A — Private company STO (example)",
    badge: "Live",
    description:
      "A step-by-step walkthrough of real TVAC output — showing structure, factor logic, assumptions, risks, and concrete next steps.",
    steps: [
      {
        id: "wow",
        label: "Report structure (WOW)",
        kicker: "PRODUCT TOUR",
        title: "Report structure + top-level result (WOW)",
        body: [
          "Start with what decision-makers care about: the structure and the result snapshot.",
          "This is a real decision-grade report — not a generic LLM answer.",
          "Clear structure, shareable snapshot, and rationale you can defend internally.",
        ],
        image: IMG("tvac-report-toc-result.png"),
      },
      {
        id: "asset-class-context",
        label: "Asset class & market context",
        kicker: "MARKET CONTEXT",
        title: "Asset class & market context",
        body: [
          "Grounds the case in market structure, constraints, and typical pathways.",
          "Context matters: tokenization value is case-specific.",
          "Shows how assumptions are anchored in the case type.",
        ],
        image: IMG("guided-tour_assets_02-asset-class-market-context.png"),
      },
      {
        id: "risk-heatmap",
        label: "Risk register & heatmap",
        kicker: "RISK",
        title: "Risk register & heatmap",
        body: [
          "Concrete risk mapping — severity × likelihood with mitigations.",
          "Not generic: risks are linked to this case design.",
          "Supports governance and internal alignment.",
        ],
        image: IMG("tvac-report-risk-heatmap.png"),
      },
      {
        id: "factor-breakdown",
        label: "Five-factor model",
        kicker: "MODEL",
        title: "Five-factor model",
        body: [
          "The core logic behind the verdict — transparently explained.",
          "Added Value = (NO + CS + RR) – (TC + NR).",
          "Score is decomposed — so teams can improve it deliberately.",
        ],
        image: IMG("tvac-report-factor-breakdown.png"),
      },
      {
        id: "investors-plus-minus",
        label: "Investors: value vs costs & risks",
        kicker: "STAKEHOLDERS",
        title: "Investors: value vs costs & risks",
        body: [
          "Who benefits, who pays, and where friction appears.",
          "Separates stakeholder upside from execution burdens.",
          "Makes trade-offs explicit — not hidden in prose.",
        ],
        image: IMG("guided-tour_assets_06-investors-plus-minus.png"),
      },
      {
        id: "recommendations",
        label: "Recommendations & next steps",
        kicker: "NEXT STEPS",
        title: "Recommendations & next steps",
        body: [
          "What to do next — and what to fix before proceeding.",
          "Turns analysis into an execution plan.",
          "Actionable steps prioritized for impact on the score.",
        ],
        image: IMG("guided-tour_assets_10-recommendations-next-steps.png"),
      },
      {
        id: "implementation-roadmap",
        label: "Implementation roadmap",
        kicker: "EXECUTION",
        title: "Implementation roadmap",
        body: [
          "A staged view of how the project can be executed safely.",
          "Shows sequencing, dependencies, and realistic delivery flow.",
          "Highlights where compliance and ops need early attention.",
        ],
        image: IMG("guided-tour_assets_11-implementation-roadmap.png"),
      },
      {
        id: "cta",
        label: "Order Deep Assessment",
        kicker: "ORDER",
        title: "Order a Deep Assessment Report",
        body: [
          "Use TVAC to evaluate your own case and receive a full decision-grade report.",
          "Single report purchase or Pro plans (6/12 months).",
          "Case B will be added later (coming soon).",
        ],
        image: null,
        cta: {
          href: STRIPE.singleReport,
          label: "Order Deep Assessment Report",
          note: "Opens Stripe checkout in a new tab.",
        },
      },
    ],
  };

  const CASE_B = {
    id: "case-b",
    title: "Case B — Coming soon",
    badge: "Coming soon",
    comingSoon: true,
    description: "A second example case will be added soon.",
    steps: [],
  };

  // Global export for GuidedCaseTour.js
  window.TVACTourData = {
    cases: [CASE_A, CASE_B],
    defaultCaseId: "case-a",
  };
})();
