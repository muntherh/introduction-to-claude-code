import type { SlideMeta } from "@/types";

/**
 * The running order of the deck. `index` in every hook and control is an
 * index into this array, so adding a slide means editing this file and the
 * matching entry in `sections/index.ts` — they are parallel arrays and
 * nothing checks the alignment for you.
 *
 * The deck is deliberately in two halves. Slides 02–07 are the theory: what
 * Claude Code is and how it behaves. Slides 08–14 are hands-on: the room
 * follows along in a real terminal. The hinge is slide 08, the first session.
 *
 * `cue` is for the presenter: one line saying what they say here.
 */
export const SLIDES: SlideMeta[] = [
  {
    id: "hero",
    label: "Welcome",
    cue: "Welcome the room. Say this is hands-on, and the terminal is the point.",
  },

  // ---- Part one: the theory ----------------------------------------------
  {
    id: "what-is-claude-code",
    label: "What is Claude Code?",
    cue: "Open two or three cards. Land on: it is a teammate that lives in your project.",
  },
  {
    id: "where-it-lives",
    label: "Where it lives",
    cue: "Point at the terminal. This is the whole interface — no tabs, no dashboard.",
  },
  {
    id: "how-it-works",
    label: "How it works",
    cue: "Walk the four beats out loud. Stress that it reads before it writes.",
  },
  {
    id: "it-reads-your-project",
    label: "It reads your project",
    cue: "Ask the room a question, then show which files it opened to answer it.",
  },
  {
    id: "chat-vs-claude-code",
    label: "Chat vs Claude Code",
    cue: "Do the sorting drill with the room out loud before you click.",
  },
  {
    id: "you-are-in-control",
    label: "You are in control",
    cue: "Deny one request on purpose. Nothing happens — that is the point.",
  },

  // ---- Part two: hands-on -------------------------------------------------
  {
    id: "install",
    label: "Install and start",
    cue: "Everyone types this now. Wait for the room before moving on.",
  },
  {
    id: "first-session",
    label: "Your first session",
    cue: "Type a prompt live. Let the room watch the whole turn land.",
  },
  {
    id: "a-good-prompt",
    label: "A good prompt",
    cue: "Press Explain. Take the prompt apart line by line.",
  },
  {
    id: "working-in-steps",
    label: "Working in steps",
    cue: "Edit a step in front of them. The plan is theirs to change.",
  },
  {
    id: "claude-md",
    label: "CLAUDE.md",
    cue: "Try to break a rule. Show that it refuses and says why.",
  },
  {
    id: "slash-commands",
    label: "Slash commands",
    cue: "Open /init and /clear. Those two carry most beginners.",
  },
  {
    id: "ship-it",
    label: "Ship it",
    cue: "Four beats from a change to a pull request. Nobody touches git by hand.",
  },

  // ---- Close --------------------------------------------------------------
  {
    id: "quiz",
    label: "Quick quiz",
    cue: "Read each question out. Let the room answer before you click.",
  },
  {
    id: "summary",
    label: "You learned",
    cue: "Hand out the starter prompt. Tell them to run it tonight.",
  },
];

export const TOTAL_SLIDES = SLIDES.length;

/** Slide indices referenced by name elsewhere in the app. */
export const SLIDE_INDEX = Object.fromEntries(
  SLIDES.map((slide, index) => [slide.id, index]),
) as Record<string, number>;
