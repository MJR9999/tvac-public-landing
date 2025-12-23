/* guided-tour/guidedTourData.js
   TVAC Guided Tour – data-only file.
   NOTE: This file is written to be robust across different renderers:
   - It exposes data on window.guidedTourData
   - It also exposes window.TVAC_GUIDED_TOUR for namespaced access
*/

(function () {
  const steps = [
    // --- INTRO / ORIENTATION ---
    {
      id: "intro",
      kicker: "GUIDED TOUR",
      title: "A guided walkthrough of a real 6,000-word TVAC report",
      subtitle:
        "A visual, step-by-step tour that shows structure, logic, rubrics, and why TVAC is case-specific (not a generic LLM prompt response).",
      image: null,
      imageAlt: "",
      bullets: [
        "You’ll see the actual report structure (what comes first, what comes later).",
        "You’ll see how TVAC separates 'value pathways' from 'risks & frictions' and 'what to do next'.",
        "You’ll see outputs that are designed for decisions, internal alignment, and implementation planning."
      ]
    },

    // --- EARLY REPORT: MARKET / ASSET CONTEXT (NEW SCREENSHOT #2) ---
    {
      id: "asset-class-context",
      kicker: "REPORT SECTION",
      title: "Asset class & market context",
      subtitle:
        "A high-level market/asset-class perspective based on your inputs — positioning the case in its typical tokenization landscape.",
      image: "guided-tour/assets/02-asset-class-market-context.png",
      imageAlt: "Asset class & market context – TVAC report screenshot",
      bullets: [
        "Frames the segment’s typical tokenization behavior (not a full issuer-specific financial model).",
        "Highlights current market phase, structural strengths, and recurring frictions.",
        "Sets expectations for what is realistically achievable and what usually breaks projects."
      ]
    },

    // --- (KEEP EXISTING STEPS YOU ALREADY HAD – examples below)
    // If your current tour already includes TOC / formula / factor model / risk heatmap etc.,
    // keep them here. The two built-in images you already had in the repo can still be used:
    // - tvac-report-toc-result (2).png
    // - tvac-report-risk-heatmap.png

    {
      id: "toc",
      kicker: "REPORT STRUCTURE",
      title: "Report table of contents",
      subtitle:
        "TVAC reports are long because they are structured for decisions: what it is, why it scores, what blocks it, and what to do next.",
      image: "tvac-report-toc-result (2).png",
      imageAlt: "TVAC report table of contents screenshot",
      bullets: [
        "Shows the report’s modules (logic, assumptions, risks, recommendations).",
        "Makes it easy to share internally and discuss with advisors/providers.",
        "A report is not a chat response — it’s a decision artifact."
      ]
    },

    {
      id: "model",
      kicker: "CORE LOGIC",
      title: "The five-factor model (Added Value)",
      subtitle:
        "Added Value = (New Opportunities + Cost Savings + Risk Reduction) – (Tokenization Costs + New Risks).",
      image: null,
      imageAlt: "",
      bullets: [
        "Separates upside drivers from downside costs/risks.",
        "Forces explicit trade-offs instead of hype.",
        "Makes 'why this verdict' auditable."
      ]
    },

    {
      id: "risk-heatmap",
      kicker: "RISK VIEW",
      title: "Risk register & heatmap",
      subtitle:
        "A structured risk view: what can go wrong, how severe it is, and what mitigations matter.",
      image: "tvac-report-risk-heatmap.png",
      imageAlt: "TVAC risk heatmap screenshot",
      bullets: [
        "Turns vague concerns into a concrete mitigation checklist.",
        "Helps plan governance, controls, and provider selection.",
        "Supports decision gates before spending serious money."
      ]
    },

    // --- MID/LATE REPORT: STAKEHOLDER VALUE (NEW SCREENSHOT #1) ---
    {
      id: "stakeholders-investors",
      kicker: "STAKEHOLDER VIEW",
      title: "Investors: expected value vs costs & risks",
      subtitle:
        "TVAC breaks out value and friction per stakeholder — helping you design a credible, investable operating model.",
      image: "guided-tour/assets/06-investors-plus-minus.png",
      imageAlt: "Investors section – expected value and costs/risks screenshot",
      bullets: [
        "Clarifies where investors get real upside (and under which enforceability conditions).",
        "Makes frictions explicit: transfer restrictions, cross-border compliance, information asymmetry.",
        "Ends with concrete 'what to agree / do next' items for diligence and term design."
      ]
    },

    // --- LATE REPORT: RECOMMENDATIONS (NEW SCREENSHOT #3) ---
    {
      id: "recommendations",
      kicker: "WHAT TO DO NEXT",
      title: "Recommendations & next steps",
      subtitle:
        "Non-binding, action-oriented pointers that turn the evaluation into a practical plan.",
      image: "guided-tour/assets/10-recommendations-next-steps.png",
      imageAlt: "Recommendations & next steps screenshot",
      bullets: [
        "Summarises the project’s most important next moves and design priorities.",
        "Calls out regulatory fit & friction and investor-profile implications.",
        "Gives additional recommendations that typically improve viability."
      ]
    },

    // --- END REPORT: IMPLEMENTATION ROADMAP (NEW SCREENSHOT #4) ---
    {
      id: "roadmap",
      kicker: "IMPLEMENTATION",
      title: "Indicative implementation roadmap",
      subtitle:
        "A phased, realistic roadmap that helps you plan scope, sequencing, governance, and provider workstreams.",
      image: "guided-tour/assets/11-implementation-roadmap.png",
      imageAlt: "Indicative implementation roadmap screenshot",
      bullets: [
        "Phase 1: concept + internal alignment (decision gates).",
        "Phase 2: legal/tax/regulatory design (perimeter, exemptions, licensing, prospectus).",
        "Phase 3: technical + operational architecture (platform, custody, venue, reporting)."
      ]
    },

    {
      id: "close",
      kicker: "END",
      title: "Why this is not 'just a prompt'",
      subtitle:
        "TVAC outputs are structured for conservative decision-making and execution — a repeatable evaluation framework, not a one-off conversation.",
      image: null,
      imageAlt: "",
      bullets: [
        "Structured sections → consistent internal discussions.",
        "Explicit assumptions, risks, and levers → less hand-waving.",
        "Roadmap + concrete actions → faster path from idea to pilot."
      ]
    }
  ];

  // Expose for different renderers
  window.guidedTourData = steps;
  window.TVAC_GUIDED_TOUR = { version: "2025-12-23", steps };

  // If someone loaded this as a module by mistake, at least don’t crash.
})();
