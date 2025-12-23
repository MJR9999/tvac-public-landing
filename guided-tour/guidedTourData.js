/* guided-tour/guidedTourData.js
   Global: window.TVAC_GUIDED_TOURS
*/

(function () {
  window.TVAC_GUIDED_TOURS = {
    defaultTourId: "tour_report_walkthrough",
    tours: [
      {
        id: "tour_report_walkthrough",
        title: "Walkthrough: a real TVAC report (structure → logic → value)",
        subtitle: "A visual tour through what makes a TVAC output decision-grade (not a generic LLM response).",
        steps: [
          {
            id: "s1",
            kicker: "START",
            title: "What you are looking at",
            body:
              "This is a real TVAC deep assessment output (typically ~6,000 words / 15–20 pages). " +
              "The goal is to make tokenization decisions defensible: clear verdict logic, explicit assumptions, and concrete levers.",
            image: "/assets/tvac-report-toc-result.png",
            imageAlt: "TVAC report: table of contents + result snapshot"
          },
          {
            id: "s2",
            kicker: "STRUCTURE",
            title: "Why structure matters",
            body:
              "A decision-grade report must be navigable and shareable. " +
              "TVAC outputs a repeatable structure so teams can compare cases and explain decisions internally.",
            image: "/assets/tvac-report-toc-result.png",
            imageAlt: "TVAC report structure (TOC)"
          },
          {
            id: "s3",
            kicker: "RUBRIC",
            title: "The five-factor model is fixed",
            body:
              "TVAC does not improvise a new scoring model per case. " +
              "It applies the same five factors every time: New Opportunities, Cost Savings, Risk Reduction, Tokenization Costs, New Risks — " +
              "and makes assumptions explicit when inputs are missing.",
            image: "/assets/tvac-report-factor-breakdown.png",
            imageAlt: "Factor breakdown excerpt"
          },
          {
            id: "s4",
            kicker: "CASE-SPECIFIC",
            title: "How it becomes case-specific (not generic)",
            body:
              "The factor rationale ties back to your exact inputs: jurisdictions, investor scope, liquidity approach, custody/venue constraints, " +
              "and operational setup. That is why the output is not a generic 'prompt answer'.",
            image: "/assets/tvac-report-factor-breakdown.png",
            imageAlt: "Case-specific factor breakdown excerpt"
          },
          {
            id: "s5",
            kicker: "RISK",
            title: "Risk focus is explicit and actionable",
            body:
              "Instead of vague warnings, the report highlights the most material risks and where mitigation creates the highest impact.",
            image: "/assets/tvac-report-risk-heatmap.png",
            imageAlt: "Risk heatmap excerpt"
          },
          {
            id: "s6",
            kicker: "VALUE",
            title: "The output helps planning — not just deciding",
            body:
              "A good tokenization evaluation should also help plan execution: what to clarify next, what blockers to remove, " +
              "and which design changes move the score in a defensible way.",
            image: "/assets/tvac-report-toc-result.png",
            imageAlt: "Report snapshot"
          }
        ],
        cta: {
          primaryLabel: "Request a Deep Assessment →",
          primaryHref: "mailto:michael@tvacai.com?subject=TVAC%20Deep%20Assessment%20request",
          secondaryLabel: "Ask a question",
          secondaryHref: "mailto:michael@tvacai.com?subject=Question%20about%20TVAC%20Guided%20Tour"
        }
      }
    ]
  };
})();
