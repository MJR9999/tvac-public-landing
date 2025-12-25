/* guided-tour/guidedTourData.js
   Product Tour data (Case A live, Case B coming soon)
*/

(function () {
  window.TVAC_GUIDED_TOUR_DATA = {
    cases: [
      {
        id: "case-a",
        label: "Case A — Private company STO (example) (Live)",
        status: "live",
        steps: [
          {
            id: "wow",
            title: "Top-level result (WOW)",
            subtitle: "Start with the actual report structure and the top-level result snapshot.",
            image: "assets/tvac-report-toc-result.png",
            bullets: [
              "Start with what decision-makers care about: the structure and the result snapshot.",
              "This is a real decision-grade report — not a generic LLM answer.",
              "Clear structure, shareable snapshot, and rationale you can defend internally.",
            ],
          },
          {
            id: "asset-context",
            title: "Asset class & market context",
            subtitle: "Grounds the case in market structure, constraints, and typical pathways.",
            image: "assets/guided-tour_assets_02-asset-class-market-context.png",
            bullets: [
              "Grounds the case in market structure, constraints, and typical pathways.",
              "Context matters: tokenization value is case-specific.",
              "Shows how assumptions are anchored in the case type.",
            ],
          },
          {
            id: "risk-heatmap",
            title: "Risk register & heatmap",
            subtitle: "A practical risk view: what can kill the deal, and what must be mitigated.",
            image: "assets/tvac-report-risk-heatmap.png",
            bullets: [
              "Shows risk drivers and how they map to execution reality.",
              "Highlights deal-breakers and mitigation priorities.",
              "Supports governance: what must be true to proceed safely.",
            ],
          },
          {
            id: "factor-breakdown",
            title: "Five-factor model",
            subtitle: "The core logic behind the verdict — transparently explained.",
            image: "assets/tvac-report-factor-breakdown.png",
            bullets: [
              "The core logic behind the verdict — transparently explained.",
              "Added Value = (NO + CS + RR) − (TC + NR).",
              "Score is decomposed — so teams can improve it deliberately.",
            ],
          },
          {
            id: "investors",
            title: "Investors: value vs costs & risks",
            subtitle: "Shows how the upside is weighed against frictions for this deal design.",
            image: "assets/guided-tour_assets_06-investors-plus-minus.png",
            bullets: [
              "Clarifies who benefits and who pays (investors, issuer, ecosystem).",
              "Links investor access/liquidity logic to constraints and compliance.",
              "Makes tradeoffs explicit so stakeholders align faster.",
            ],
          },
          {
            id: "recommendations",
            title: "Recommendations & next steps",
            subtitle: "Actionable steps: what to do next, what to validate, and why.",
            image: "assets/guided-tour_assets_10-recommendations-next-steps.png",
            bullets: [
              "Turns assessment into execution: what to validate first.",
              "Concrete recommendations tied to score levers.",
              "Clear next steps for legal, custody, venue, and operating model.",
            ],
          },
          {
            id: "roadmap",
            title: "Implementation roadmap",
            subtitle: "A pragmatic roadmap: dependencies, sequencing, and milestones.",
            image: "assets/guided-tour_assets_11-implementation-roadmap.png",
            bullets: [
              "Sequenced plan: what comes first, and what can wait.",
              "Dependencies and critical path are explicit.",
              "Designed to be shared internally and used as a working plan.",
            ],
            cta: {
              label: "Order a Deep Assessment Report",
              href: "#pricing",
            },
          },
        ],
      },

      {
        id: "case-b",
        label: "Case B — Coming soon",
        status: "coming_soon",
        steps: [],
      },
    ],
  };
})();
