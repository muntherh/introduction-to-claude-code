/**
 * Checks that every slide fits the presenter's actual laptop.
 *
 *   npm run build && npm run preview &
 *   node scripts/verify-fit.mjs http://127.0.0.1:4173
 *
 * Two separate questions, because they matter differently:
 *
 *   1. Does any CONTROL sit below the fold? That is a hard failure — a
 *      presenter cannot press a button they cannot see, and they will not
 *      think to scroll a slide mid-sentence.
 *   2. How much trailing content is below the fold? Trailing prose (a closing
 *      aside, a footer line) costs a nudge of scroll, which is survivable.
 *      Anything past ~50px is not.
 *
 * 1280x720 is the viewport that decides this. A large monitor always passes.
 */
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
  console.error("usage: node scripts/verify-fit.mjs <url>");
  process.exit(2);
}

const VIEWPORTS = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1280x720", width: 1280, height: 720 },
];

/** Trailing prose below this many pixels is a nudge, not a broken slide. */
const OVERFLOW_BUDGET = 50;

const browser = await chromium.launch();
let failures = 0;

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });
  await page.goto(url, { waitUntil: "networkidle" });

  const ids = await page.evaluate(() =>
    [...document.querySelectorAll("section[id]")].map((section) => section.id),
  );

  console.log(`\n== ${viewport.name} ==`);

  for (const id of ids) {
    await page.evaluate((slideId) => {
      document.getElementById(slideId)?.scrollIntoView();
    }, id);
    // Let the entrance animations settle: an element still travelling reads
    // as clipped when it is not.
    await page.waitForTimeout(1400);

    const report = await page.evaluate((slideId) => {
      const section = document.getElementById(slideId);
      const body = section?.querySelector(".overflow-y-auto");
      if (!body) return { overflow: 0, clipped: [] };

      const box = body.getBoundingClientRect();
      // pb-32 is deliberate breathing room under the chrome, not content.
      const pad = parseFloat(getComputedStyle(body).paddingBottom) || 0;

      const clipped = [
        ...body.querySelectorAll("button, a[href], input, textarea"),
      ]
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          return rect.height > 0 && rect.bottom > box.bottom + 2;
        })
        .map((el) =>
          (el.getAttribute("aria-label") || el.textContent || el.tagName)
            .trim()
            .slice(0, 44),
        );

      return {
        overflow: Math.max(0, body.scrollHeight - pad - body.clientHeight),
        clipped,
      };
    }, id);

    if (report.clipped.length > 0) {
      failures++;
      console.log(`  FAIL ${id} — control below the fold: ${report.clipped.join(" | ")}`);
    } else if (report.overflow > OVERFLOW_BUDGET) {
      failures++;
      console.log(`  FAIL ${id} — ${Math.round(report.overflow)}px of content below the fold`);
    } else if (report.overflow > 4) {
      console.log(`  ok   ${id} — ${Math.round(report.overflow)}px of trailing prose below the fold`);
    }
  }

  await page.close();
}

await browser.close();

console.log(
  failures === 0
    ? "\nEvery control is reachable and no slide overflows its budget."
    : `\n${failures} problem(s) found.`,
);
process.exit(failures === 0 ? 0 : 1);
