// patch-landing.js
// Safe patcher for tvac-public-landing/index.html (no manual edits)
// - Replaces the content of <section id="quickverdict">...</section> with <div id="qv-app"></div>
// - Injects window.TVAC_API_BASE and <script src="quickverdict.js"></script> before </body>

import fs from "fs";

const INPUT = "index.html";
const OUTPUT = "index.html"; // patch in-place

// ✅ Your Render API URL from the screenshot
const API_BASE = "https://tokenlex-api-new.onrender.com";

let html = fs.readFileSync(INPUT, "utf8");

// 1) Replace the content of the quickverdict section with a container
const sectionRegex = /<section\b[^>]*\bid=["']quickverdict["'][^>]*>[\s\S]*?<\/section>/i;

if (!sectionRegex.test(html)) {
  console.error('Could not find <section id="quickverdict"> ... </section> in index.html');
  process.exit(1);
}

html = html.replace(sectionRegex, (match) => {
  // Keep the original opening tag to preserve classes/styles
  const openTag = match.match(/<section\b[^>]*>/i)?.[0] || '<section id="quickverdict">';
  return `${openTag}\n  <div id="qv-app"></div>\n</section>`;
});

// 2) Inject scripts before </body> (only if not already present)
const markerConfig = "window.TVAC_API_BASE";
const markerScript = "quickverdict.js";

if (!html.includes(markerConfig) && !html.includes(markerScript)) {
  const inject = `
  <script>
    // API base for Quick Verdict
    window.TVAC_API_BASE = "${API_BASE}";
  </script>
  <script src="quickverdict.js"></script>
`;

  if (!html.includes("</body>")) {
    console.error("Could not find </body> in index.html");
    process.exit(1);
  }

  html = html.replace("</body>", `${inject}\n</body>`);
} else {
  console.log("Scripts already present – skipping script injection.");
}

fs.writeFileSync(OUTPUT, html, "utf8");
console.log("✅ index.html patched successfully.");
console.log(`✅ window.TVAC_API_BASE set to: ${API_BASE}`);
