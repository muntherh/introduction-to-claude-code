/**
 * Drives every interaction in the deck and reports what actually worked.
 *
 *   npm run build && npm run preview &
 *   node scripts/verify-interactions.mjs http://127.0.0.1:4173
 *
 * `verify.mjs` proves the deck renders; this proves it *works*. Every check
 * below corresponds to something a presenter does in front of a room, so a
 * failure here is a slide that will embarrass someone on stage.
 *
 * Serve the production build, not the dev server.
 */

// Playwright may be a project dependency or a global install; try both so
// this runs without adding a dependency the deck does not otherwise need.
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  ({ chromium } = await import(
    "/opt/node22/lib/node_modules/playwright/index.mjs"
  ));
}

const URL = process.argv[2] ?? "http://127.0.0.1:4173";
const results = [];
const errors = [];

const ok = (name, pass, note = "") =>
  results.push({ name, pass, note });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(URL, { waitUntil: "networkidle" });

const go = async (id) => {
  await page.evaluate((slideId) => {
    document.getElementById(slideId)?.scrollIntoView({ behavior: "auto" });
  }, id);
  await page.waitForTimeout(700);
};

const sec = (id) => page.locator(`#${id}`);

// ---- 02 card explorer ----------------------------------------------------
await go("what-is-claude-code");
{
  const s = sec("what-is-claude-code");
  const before = await s.innerText();
  await s.getByRole("button", { name: /It reads before it writes/i }).click();
  await page.waitForTimeout(500);
  const after = await s.innerText();
  ok("02 card opens", after !== before && /opens your real files first/i.test(after));
}

// ---- 03 static terminal --------------------------------------------------
await go("where-it-lives");
{
  const t = await sec("where-it-lives").innerText();
  ok("03 terminal banner", /Welcome to Claude Code/.test(t) && /my-website/.test(t));
}

// ---- 04 step sequence ----------------------------------------------------
await go("how-it-works");
await page.waitForTimeout(3200);
{
  const t = await sec("how-it-works").innerText();
  ok("04 all four steps reveal",
    /You ask/.test(t) && /It looks/.test(t) && /It changes/.test(t) && /You check/.test(t));
}

// ---- 05 context reads ----------------------------------------------------
await go("it-reads-your-project");
{
  const s = sec("it-reads-your-project");
  await s.getByRole("button", { name: /Why is the contact form not sending/i }).click();
  await page.waitForTimeout(2600);
  const t = await s.innerText();
  ok("05 reads then answers",
    /src\/ContactForm\.tsx/.test(t) && /src\/lib\/api\.ts/.test(t) && /api\.ts still points/.test(t));
}

// ---- 06 sorting drill ----------------------------------------------------
await go("chat-vs-claude-code");
{
  const s = sec("chat-vs-claude-code");
  const answers = ["chat", "claude", "chat", "claude"];
  for (const a of answers) {
    const label = a === "chat" ? "Chat window" : "Claude Code";
    await s.getByRole("button", { name: new RegExp(`^${label}$`, "i") }).click();
    await page.waitForTimeout(450);
  }
  const t = await s.innerText();
  ok("06 sorting drill 4/4", /4\s*\/\s*4/.test(t) && /if it has to touch your files/i.test(t), t.slice(0, 0));
}

// ---- 07 permissions ------------------------------------------------------
await go("you-are-in-control");
{
  const s = sec("you-are-in-control");
  await s.getByRole("button", { name: /^Allow$/ }).click();
  await page.waitForTimeout(900);
  const afterAllow = await s.innerText();
  await s.getByRole("button", { name: /^Refuse$/ }).click();
  await page.waitForTimeout(900);
  const afterDeny = await s.innerText();
  ok("07 allow shows outcome", /You allowed it/i.test(afterAllow) && /Opened the file/.test(afterAllow));
  ok("07 refuse shows outcome", /You refused/i.test(afterDeny) && /Nothing was written/.test(afterDeny));
  // finish the queue
  await s.getByRole("button", { name: /^Refuse$/ }).click();
  await page.waitForTimeout(400);
  await s.getByRole("button", { name: /^Refuse$/ }).click();
  await page.waitForTimeout(500);
  const done = await s.innerText();
  ok("07 queue completes", /You refused 3 of 4/.test(done), done.match(/You refused[^\n]*/)?.[0] ?? "");
}

