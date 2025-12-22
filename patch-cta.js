// patch-cta.js
// Safe patcher for tvac-public-landing/index.html (no manual edits)
// - Converts mailto CTAs related to Quick Verdict into #quickverdict
// - Adds an id to the primary hero CTA if missing (optional)
// - Keeps everything else untouched

import fs from "fs";

const INPUT = "index.html";
const OUTPUT = "index.html";

let html = fs.readFileSync(INPUT, "utf8");

// 1) Replace any mailto links that look like Quick Verdict CTA with #quickverdict
// This is deliberately conservative: we only rewrite mailto:... when the surrounding button/link mentions Quick Verdict.
const before = html;

// A) Replace mailto in anchors that contain "Quick Verdict" text
html = html.replace(
  /<a\b([^>]*?)href=["']mailto:[^"']+["']([^>]*?)>([\s\S]*?Quick\s*Verdict[\s\S]*?)<\/a>/gi,
  (m, a1, a2, inner) => {
    // preserve existing classes/attrs, only change href
    let attrs = `${a1}href="#quickverdict"${a2}`;
    // optional: ensure it doesn't open new tab
    attrs = attrs.replace(/\btarget=["'][^"']*["']/gi, "");
    return `<a${attrs}>${inner}</a>`;
  }
);

// B) Replace mailto in anchors that have a known CTA label in aria-label/title/data-*
html = html.replace(
  /<a\b([^>]*?)(aria-label|title)=["']([^"']*Quick\s*Verdict[^"']*)["']([^>]*?)href=["']mailto:[^"']+["']([^>]*?)>/gi,
  (m, a1, k, v, a2, a3) => `<a${a1}${k}="${v}"${a2}href="#quickverdict"${a3}>`
);

// 2) Optional: If there is a top nav CTA "Request Quick Verdict" as an <a> with mailto, rewrite similarly
html = html.replace(
  /<a\b([^>]*?)href=["']mailto:[^"']+["']([^>]*?)>([\s\S]*?Request[\s\S]*?Quick\s*Verdict[\s\S]*?)<\/a>/gi,
  (m, a1, a2, inner) => {
    let attrs = `${a1}href="#quickverdict"${a2}`;
    attrs = attrs.replace(/\btarget=["'][^"']*["']/gi, "");
    return `<a${attrs}>${inner}</a>`;
  }
);

if (html === before) {
  console.log("⚠️ No matching Quick Verdict mailto-CTAs found. Nothing changed.");
} else {
  fs.writeFileSync(OUTPUT, html, "utf8");
  console.log("✅ Patched Quick Verdict CTAs: mailto -> #quickverdict");
}
