/* guidedTourData.js — Product Tour data (2 cases, Case B optional)
   Image paths are relative to site root (same as other assets usage).
*/

export const TVAC_TOUR_CASES = [
  {
    id: "case-a",
    name: "Case A (Real estate SPV – EU)",
    status: "ready",
    blurb:
      "A concrete, real-world style TVAC report walkthrough: structure, model logic, stakeholder views, and decision outputs.",
    steps: [
      {
        key: "wow",
        label: "Start here",
        kind: "intro",
        eyebrow: "PRODUCT TOUR",
        title: "A guided walkthrough of a real 6,000-word TVAC report",
        subtitle:
          "A visual, step-by-step tour that shows structure, logic, rubrics, and why TVAC is case-specific (not a generic LLM prompt response).",
        bullets: [
          "You’ll see the actual report structure (what comes first, what comes later).",
          "You’ll see how TVAC separates 'value pathways' from 'risks & frictions' and 'what to do next'.",
          "You’ll see outputs designed for decisions, internal alignment, and implementation planning."
        ],
        image: null
      },

      {
        key: "toc",
        label: "Report structure",
        kind: "report_structure",
        eyebrow: "REPORT STRUCTURE",
        title: "Report table of contents",
        subtitle:
          "TVAC reports are long because they are structured for decisions: what it is, why it scores, what blocks it, and what to do next.",
        bullets: [
          "Clickable section map for fast navigation and internal sharing.",
          "Clear separation of analysis, frictions, recommendations, and roadmap.",
          "Designed for decision-making under uncertainty."
        ],
        image: "assets/tvac-report-toc-result.png"
      },

      {
        key: "asset_context",
        label: "Market context",
        kind: "report_section",
        eyebrow: "REPORT SECTION",
        title: "Asset class & market context",
        subtitle:
          "A high-level market/asset-class perspective based on inputs — positioning the case in its typical tokenization landscape.",
        bullets: [
          "Frames the segment’s typical tokenization behavior (not a full issuer-specific model).",
          "Highlights current market phase, strengths, and recurring frictions.",
          "Sets expectations for what is realistically achievable and what usually breaks projects."
        ],
        image: "assets/guided-tour_assets_02-asset-class-market-context.png"
      },

      {
        key: "five_factor",
        label: "Core logic",
        kind: "core_logic",
        eyebrow: "CORE LOGIC",
        title: "The five-factor model (Added Value)",
        subtitle:
          "Added Value = (New Opportunities + Cost Savings + Risk Reduction) − (Tokenization Costs + New Risks).",
        bullets: [
          "Separates upside drivers from downside costs/risks.",
          "Forces explicit trade-offs instead of hype.",
          "Makes 'why this verdict' auditable."
        ],
        image: "assets/tvac-report-factor-breakdown.png"
      },

      {
        key: "risk_heatmap",
        label: "Risk view",
        kind: "risk_view",
        eyebrow: "RISK VIEW",
        title: "Risk register & heatmap",
        subtitle:
          "A structured risk view: what can go wrong, how severe it is, and what mitigations matter.",
        bullets: [
          "Case-specific risks mapped by likelihood × impact.",
          "Helps prioritize mitigations before legal/tech spend.",
          "Makes 'new risks' concrete and actionable."
        ],
        image: "assets/tvac-report-risk-heatmap.png"
      },

      {
        key: "investors",
        label: "Stakeholders",
        kind: "stakeholder_view",
        eyebrow: "STAKEHOLDER VIEW",
        title: "Investors: expected value vs costs & risks",
        subtitle:
          "TVAC breaks out value and friction per stakeholder — helping you design a credible, investable operating model.",
        bullets: [
          "Clarifies where investors get real upside (and enforceability conditions).",
          "Makes frictions explicit: transfer restrictions, cross-border compliance, information asymmetry.",
          "Ends with concrete 'what to agree / do next' items for diligence and term design."
        ],
        image: "assets/guided-tour_assets_06-investors-plus-minus.png"
      },

      {
        key: "next_steps",
        label: "What to do next",
        kind: "next_steps",
        eyebrow: "WHAT TO DO NEXT",
        title: "Recommendations & next steps",
        subtitle:
          "Non-binding, action-oriented pointers that turn the evaluation into a practical plan.",
        bullets: [
          "Summarises the project’s most important next moves and design priorities.",
          "Calls out regulatory fit & friction and investor-profile implications.",
          "Adds practical levers that typically improve viability."
        ],
        image: "assets/guided-tour_assets_10-recommendations-next-steps.png"
      },

      {
        key: "roadmap",
        label: "Implementation",
        kind: "implementation",
        eyebrow: "IMPLEMENTATION",
        title: "Indicative implementation roadmap",
        subtitle:
          "A phased, realistic roadmap that helps you plan scope, sequencing, governance, and provider workstreams.",
        bullets: [
          "Phase 1: concept + internal alignment (decision gates).",
          "Phase 2: legal/tax/regulatory design (perimeter, exemptions, licensing, prospectus).",
          "Phase 3: technical + operational architecture (platform, custody, venue, reporting)."
        ],
        image: "assets/guided-tour_assets_11-implementation-roadmap.png"
      },

      {
        key: "cta",
        label: "Order report",
        kind: "cta",
        eyebrow: "NEXT STEP",
        title: "Ready for a Deep Assessment Report?",
        subtitle:
          "If you want the full, case-specific assessment (15+ pages / 6,000+ words), order a Deep Assessment and we’ll deliver a complete report package.",
        bullets: [
          "Case-specific report with evidence, assumptions, and concrete decision levers.",
          "Designed for internal decision-making and stakeholder alignment.",
          "Delivered as a structured PDF-style report output."
        ],
        image: null
      }
    ]
  },

  {
    id: "case-b",
    name: "Case B (Coming soon)",
    status: "coming_soon",
    blurb:
      "Upload Case B screenshots and we’ll enable a second tour with the same polished UX.",
    steps: []
  }
];