// ---- 08 install ----------------------------------------------------------
await go("install");
{
  const s = sec("install");
  for (let i = 0; i < 3; i++) {
    await s.getByRole("button", { name: /Run This Line/i }).click();
    await page.waitForTimeout(1300);
  }
  const t = await s.innerText();
  ok("08 three commands run",
    /npm install -g @anthropic-ai\/claude-code/.test(t) &&
    /cd ~\/projects\/my-website/.test(t) &&
    /Welcome to Claude Code/.test(t));
}

// ---- 09 first session ----------------------------------------------------
await go("first-session");
{
  const s = sec("first-session");
  await s.getByRole("button", { name: /^Send$/ }).click();
  await page.waitForTimeout(3600);
  const scripted = await s.innerText();
  ok("09 scripted turn plays",
    /src\/components\/NewsletterBox\.tsx/.test(scripted) && /2 files changed/.test(scripted));

  const input = s.getByLabel(/Or write your own/i);
  await input.fill("");
  await input.fill("Make the footer dark");
  await s.getByRole("button", { name: /^Send$/ }).click();
  await page.waitForTimeout(3200);
  const custom = await s.innerText();
  ok("09 typed request falls through",
    /Here is my plan for "Make the footer dark"/.test(custom) && /Nothing has changed yet/.test(custom));

  // empty input must not crash or produce a bogus turn
  await input.fill("");
  await s.getByRole("button", { name: /^Send$/ }).click();
  await page.waitForTimeout(1200);
  const empty = await s.innerText();
  ok("09 empty request handled", /Type a request first/.test(empty));

  // very long input must not break the layout
  await input.fill("x".repeat(200));
  const value = await input.inputValue();
  await s.getByRole("button", { name: /^Send$/ }).click();
  await page.waitForTimeout(3000);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  ok("09 long input clamped + no overflow", value.length === 60 && !overflow, `len=${value.length}`);
}

// ---- 10 good prompt ------------------------------------------------------
await go("a-good-prompt");
{
  const s = sec("a-good-prompt");
  await s.getByRole("button", { name: /Explain It/i }).click();
  await page.waitForTimeout(500);
  ok("10 explain panel opens", /Point at something that exists/.test(await s.innerText()));

  await s.getByRole("button", { name: /Compare Three/i }).click();
  await page.waitForTimeout(500);
  await s.getByRole("button", { name: /^make the site better$/i }).click();
  await page.waitForTimeout(400);
  ok("10 wrong option explained", /Too vague/.test(await s.innerText()));
  await s.getByRole("button", { name: /Add a contact form to the home page with name/i }).click();
  await page.waitForTimeout(400);
  ok("10 right option explained", /says what, where, what it must do/.test(await s.innerText()));

  await s.getByRole("button", { name: /Send It/i }).click();
  await page.waitForTimeout(1400);
  ok("10 result lands", /Here is the plan before I touch anything/.test(await s.innerText()));
}

// ---- 11 plan -------------------------------------------------------------
await go("working-in-steps");
{
  const s = sec("working-in-steps");
  await s.getByRole("button", { name: /Add Step/i }).click();
  await page.waitForTimeout(450);
  ok("11 step added", /5 steps planned/.test(await s.innerText()));

  await s.getByRole("button", { name: /Remove step 1, Read the home page/i }).click();
  await page.waitForTimeout(500);
  const t = await s.innerText();
  ok("11 numbering re-derives",
    /4 steps planned/.test(t) && /Starting with: Build the form/.test(t));

  await s.getByRole("button", { name: /Edit step 1, Build the form/i }).click();
  await page.waitForTimeout(300);
  await page.keyboard.type("Draft the form");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  ok("11 step edited", /Starting with: Draft the form/.test(await s.innerText()));

  await s.getByRole("button", { name: /^Reset$/ }).click();
  await page.waitForTimeout(400);
  ok("11 reset restores", /Starting with: Read the home page/.test(await s.innerText()));
}

