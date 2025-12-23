/* guided-tour/guidedTourData.js
   Data model for the Guided Tour (static, frontend-only).
   Exposes: window.GUIDED_TOUR_DATA
*/
(function () {
  "use strict";

  // Use existing screenshots already in repo root (safe, no new assets required).
  // You can later add more images under guided-tour/assets/... and update paths here.
  const IMG_TOC = "tvac-report-toc-result (2).png";
  const IMG_HEATMAP = "tvac-report-risk-heatmap.png";

  window.GUIDED_TOUR_DATA = {
    version: "2025-12-23-v1",
    tours: [
      {
        id: "tour-report-walkthrough-v1",
        title: "A guided walkthrough of a real 6,000-word TVAC report",
        subtitle:
          "A visual, step-by-step tour showing structure, five-factor logic, assumptions, and why the output is case-specific (not a generic LLM response).",
        meta: {
          durationLabel: "3–5 min",
          audienceLabel: "Issuers, advisors, platforms",
        },
        steps: [
          {
            id: "s1",
            kicker: "What you’re about to see",
            title: "Decision-grade output — not “AI vibes”",
            body:
              "TVAC is built around a fixed five-factor rubric and explicit assumptions. This tour shows how a real report is structured and why it becomes case-specific: inputs → factor logic → blockers/levers → action plan.",
            bullets: [
              "Fixed five-factor model (NO, CS, RR, TC, NR)",
              "Conservative scoring under uncertainty",
              "Explicit assumptions + missing inputs",
              "Actionable levers (how to improve the design)",
            ],
            callouts: [
              {
                title: "Why this matters",
                text:
                  "Professional stakeholders need traceable logic. TVAC’s value is the structure + reasoning chain — not just prose.",
              },
            ],
          },

          {
            id: "s2",
            kicker: "Report map",
            title: "The report is navigable (A–Z), like a case file",
            body:
              "A TVAC report is organized to support internal sharing: snapshot, rationale, assumptions, risks, and concrete next steps.",
            image: {
              src: IMG_TOC,
              alt: "TVAC report table of contents / structure screenshot",
              caption: "Example: report structure (TOC) showing the full A–Z flow.",
            },
            callouts: [
              {
                title: "Not a chat transcript",
                text:
                  "This structure is consistent across cases, so teams can compare outputs and align stakeholders.",
              },
            ],
          },

          {
            id: "s3",
            kicker: "Risk focus",
            title: "Risk heatmap: where to mitigate first",
            body:
              "The heatmap highlights where execution risk is highest (impact × likelihood). It turns ‘risk talk’ into prioritized mitigation focus.",
            image: {
              src: IMG_HEATMAP,
              alt: "TVAC risk heatmap screenshot",
              caption: "Example: risk heatmap used to prioritize mitigation work.",
            },
            callouts: [
              {
                title: "Execution-oriented",
                text:
                  "Instead of generic warnings, the report shows what to de-risk first to move the case from borderline → viable.",
              },
            ],
          },

          {
            id: "s4",
            kicker: "Core logic",
            title: "Five-factor rubric + explicit formula",
            body:
              "TVAC scores five dimensions and applies the formula: (NO + CS + RR) − (TC + NR). The report explains why each score is what it is — tied to the case inputs.",
            bullets: [
              "New Opportunities: distribution, liquidity pathways, investor access, programmability",
              "Cost Savings: automation, operational efficiency, simplification over time",
              "Risk Reduction: controls, transparency, settlement/counterparty improvements (when real)",
              "Tokenization Costs: build/integration, legal/compliance, vendor/platform dependencies",
              "New Risks: regulatory friction, governance complexity, tech/custody risks, attack surface",
            ],
            callouts: [
              {
                title: "Case-specific scoring",
                text:
                  "Scores are not arbitrary: each factor is justified and connected to the submitted design choices and constraints.",
              },
            ],
          },

          {
            id: "s5",
            kicker: "Why not just prompt an LLM?",
            title: "Structure beats ‘nice text’",
            body:
              "A generic LLM response can sound plausible, but it doesn’t enforce a consistent rubric, conservative scoring, or a repeatable decision framework. TVAC turns messy inputs into a comparable evaluation.",
            bullets: [
              "Repeatable framework across pipeline cases",
              "Comparable scoring across variants (what-if runs)",
              "Explicit assumptions and missing inputs",
              "Concrete blockers + mitigation path",
              "Action plan style recommendations (not just commentary)",
            ],
            callouts: [
              {
                title: "What users actually buy",
                text:
                  "They buy a structured decision artifact — something they can share internally and act on.",
              },
            ],
          },

          {
            id: "s6",
            kicker: "What’s next",
            title: "From verdict → implementation planning",
            body:
              "The deep report goes beyond screening: it supports planning and execution with design options, constraints discovery, and stakeholder alignment insight (who pays vs who benefits).",
            bullets: [
              "Top blockers + practical mitigation steps",
              "Design levers that move viability",
              "Regulatory & operational workstreams to validate",
              "Stakeholder alignment and next-step roadmap",
            ],
            ctas: [
              { label: "See plans & pricing →", href: "#pricing" },
              { label: "Download Methodology PDF ↓", href: "tvac-methodology-v1.1.pdf" },
            ],
            callouts: [
              {
                title: "Want two example cases later?",
                text:
                  "We can add a second tour with a very different asset class/design to show contrast (same rubric, different logic).",
              },
            ],
          },
        ],
      },
    ],
  };
})();
