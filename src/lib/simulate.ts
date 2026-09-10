/**
 * Deterministic simulation of a Claude Code session.
 *
 * There is no model call, no network and no `eval` here. Every button in the
 * deck calls one of these pure helpers, so a live workshop always sees exactly
 * the same response — which is the whole point when you are teaching in front
 * of a room and the wifi is not to be trusted.
 *
 * It also means the deck still works years from now, when the real tool's
 * output has been redesigned twice.
 */
import type { ContextQuestion, TerminalLine } from "@/types";

/**
 * Clamp free text to something that stays readable on a projector and can
 * never break the terminal layout.
 */
export function cleanInput(value: string, maxLength: number): string {
  return value.replace(/[\r\n\t]/g, " ").slice(0, maxLength);
}

/** Drop a trailing full stop so a request reads well inside a sentence. */
function withoutFullStop(value: string): string {
  return value.trim().replace(/[.!?]+$/, "");
}

/* ==========================================================================
   Slide 05 — reading the project
   ========================================================================== */

/**
 * The turn Claude Code takes to answer a question about the project: it opens
 * the files first, then answers. The reads are the teaching point, not the
 * answer — a chat window would have jumped straight to a guess.
 */
export function simulateContextTurn(question: ContextQuestion): TerminalLine[] {
  return [
    { kind: "you", text: question.question },
    { kind: "think", text: "Let me look at the project first." },
    ...question.reads.map(
      (path): TerminalLine => ({ kind: "tool", tool: "Read", text: path }),
    ),
    { kind: "say", text: question.answer },
  ];
}

/* ==========================================================================
   Slide 09 — the first session
   ========================================================================== */

/**
 * Hand-written turns for the three suggested requests.
 *
 * Keyed by the exact preset string. Anything the room types instead falls
 * through to `genericTurn` below, which is honest about being generic rather
 * than pretending to understand arbitrary English.
 */
const SCRIPTED_TURNS: Record<string, TerminalLine[]> = {
  "Add a contact form to the home page": [
    { kind: "think", text: "I will look at the home page and the form you already have." },
    { kind: "tool", tool: "Read", text: "src/pages/Home.tsx" },
    { kind: "tool", tool: "Read", text: "src/components/NewsletterBox.tsx" },
    { kind: "say", text: "Your newsletter box already has the styling I need. I will match it." },
    { kind: "tool", tool: "Write", text: "src/components/ContactForm.tsx" },
    { kind: "tool", tool: "Edit", text: "src/pages/Home.tsx  ·  +3 −0" },
    { kind: "done", text: "2 files changed. Refresh the page to see the form." },
  ],
  "Make the site work properly on a phone": [
    { kind: "think", text: "First I need to see which parts break at a narrow width." },
    { kind: "tool", tool: "Read", text: "src/styles/index.css" },
    { kind: "tool", tool: "Read", text: "src/components/Header.tsx" },
    { kind: "say", text: "The header row does not wrap, so it pushes the page sideways on a phone." },
    { kind: "tool", tool: "Edit", text: "src/components/Header.tsx  ·  +6 −2" },
    { kind: "tool", tool: "Bash", text: "npm run build" },
    { kind: "done", text: "Fixed and rebuilt. Nothing scrolls sideways at 390px now." },
  ],
  "Change every button to rounded corners": [
    { kind: "think", text: "Let me find every button before I change any of them." },
    { kind: "tool", tool: "Search", text: "className=\"btn\"  ·  9 matches in 4 files" },
    { kind: "say", text: "All nine use one shared class, so this is a one-line change." },
    { kind: "tool", tool: "Edit", text: "src/styles/index.css  ·  +1 −1" },
    { kind: "done", text: "1 file changed. All nine buttons are rounded." },
  ],
};

/** The fallback turn for anything the room types themselves. */
function genericTurn(request: string): TerminalLine[] {
  const subject = withoutFullStop(request) || "that change";

  return [
    { kind: "think", text: "Before I change anything, let me read the project." },
    { kind: "tool", tool: "Read", text: "README.md" },
    { kind: "tool", tool: "Read", text: "src/App.tsx" },
    { kind: "say", text: `Here is my plan for "${subject}" — say yes and I will start.` },
    { kind: "say", text: "1. Change the files that own this  ·  2. Run the build  ·  3. Show you the diff" },
    { kind: "done", text: "Waiting for you. Nothing has changed yet." },
  ];
}

/** One full turn of a Claude Code session, from your request to its report. */
export function simulateSession(request: string): TerminalLine[] {
  const text = request.trim();

  // No `you` line here on purpose: an empty prompt line renders as a bare
  // chevron, which reads as a rendering bug rather than as an answer.
  if (text === "") {
    return [{ kind: "say", text: "Type a request first, then press Send." }];
  }

  const scripted = SCRIPTED_TURNS[text];

  return [
    { kind: "you", text },
    ...(scripted ?? genericTurn(text)),
  ];
}

/* ==========================================================================
   Slide 11 — the plan
   ========================================================================== */

/** The plan Claude Code writes before it edits anything. */
export function formatPlan(steps: string[]): string {
  if (steps.length === 0) return "Plan\n  (nothing to do)";
  const body = steps
    .map((step, stepIndex) => `  ${stepIndex + 1}. ${step}`)
    .join("\n");
  return `Plan\n${body}`;
}

/** What Claude Code says once the plan is agreed. */
export function simulatePlanRun(steps: string[]): string[] {
  if (steps.length === 0) {
    return ["Nothing planned yet. Add a step to get started."];
  }
  return [
    `${steps.length} ${steps.length === 1 ? "step" : "steps"} planned.`,
    `Starting with: ${steps[0]}`,
  ];
}

/* ==========================================================================
   Slide 12 — CLAUDE.md
   ========================================================================== */

/** The CLAUDE.md file rendered from a list of project rules. */
export function formatProjectRules(rules: readonly string[]): string {
  const body = rules.map((rule) => `- ${rule}`).join("\n");
  return `# CLAUDE.md\n\n${body}`;
}
