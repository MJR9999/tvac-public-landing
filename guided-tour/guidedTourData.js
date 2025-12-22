/* guided-tour/guidedTourData.js
   TVAC Guided Tour data (static, no API, no backend dependencies)
   Add screenshots under guided-tour/assets/ and keep paths in image fields.
*/

(function () {
  const tours = [
    {
      id: "case-a",
      title: "Inside a Real TVAC Assessment",
      subtitle: "Example Case A: Tokenized Private Equity (EU-focused)",
      badge: "Guided Tour",
      disclaimer:
        "Screenshots are illustrative and may be redacted/anonymized. This tour explains method and structure, not legal, financial, or investment advice.",
      chapters: [
        {
          id: "intro",
          title: "What you’re about to see",
          summary:
            "A decision-grade assessment: framing → method → reasoning → verdict → implementation plan.",
          steps: [
            {
              id: "intro-1",
              title: "What a TVAC report is (and is not)",
              body:
                "TVAC is not ‘text generation’. It is a structured decision engine: it forces assumptions, applies rubrics consistently, and makes trade-offs explicit.",
              image: "guided-tour/assets/case-a/01-cover.png",
              callouts: [
                {
                  title: "Key point",
                  body:
                    "A prompt can give an opinion. TVAC produces a decision structure you can act on — with explicit conditions and dependencies.",
                },
              ],
            },
          ],
        },

        {
          id: "framing",
          title: "Case framing",
          summary:
            "Why the same idea can flip verdicts when assumptions change.",
          steps: [
            {
              id: "framing-1",
              title: "Inputs define the decision space",
              body:
                "Asset type, investor scope, jurisdictions, liquidity goals, governance constraints — this is where tokenization projects often succeed or fail.",
              image: "guided-tour/assets/case-a/02-framing.png",
              callouts: [
                {
                  title: "Why this matters",
                  body:
                    "Two cases that ‘sound identical’ can have opposite outcomes once framed correctly. TVAC forces the framing first — before conclusions.",
                },
              ],
            },
          ],
        },

        {
          id: "method",
          title: "Method & formula",
          summary:
            "The TVAC net-value model: upside minus friction — always.",
          steps: [
            {
              id: "method-1",
              title: "Added Value formula",
              body:
                "Added Value = (New Opportunities + Cost Savings + Risk Reduction) – (Tokenization Costs + New Risks). TVAC insists on counting downside.",
              image: "guided-tour/assets/shared/03-formula.png",
              callouts: [
                {
                  title: "Why this differs from prompting",
                  body:
                    "Prompting tends to amplify narrative. TVAC enforces symmetry: it counts costs and new risks explicitly — not just upside.",
                },
              ],
            },
          ],
        },

        {
          id: "rubrics",
          title: "Rubrics & scoring",
          summary:
            "Numbers are meaningless without reasoning — and vice versa.",
          steps: [
            {
              id: "rubrics-1",
              title: "Rubrics make scoring non-arbitrary",
              body:
                "Scores reflect a rubric: what qualifies as 3/10 vs 7/10 — and why. The report ties each score to concrete case facts and constraints.",
              image: "guided-tour/assets/case-a/04-rubrics.png",
              callouts: [
                {
                  title: "Interpretation rule",
                  body:
                    "If you can’t explain a score in plain language, the score is not allowed to stand. TVAC forces explainability.",
                },
              ],
            },
          ],
        },

        {
          id: "analysis",
          title: "Case-specific analysis",
          summary:
            "Where value pathways exist — and where they don’t.",
          steps: [
            {
              id: "analysis-1",
              title: "Value pathways (case-specific)",
              body:
                "TVAC identifies concrete mechanisms for value creation (capital formation, investor access, operational leverage) and tests them against case constraints.",
              image: "guided-tour/assets/case-a/05-value-pathways.png",
              callouts: [
                {
                  title: "Non-generic by design",
                  body:
                    "Change one assumption — jurisdiction, investor type, custody model — and the recommended structure may change.",
                },
              ],
            },
            {
              id: "analysis-2",
              title: "Reality check: regulation & operational friction",
              body:
                "The report highlights legal, operational, and platform dependencies — the ‘where projects break’ section — and treats them as first-class drivers of the verdict.",
              image: "guided-tour/assets/case-a/06-reality-check.png",
              callouts: [
                {
                  title: "Value of a ‘no-go’",
                  body:
                    "A negative verdict can be the most valuable outcome because it prevents expensive implementation mistakes.",
                },
              ],
            },
          ],
        },

        {
          id: "verdict",
          title: "Verdict & plan",
          summary:
            "A verdict is only useful if it comes with conditions and next steps.",
          steps: [
            {
              id: "verdict-1",
              title: "Decision-grade verdict",
              body:
                "TVAC doesn’t ‘approve’. It defines conditions under which tokenization creates net value — and what must be true operationally and legally.",
              image: "guided-tour/assets/case-a/07-verdict.png",
              callouts: [
                {
                  title: "Implementation bridge",
                  body:
                    "The report translates analysis into execution: workstreams, dependencies, sequencing, and what to validate first.",
                },
              ],
            },
            {
              id: "verdict-2",
              title: "How users extract value",
              body:
                "Decision support, stakeholder alignment (legal/ops/finance), provider selection, implementation roadmap, and stronger investor communications.",
              image: "guided-tour/assets/case-a/08-action-plan.png",
              callouts: [
                {
                  title: "Practical outcome",
                  body:
                    "This is why a 6,000-word report is not ‘more text’ — it’s more decision structure and implementable clarity.",
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: "case-b",
      title: "Alternate Example Tour",
      subtitle: "Example Case B: Contrasting asset class (coming next)",
      badge: "Alternate Case",
      disclaimer:
        "Case B will demonstrate how the same TVAC method produces a very different friction profile, value logic, and verdict dynamics.",
      chapters: [
        {
          id: "placeholder",
          title: "Case B will be added next",
          summary:
            "Same method. Different case. Different drivers. Different verdict shape.",
          steps: [
            {
              id: "b-1",
              title: "Placeholder",
              body:
                "Once you select a second case and anonymize excerpts, we will add screenshots and callouts here.",
              image: "guided-tour/assets/shared/09-placeholder.png",
              callouts: [
                {
                  title: "Next",
                  body:
                    "We’ll pick a maximally contrasting case (e.g., real estate fractionalization vs tokenized private equity) to demonstrate non-generic analysis.",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  // Expose globally
  window.TVACTourData = { tours };
})();
