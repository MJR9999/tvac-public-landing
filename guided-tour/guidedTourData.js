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
            id: "overview",
            title: "Report overview & verdict snapshot",
            subtitle: "A structured report with an executive snapshot and a clear, defensible verdict.",
            image: "assets/guided-tour_assets_01-report-overview.png",
            bullets: [
              "Decision-grade output: clear structure, clear conclusion.",
              "Shareable snapshot for internal alignment and faster decision-making.",
              "Built to be defended: rationale, assumptions, and logic are explicit.",
            ],
          },
          {
            id: "asset-context",
            title: "Asset class & market context",
            subtitle: "Anchors the assessment in market structure, constraints, and typical pathways.",
            image: "assets/guided-tour_assets_02-asset-class-market-context.png",
            bullets: [
              "Grounds the case in market structure, constraints, and typical pathways.",
              "Context matters: tokenization value is case-specific.",
              "Assumptions are anchored in the case type (not generic).",
            ],
          },
          {
            id: "risk-heatmap",
            title: "Risk register & heatmap",
            subtitle: "A practical risk view: deal-breakers, mitigations, and priority actions.",
            image: "assets/tvac-report-risk-heatmap.png",
            bullets: [
              "Highlights deal-breakers and mitigation priorities.",
              "Maps execution risks to what must be true for success.",
              "Supports governance: what to validate before proceeding.",
            ],
          },
          {
            id: "factor-breakdown",
            title: "Five-factor model",
            subtitle: "The logic behind the verdict — transparent, decomposed, and improvable.",
            image: "assets/tvac-report-factor-breakdown.png",
            bullets: [
              "Transparent scoring across five factors (0–10).",
              "Added Value = (NO + CS + RR) − (TC + NR).",
              "Decomposed output so teams can improve the score deliberately.",
            ],
          },
          {
            id: "investors",
            title: "Investors: value vs costs & risks",
            subtitle: "Shows how upside is weighed against frictions for this design.",
            image: "assets/guided-tour_assets_06-investors-plus-minus.png",
            bullets: [
              "Clarifies who benefits and who pays (issuer, investors, ecosystem).",
              "Makes tradeoffs explicit: access, liquidity, constraints, compliance.",
              "Supports stakeholder alignment: fewer surprises later.",
            ],
          },
          {
            id: "recommendations",
            title: "Recommendations & next steps",
            subtitle: "Actionable steps: what to validate, what to change, and why.",
            image: "assets/guided-tour_assets_10-recommendations-next-steps.png",
            bullets: [
              "Turns the assessment into execution: what to validate first.",
              "Concrete recommendations linked to score levers.",
              "Next steps across legal, custody, venue, and operating model.",
            ],
          },
          {
            id: "roadmap",
            title: "Implementation roadmap",
            subtitle: "A pragmatic roadmap: sequencing, dependencies, and milestones.",
            image: "assets/guided-tour_assets_11-implementation-roadmap.png",
            bullets: [
              "Sequenced plan: what comes first, and what can wait.",
              "Dependencies and critical path are explicit.",
              "Designed to be shared internally as a working plan.",
            ],
            cta: {
              label: "Order a Deep Assessment Report",
              href: "#pricing",
            },
          },
          {
            id: "order",
            title: "Order a Deep Assessment Report",
            subtitle: "Get a structured PDF report for your case.",
            image: "assets/guided-tour_assets_01-report-overview.png",
            bullets: [
              "Send a short case description (asset, jurisdictions, investor scope, and constraints).",
              "You receive a 30+ page report (~9,000 words) with verdict logic, assumptions, risk focus, and next steps.",
              "Optional human review is available for sanity-check notes and clarifying questions."
            ],
            cta: {
              label: "Order a Deep Assessment Report →",
              href: "mailto:michael@tvacai.com?subject=Order%20TVAC%20Deep%20Assessment"
            }
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
