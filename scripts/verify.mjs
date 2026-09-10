/**
 * Structural verification pass for a workshop deck.
 *
 *   node scripts/verify.mjs http://127.0.0.1:4173
 *
 * Serve the production build first (`npm run build && npm run preview`), not
 * the dev server: dev-only warnings and un-minified layout differences make
 * the result unrepresentative of what gets presented.
 *
 * What this catches: console errors, horizontal overflow, a broken heading
 * outline, unlabelled controls, and direction mistakes. What it cannot catch:
 * whether the deck teaches anything, whether the copy reads well from the
 * back of a room, and whether Arabic text is in the right order. A person
 * still has to look.
 */

// Playwright may be a project dependency or a global install; try both so
// this runs without adding a dependency to a deck that does not want one.
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  ({ chromium } = await import(
    "/opt/node22/lib/node_modules/playwright/index.mjs"
  ));
}

const url = process.argv[2];
if (!url) {
  console.error("usage: node scripts/verify.mjs <url>");
  process.exit(2);
}

// 1280x720 is the one that matters: same aspect as 1920x1080 but far less
// room once fixed-size type and the presenter chrome are accounted for, and
// it is what the presenter's actual laptop tends to be.
const VIEWPORTS = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1280x720", width: 1280, height: 720 },
  { name: "390x844", width: 390, height: 844 },
];

const browser = await chromium.launch();
let failures = 0;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
  });
  const page = await ctx.newPage();

  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const info = await page.evaluate(() => {
    const de = document.documentElement;
    const code = document.querySelector("pre, code, .font-mono");

    // A control with no accessible name is unusable with a screen reader.
    const unlabelled = [...document.querySelectorAll("button, a")].filter(
      (el) =>
        !el.textContent.trim() &&
        !el.getAttribute("aria-label") &&
        !el.getAttribute("aria-labelledby") &&
        !el.getAttribute("title"),
    ).length;

    return {
      dir: de.dir || "(unset)",
      lang: de.lang || "(unset)",
      overflow: de.scrollWidth - de.clientWidth,
      h1: document.querySelectorAll("h1").length,
      sections: document.querySelectorAll("section").length,
      codeDir: code ? getComputedStyle(code).direction : "(no code block)",
      unlabelled,
    };
  });

  const problems = [];
  if (errors.length) problems.push(`${errors.length} console error(s)`);
  if (info.overflow > 0) problems.push(`${info.overflow}px horizontal overflow`);
  if (info.h1 !== 1) problems.push(`${info.h1} <h1> elements (expected 1)`);
  if (info.unlabelled > 0) problems.push(`${info.unlabelled} unlabelled control(s)`);
  if (info.dir === "rtl" && info.codeDir !== "ltr") {
    problems.push("code block is not pinned to ltr");
  }

  if (problems.length) failures++;

  console.log(
    `${vp.name.padEnd(10)} dir=${info.dir} lang=${info.lang} ` +
      `sections=${info.sections} codeDir=${info.codeDir} ` +
      `${problems.length ? "FAIL — " + problems.join("; ") : "OK"}`,
  );
  if (errors.length) {
    for (const e of errors.slice(0, 5)) console.log(`   ${e}`);
  }

  await ctx.close();
}

await browser.close();

console.log(
  failures
    ? `\n${failures} viewport(s) failed. These are structural checks only — ` +
        `still drive the interactions by hand.`
    : `\nStructural checks passed at all viewports. Now drive every ` +
        `interaction by hand — a slide that renders is not a slide that works.`,
);

process.exit(failures ? 1 : 0);