// ---- 12 CLAUDE.md --------------------------------------------------------
await go("claude-md");
{
  const s = sec("claude-md");
  const before = await s.innerText();
  await s.getByRole("button", { name: /Try to break the rule: Never push to main/i }).click();
  await page.waitForTimeout(600);
  const after = await s.innerText();
  ok("12 rule refuses",
    /5 project rules in effect/.test(before) &&
    /That rule is in CLAUDE\.md/.test(after) &&
    /Blocked 1 time/.test(after));
}

// ---- 13 slash commands ---------------------------------------------------
await go("slash-commands");
{
  const s = sec("slash-commands");
  await s.getByRole("button", { name: /\/init/i }).first().click();
  await page.waitForTimeout(500);
  ok("13 command card opens", /writes the first CLAUDE\.md for you/.test(await s.innerText()));
}

// ---- 14 ship it ----------------------------------------------------------
await go("ship-it");
await page.waitForTimeout(3200);
{
  const t = await sec("ship-it").innerText();
  ok("14 four beats reveal",
    /You describe the change/.test(t) && /Opened PR #42/.test(t) && /You never typed a git command/.test(t));
}

// ---- 15 quiz -------------------------------------------------------------
await go("quiz");
{
  const s = sec("quiz");
  const answers = [
    /In your terminal, inside a project folder/i,
    /Read and change the real files in your project/i,
    /It reads the files that matter/i,
    /It holds project rules Claude Code reads before every task/i,
    /Add a contact form to the home page with name, email and message\./i,
  ];
  for (let i = 0; i < answers.length; i++) {
    await s.getByRole("button", { name: answers[i] }).click();
    await page.waitForTimeout(450);
    if (i < answers.length - 1) {
      await s.getByRole("button", { name: /Next Question/i }).click();
      await page.waitForTimeout(500);
    }
  }
  ok("15 quiz scores 5/5", /Score\s*5\s*\/\s*5/.test(await s.innerText()));
  await s.getByRole("button", { name: /See Summary/i }).click();
  await page.waitForTimeout(900);
}

// ---- 16 summary ----------------------------------------------------------
{
  const s = sec("summary");
  const t = await s.innerText();
  ok("16 score reaches summary", /Quiz score/i.test(t) && /5\s*\/\s*5/.test(t));
  const starter = await s.locator("textarea").inputValue();
  ok("16 starter prompt present", /I am new to Claude Code/.test(starter) && /Go one step at a time/.test(starter));
  const href = await s.getByRole("link", { name: /Open Claude Code/i }).getAttribute("href");
  ok("16 closing link is a real link", href === "https://claude.com/claude-code", String(href));
}

// ---- keyboard-only walk --------------------------------------------------
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
{
  await page.locator("body").click({ position: { x: 5, y: 5 } });
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("PageDown");
    await page.waitForTimeout(220);
  }
  const atEnd = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 40;
  });
  ok("keyboard reaches the last slide", atEnd);

  await page.keyboard.press("Home");
  await page.waitForTimeout(900);
  const atTop = await page.evaluate(() => document.documentElement.scrollTop < 40);
  ok("Home returns to the hero", atTop);
}

await browser.close();

const failed = results.filter((r) => !r.pass);
for (const r of results) {
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.note ? `  — ${r.note}` : ""}`);
}
console.log(`\n${results.length - failed.length}/${results.length} interactions passed`);
if (errors.length) {
  console.log(`\nCONSOLE ERRORS (${errors.length}):`);
  errors.slice(0, 10).forEach((e) => console.log("  " + e));
} else {
  console.log("\nNo console errors.");
}
process.exit(failed.length === 0 && errors.length === 0 ? 0 : 1);
