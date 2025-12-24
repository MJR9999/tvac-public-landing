/* guided-tour/guidedTourData.js
   Case A (Live) — Product Tour steps
   Uses absolute /assets/... paths to avoid relative-path issues on Render.
*/

(function () {
  const IMG = (p) => `/assets/${p}`;

  // Max 9 steps. "WOW" first.
  const CASE_A = {
    id: "case-a",
    label: "Case A — Private company STO (example) (Live)",
    steps: [
      {
        id: "wow",
        title: "Report structure + top-level result (WOW)",
        subtitle: "Start with what decision-makers care about: structure + the outcome at a glance.",
        image: IMG("tvac-report-toc-result.png"),
        bullets: [
          "A real, decision-grade report — not a generic LLM answer.",
          "Clear structure, shareable snapshot, and rationale you can defend internally.",
        ],
      },
      {
        id: "asset-class-context",
        title: "Asset class & market context",
        subtitle: "Grounds the case in market structure, constraints, and typical pathways.",
        image: IMG("guided-tour_assets_02-asset-class-market-context.png"),
        bullets: [
          "Context matters: tokenization value is case-specific.",
          "Shows how assumptions are anchored in the case type.",
        ],
      },
      {
        id: "factor-breakdown",
        title: "Five-factor model",
        subtitle: "The core logic behind the verdict — transparently explained.",
        image: IMG("tvac-report-factor-breakdown.png"),
        bullets: [
          "Added Value = (NO + CS + RR) – (TC + NR).",
          "Score is decomposed — so teams can improve it deliberately.",
        ],
      },
      {
        id: "investors-plus-minus",
        title: "Investors: value vs costs & risks",
        subtitle: "Who benefits, who pays, and where friction appears.",
        image: IMG("guided-tour_assets_06-investors-plus-minus.png"),
        bullets: [
          "Separates stakeholder upside from execution burdens.",
          "Makes trade-offs explicit — not hidden in prose.",
        ],
      },
      {
        id: "risk-heatmap",
        title: "Risk register & heatmap",
        subtitle: "Concrete risk mapping — severity × likelihood with mitigations.",
        image: IMG("tvac-report-risk-heatmap.png"),
        bullets: [
          "Not generic: risks are linked to this case design.",
          "Supports governance and internal alignment.",
        ],
      },
      {
        id: "recommendations",
        title: "Recommendations & next steps",
        subtitle: "What to do next — and what to fix before proceeding.",
        image: IMG("guided-tour_assets_10-recommendations-next-steps.png"),
        bullets: [
          "Turns analysis into an execution plan.",
          "Actionable steps prioritized for impact on the score.",
        ],
      },
      {
        id: "implementation-roadmap",
        title: "Implementation roadmap",
        subtitle: "A staged view of how the project can be executed safely.",
        image: IMG("guided-tour_assets_11-implementation-roadmap.png"),
        bullets: [
          "Shows sequencing, dependencies, and realistic delivery flow.",
          "Highlights where compliance and ops need early attention.",
        ],
      },
      {
        id: "cta",
        title: "Order a Deep Assessment Report",
        subtitle: "Use TVAC to evaluate your own case and receive a full decision-grade report.",
        image: null,
        bullets: [
          "Single report purchase or Pro plans (6/12 months).",
          "If you want, we can add Case B later (“Coming soon” for now).",
        ],
        cta: { text: "Order Deep Assessment Report", href: "STRIPE_SINGLE_REPORT" },
      },
    ],
  };

  // Export in the simplest way for your GuidedCaseTour.js to consume.
  // If your tour engine expects a specific global name, keep it stable:
  window.TVACTourData = {
    cases: [CASE_A],
    defaultCaseId: "case-a",
  };
})();
