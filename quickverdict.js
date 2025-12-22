/* quickverdict.js
   TVAC Landing – Quick Verdict widget
   - mounts into <div id="qv-app"></div>
   - uses /api/quickverdict endpoints
*/

(function () {
  const API_BASE = (window.TVAC_API_BASE || "").replace(/\/$/, "");
  const LS_TOKEN_KEY = "tvac_qv_token";

  const MIN_WORDS = 150;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function el(tag, attrs = {}, children = []) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    for (const c of children) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    return n;
  }

  function wordCount(text) {
    return String(text || "").trim().split(/\s+/).filter(Boolean).length;
  }

  function formatVerdict(v) {
    const s = String(v || "").toLowerCase();
    if (s === "go") return "Go";
    if (s === "no-go" || s === "nogo") return "No-Go";
    if (s === "revise") return "Revise";
    return v || "Revise";
  }

  function verdictBadgeClass(v) {
    const s = String(v || "").toLowerCase();
    if (s === "go") return "pill ok";
    if (s === "no-go" || s === "nogo") return "pill bad";
    return "pill warn";
  }

  async function apiFetch(path, opts = {}) {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, {
      method: opts.method || "GET",
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

    let json = null;
    try {
      json = await res.json();
    } catch (_) {}

    if (!res.ok) {
      const msg =
        (json && (json.ui_message || json.error || json.message)) ||
        `Request failed (${res.status}).`;
      throw new Error(msg);
    }

    return json;
  }

  function mountStylesOnce() {
    if ($("#qv-styles")) return;
    const style = el("style", {
      id: "qv-styles",
      html: `
      /* Minimal additions – respects existing landing theme */
      #qv-app { width: 100%; }
      .qv-card {
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.03);
        border-radius: 16px;
        padding: 18px;
        max-width: 980px;
        margin: 0 auto;
      }
      .qv-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
      @media (min-width: 900px) { .qv-grid { grid-template-columns: 1.2fr 0.8fr; } }
      .qv-title { font-size: 20px; font-weight: 650; margin: 0 0 6px 0; }
      .qv-sub { opacity: 0.86; margin: 0; line-height: 1.45; }
      .qv-row { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
      .qv-textarea {
        width: 100%;
        min-height: 160px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.10);
        background: rgba(0,0,0,0.18);
        color: inherit;
        padding: 12px 12px;
        outline: none;
        line-height: 1.5;
        resize: vertical;
      }
      .qv-help { font-size: 13px; opacity: 0.78; margin-top: 6px; }
      .qv-actions { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
      .qv-btn {
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        border-radius: 12px;
        padding: 10px 12px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.04);
        cursor:pointer;
        text-decoration:none;
        color: inherit;
        font-weight: 600;
      }
      .qv-btn.primary { background: rgba(255,255,255,0.10); }
      .qv-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .qv-error { color: #ffb3b3; font-size: 14px; }
      .qv-ok { color: #b7ffd0; font-size: 14px; }
      .pill { display:inline-flex; padding: 6px 10px; border-radius: 999px; font-weight: 700; font-size: 12px; border:1px solid rgba(255,255,255,0.12); }
      .pill.ok { background: rgba(40, 200, 120, 0.16); }
      .pill.warn { background: rgba(255, 190, 60, 0.14); }
      .pill.bad { background: rgba(255, 80, 80, 0.14); }
      .qv-box {
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        padding: 12px;
        background: rgba(255,255,255,0.02);
      }
      .qv-h { font-weight: 700; margin: 0 0 8px 0; }
      .qv-ul { margin: 0; padding-left: 18px; opacity: 0.92; }
      .qv-ul li { margin: 6px 0; }
      .qv-token { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      .qv-split { display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between; }
      `,
    });
    document.head.appendChild(style);
  }

  function buildPayload(caseText) {
    // Minimal payload for backend – backend can map constraints/case_text
    return {
      case_text: caseText,
    };
  }

  function render(container) {
    mountStylesOnce();

    const state = {
      token: localStorage.getItem(LS_TOKEN_KEY) || "",
      caseText: "",
      loading: false,
      lastQuick: null,
      error: "",
      info: "",
    };

    const root = el("div", { class: "qv-card" });

    const left = el("div");
    const right = el("div");

    const header = el("div", {}, [
      el("h3", { class: "qv-title" }, ["Quick Verdict"]),
      el(
        "p",
        { class: "qv-sub" },
        [
          "Get a fast, structured screening of your case. This is not the full report — it’s a first decision signal that helps you decide whether to invest in a deep assessment.",
        ]
      ),
    ]);

    const ta = el("textarea", {
      class: "qv-textarea",
      placeholder:
        "Describe your tokenization case (you can anonymize). Include: asset type, jurisdiction(s), investor target, intended venue/structure, and key constraints. Minimum 150 words.",
    });

    const wcLine = el("div", { class: "qv-help" }, ["Words: 0 (min. 150)"]);

    const errLine = el("div", { class: "qv-error" }, [""]);
    const infoLine = el("div", { class: "qv-ok" }, [""]);

    const btnRun = el("button", { class: "qv-btn primary", type: "button" }, ["Run Quick Verdict"]);
    const btnRerun = el("button", { class: "qv-btn", type: "button" }, ["Update & re-run"]);
    const btnClear = el("button", { class: "qv-btn", type: "button" }, ["Clear token"]);

    btnRerun.style.display = "none";
    btnClear.style.display = "none";

    const tokenBox = el("div", { class: "qv-box" });
    const resultBox = el("div", { class: "qv-box" });

    const ctaBox = el("div", { class: "qv-box" });

    function setLoading(on) {
      state.loading = on;
      btnRun.disabled = on;
      btnRerun.disabled = on;
      btnClear.disabled = on;
      ta.disabled = on;
      wcLine.style.opacity = on ? "0.6" : "0.78";
    }

    function setError(msg) {
      state.error = msg || "";
      errLine.textContent = state.error;
    }
    function setInfo(msg) {
      state.info = msg || "";
      infoLine.textContent = state.info;
    }

    function updateWordCount() {
      const wc = wordCount(ta.value);
      wcLine.textContent = `Words: ${wc} (min. ${MIN_WORDS})`;
      if (wc >= MIN_WORDS) wcLine.style.opacity = "0.9";
      else wcLine.style.opacity = "0.78";
    }

    function renderToken() {
      if (!state.token) {
        tokenBox.innerHTML = "";
        btnClear.style.display = "none";
        return;
      }
      btnClear.style.display = "inline-flex";
      tokenBox.innerHTML = "";
      tokenBox.appendChild(el("div", { class: "qv-split" }, [
        el("div", {}, [
          el("div", { class: "qv-h" }, ["Your resume token"]),
          el("div", { class: "qv-token" }, [state.token]),
          el("div", { class: "qv-help" }, ["Keep this token if you want to resume later. We store your draft temporarily (anonymous, token-based)."]),
        ]),
        el("button", {
          class: "qv-btn",
          type: "button",
          onclick: async () => {
            try {
              setError("");
              setInfo("");
              setLoading(true);
              const data = await apiFetch(`/api/quickverdict/${encodeURIComponent(state.token)}`);
              const payload = data.currentPayload || {};
              const text = payload.case_text || payload.caseDescription || payload.freeText || payload.constraints || "";
              ta.value = text;
              updateWordCount();
              state.lastQuick = data.quick_verdict || null;
              renderResult();
              btnRerun.style.display = "inline-flex";
              setInfo("Draft loaded. You can edit and re-run.");
            } catch (e) {
              setError(e.message || "Could not load token.");
            } finally {
              setLoading(false);
            }
          },
        }, ["Resume"]),
      ]));
    }

    function renderResult() {
      resultBox.innerHTML = "";
      if (!state.lastQuick) {
        resultBox.appendChild(el("div", { class: "qv-help" }, ["Run Quick Verdict to see the screening result."]));
        return;
      }

      const q = state.lastQuick;
      const verdict = formatVerdict(q.verdict);
      const badge = el("span", { class: verdictBadgeClass(q.verdict) }, [verdict]);

      const reasons = Array.isArray(q.verdict_reason) ? q.verdict_reason : [];
      const blockers = Array.isArray(q.top_blockers) ? q.top_blockers : [];
      const levers = Array.isArray(q.top_levers) ? q.top_levers : [];

      resultBox.appendChild(el("div", { class: "qv-row" }, [
        el("div", { class: "qv-h" }, ["Result:"]),
        badge,
        el("span", { class: "qv-help" }, [
          q.confidence ? `Confidence: ${String(q.confidence).toUpperCase()}` : "",
        ]),
      ]));

      if (reasons.length) {
        resultBox.appendChild(el("div", { class: "qv-h", style: "margin-top:10px;" }, ["Top reasons (short)"]));
        const ul = el("ul", { class: "qv-ul" });
        reasons.slice(0, 3).forEach((r) => ul.appendChild(el("li", {}, [String(r)])));
        resultBox.appendChild(ul);
      }

      if (blockers.length) {
        resultBox.appendChild(el("div", { class: "qv-h", style: "margin-top:10px;" }, ["Main blockers"]));
        const ul = el("ul", { class: "qv-ul" });
        blockers.slice(0, 3).forEach((r) => ul.appendChild(el("li", {}, [String(r)])));
        resultBox.appendChild(ul);
      }

      if (levers.length) {
        resultBox.appendChild(el("div", { class: "qv-h", style: "margin-top:10px;" }, ["Best levers"]));
        const ul = el("ul", { class: "qv-ul" });
        levers.slice(0, 3).forEach((r) => ul.appendChild(el("li", {}, [String(r)])));
        resultBox.appendChild(ul);
      }
    }

    function renderCTA() {
      ctaBox.innerHTML = "";
      ctaBox.appendChild(el("div", { class: "qv-h" }, ["Want the full answer?"]));
      ctaBox.appendChild(
        el("p", { class: "qv-sub", style: "margin:0 0 10px 0;" }, [
          "Quick Verdict is a screening. The full report includes a deep assessment (regulatory, market, technical, operational), a risk register, and a concrete action plan.",
        ])
      );

      // Use existing pricing anchors if your index.html has them; otherwise keep generic.
      // You can replace hrefs later with your Stripe links for single report / subscription.
      const btns = el("div", { class: "qv-actions" }, [
        el("a", { class: "qv-btn primary", href: "#pricing" }, ["Get the full report (paid)"]),
        el("a", { class: "qv-btn", href: "#pricing" }, ["See plans & pricing"]),
      ]);
      ctaBox.appendChild(btns);

      ctaBox.appendChild(
        el("div", { class: "qv-help", style: "margin-top:8px;" }, [
          "Tip: you can refine your case text above before buying. Better input → better output.",
        ])
      );
    }

    async function runQuickVerdict() {
      setError("");
      setInfo("");

      const text = ta.value || "";
      const wc = wordCount(text);
      if (wc < MIN_WORDS) {
        setError(`Please write at least ${MIN_WORDS} words. Right now you have ${wc}.`);
        return;
      }

      try {
        setLoading(true);

        const data = await apiFetch("/api/quickverdict", {
          method: "POST",
          body: buildPayload(text),
        });

        if (!data || !data.ok) throw new Error("Unexpected response.");

        state.token = data.token || "";
        if (state.token) localStorage.setItem(LS_TOKEN_KEY, state.token);

        state.lastQuick = data.quick_verdict || null;
        renderToken();
        renderResult();
        renderCTA();

        btnRerun.style.display = "inline-flex";
        setInfo("Quick Verdict ready. Token saved in this browser.");
      } catch (e) {
        setError(e.message || "Quick Verdict failed.");
      } finally {
        setLoading(false);
      }
    }

    async function updateAndRerun() {
      setError("");
      setInfo("");

      const text = ta.value || "";
      const wc = wordCount(text);
      if (wc < MIN_WORDS) {
        setError(`Please write at least ${MIN_WORDS} words. Right now you have ${wc}.`);
        return;
      }

      if (!state.token) {
        await runQuickVerdict();
        return;
      }

      try {
        setLoading(true);

        const data = await apiFetch(`/api/quickverdict/${encodeURIComponent(state.token)}`, {
          method: "PUT",
          body: { case_text: text, rerun: true },
        });

        if (!data || !data.ok) throw new Error("Unexpected response.");
        state.lastQuick = data.quick_verdict || null;
        renderResult();
        renderCTA();
        setInfo("Updated and re-run completed.");
      } catch (e) {
        setError(e.message || "Update failed.");
      } finally {
        setLoading(false);
      }
    }

    function clearToken() {
      state.token = "";
      state.lastQuick = null;
      localStorage.removeItem(LS_TOKEN_KEY);
      renderToken();
      renderResult();
      renderCTA();
      btnRerun.style.display = "none";
      setInfo("Token cleared.");
    }

    ta.addEventListener("input", () => {
      updateWordCount();
    });

    btnRun.addEventListener("click", runQuickVerdict);
    btnRerun.addEventListener("click", updateAndRerun);
    btnClear.addEventListener("click", clearToken);

    left.appendChild(header);
    left.appendChild(ta);
    left.appendChild(wcLine);
    left.appendChild(errLine);
    left.appendChild(infoLine);
    left.appendChild(el("div", { class: "qv-actions" }, [btnRun, btnRerun, btnClear]));

    right.appendChild(tokenBox);
    right.appendChild(resultBox);
    right.appendChild(ctaBox);

    root.appendChild(el("div", { class: "qv-grid" }, [left, right]));
    container.appendChild(root);

    updateWordCount();
    renderToken();
    renderResult();
    renderCTA();

    // If token exists, we can auto-offer resume
    if (state.token) {
      btnRerun.style.display = "inline-flex";
    }
  }

  function init() {
    const container = document.getElementById("qv-app");
    if (!container) return;

    if (!API_BASE) {
      container.appendChild(
        el("div", { class: "qv-card" }, [
          el("div", { class: "qv-error" }, [
            "Quick Verdict is not configured. Missing window.TVAC_API_BASE.",
          ]),
        ])
      );
      return;
    }

    render(container);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
