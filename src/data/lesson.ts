/**
 * Every word the room reads lives here — never inside a component.
 *
 * This is what makes the deck retargetable: changing the subject should mean
 * rewriting this file, not touching the sections. Keep sentences short enough
 * to read from the back of a room.
 *
 * The audience is beginners: people who have opened a terminal maybe twice,
 * and who have never run a build tool. Write at that level throughout — no
 * "repository", no "dependency graph", no "idempotent".
 */
import {
  Blocks,
  BookMarked,
  Brain,
  Eraser,
  FileSearch,
  FolderTree,
  GitBranch,
  GitPullRequest,
  Hammer,
  ListChecks,
  MessageSquare,
  Rocket,
  ScrollText,
  Search,
  ShieldCheck,
  Terminal,
  Wrench,
} from "lucide-react";
import type { ExplanationItem } from "@/components/ExplanationPanel";
import type {
  ContextQuestion,
  ExplorerCard,
  PermissionRequest,
  QuizQuestion,
  SequenceStep,
  SortingItem,
  SummaryConcept,
} from "@/types";

/* ==========================================================================
   01 — Hero
   ========================================================================== */

export const HERO = {
  /** Short — this is animated per letter and sized against viewport width. */
  wordmark: "CLAUDE CODE",
  kicker: "Introduction",
  headline: "An AI that works inside your project, not beside it",
  lead: "In the next hour you will install it, talk to it, and let it change real files — without writing a line of code yourself.",
  cta: "Start",
} as const;

/* ==========================================================================
   02 — What is Claude Code?
   ========================================================================== */

export const WHAT_IS_CLAUDE_CODE = {
  eyebrow: "The idea",
  title: "What is Claude Code?",
  lead: "It is Claude, running in your terminal, with permission to read and change the project you are standing in.",
  hint: "Open a card",
  placeholder: "Pick a card to see what that looks like in practice.",
  cards: [
    {
      id: "teammate",
      title: "A teammate, not a search box",
      icon: MessageSquare,
      example:
        "You describe the outcome you want. It does the work and tells you what it changed.",
      snippet: "Add a dark mode toggle to the settings page.",
    },
    {
      id: "in-your-project",
      title: "It sits inside your project",
      icon: FolderTree,
      example:
        "You start it in a folder, and that folder is everything it can see and touch.",
      snippet: "cd my-website && claude",
    },
    {
      id: "reads-first",
      title: "It reads before it writes",
      icon: FileSearch,
      example:
        "It opens your real files first, so its answer fits your project instead of a generic one.",
      snippet: "Why is the login button not working?",
    },
    {
      id: "does-things",
      title: "It actually does things",
      icon: Hammer,
      example:
        "It edits files, runs commands, installs packages and fixes what it broke.",
      snippet: "Install Tailwind and set it up for me.",
    },
    {
      id: "asks-first",
      title: "It asks before it acts",
      icon: ShieldCheck,
      example:
        "Anything that changes your machine stops and waits for you to say yes.",
      snippet: "Allow Claude to edit index.html?  (y/n)",
    },
  ] satisfies ExplorerCard[],
} as const;

/* ==========================================================================
   03 — Where it lives
   ========================================================================== */

export const WHERE_IT_LIVES = {
  eyebrow: "The interface",
  title: "It lives in your terminal",
  lead: "No tabs, no dashboard, no upload button. One black window, open in the folder you are working on.",
  /** Shown in the fake terminal, before anything is typed. */
  banner: [
    " ",
    "  ✱ Welcome to Claude Code",
    " ",
    "  cwd: ~/projects/my-website",
    "  Type your request, or /help for commands.",
    " ",
  ].join("\n"),
  points: [
    {
      id: "folder",
      title: "The folder is the scope",
      body: "Whatever folder you start it in is the project. It cannot wander outside.",
      icon: FolderTree,
    },
    {
      id: "plain-words",
      title: "You type plain English",
      body: "No commands to memorise. Say what you want the way you would say it to a person.",
      icon: MessageSquare,
    },
    {
      id: "stays-open",
      title: "It stays open while you work",
      body: "One long conversation, not a fresh question every time. It remembers the last hour.",
      icon: Brain,
    },
  ],
  aside:
    "The terminal looks unfriendly, and that is the only hard part of today. Once it is open, everything after this is a conversation.",
} as const;

/* ==========================================================================
   04 — How it works
   ========================================================================== */

export const HOW_IT_WORKS = {
  eyebrow: "The loop",
  title: "How it works",
  lead: "Every single task follows the same four beats. Learn these and you have learned the tool.",
  steps: [
    {
      id: "ask",
      title: "You ask",
      detail: "One task, in plain words. Small tasks come back better than big ones.",
      sample: "Make the header stick to the top when I scroll.",
    },
    {
      id: "look",
      title: "It looks",
      detail: "It opens the files that matter before deciding anything. This is why its answer fits your project.",
      sample: "Read  src/components/Header.tsx",
    },
    {
      id: "change",
      title: "It changes",
      detail: "It edits the files and shows you exactly which lines moved.",
      sample: "Edit  src/components/Header.tsx  +4 -1",
    },
    {
      id: "check",
      title: "You check",
      detail: "You look at the result and say what is still wrong. That reply is the next task.",
      sample: "Close, but it covers the first line of text.",
    },
  ] satisfies SequenceStep[],
  complete:
    "Ask, look, change, check. Nothing you do today leaves this loop.",
} as const;

/* ==========================================================================
   05 — It reads your project
   ========================================================================== */

export const CONTEXT = {
  eyebrow: "Why it is different",
  title: "It reads your real project",
  lead: "This is the whole reason it beats a chat window: it answers from your files, not from a guess about them.",
  hint: "Ask it something",
  questions: [
    {
      id: "start",
      question: "How do I run this project?",
      reads: ["package.json", "README.md"],
      answer: "Run npm run dev — it starts on http://localhost:5173.",
    },
    {
      id: "colour",
      question: "Where is the orange colour defined?",
      reads: ["src/styles/index.css"],
      answer: "One place: --color-accent-warm in the @theme block, line 34.",
    },
    {
      id: "bug",
      question: "Why is the contact form not sending?",
      reads: ["src/ContactForm.tsx", "src/lib/api.ts"],
      answer: "The form posts to /api/contact, but api.ts still points at /api/message.",
    },
    {
      id: "count",
      question: "How many pages does this site have?",
      reads: ["src/pages/"],
      answer: "Four: home, about, work and contact.",
    },
  ] satisfies ContextQuestion[],
  aside:
    "A chat window cannot answer any of these, because it has never seen your files. That is the entire difference.",
} as const;

/* ==========================================================================
   06 — Chat vs Claude Code
   ========================================================================== */

export const CHAT_VS = {
  eyebrow: "Side by side",
  title: "A chat window vs Claude Code",
  lead: "Same model underneath. The difference is what it is allowed to see and touch.",
  chat: {
    title: "A chat window",
    glyph: "▭",
    where: "Runs in a browser tab.",
    strength: "Best for learning and for code you paste in.",
    example: "Explain what this function does.",
  },
  claude: {
    title: "Claude Code",
    glyph: ">_",
    where: "Runs inside your project folder.",
    strength: "Best for changing something that already exists.",
    example: "Fix the contact form and show me the diff.",
  },
  drillHint: "Your turn — which one?",
  items: [
    {
      id: "explain",
      task: "What is the difference between a list and a tuple?",
      answer: "chat",
      because: "Nothing to open. It is a question about the language, not your project.",
    },
    {
      id: "rename",
      task: "Rename this variable everywhere in my project.",
      answer: "claude",
      because: "It has to find every file that uses it, and edit each one.",
    },
    {
      id: "learn",
      task: "Teach me how CSS grid works.",
      answer: "chat",
      because: "You want an explanation, not a change to your files.",
    },
    {
      id: "test",
      task: "The build is failing. Find out why and fix it.",
      answer: "claude",
      because: "It needs to run the build, read the error, and change the code.",
    },
  ] satisfies SortingItem[],
  done: "That is the whole rule: if it has to touch your files, it is Claude Code.",
  almost: "Close. Ask one question: does it need to open my files?",
} as const;

/* ==========================================================================
   07 — You are in control
   ========================================================================== */

export const CONTROL = {
  eyebrow: "Safety",
  title: "You are in control",
  lead: "Claude Code stops and asks before it touches anything. Saying no is a normal answer, not a failure.",
  hint: "Allow it, or refuse it",
  requests: [
    {
      id: "read",
      tool: "Read",
      detail: "src/components/Header.tsx",
      allowed: "Opened the file. Nothing on your machine has changed.",
      denied: "Fine — but now it is guessing about a file it cannot see.",
    },
    {
      id: "edit",
      tool: "Edit",
      detail: "src/components/Header.tsx  ·  +4 −1",
      allowed: "Four lines added, one removed. You can undo it with git at any time.",
      denied: "Nothing was written. The file is exactly as you left it.",
    },
    {
      id: "install",
      tool: "Bash",
      detail: "npm install framer-motion",
      allowed: "Package installed. Read what it is installing before you agree.",
      denied: "Nothing installed. Ask it why it wants that package first.",
      risky: true,
    },
    {
      id: "delete",
      tool: "Bash",
      detail: "rm -rf ./old-site",
      allowed: "Gone. This is the one to think about — delete is not undoable.",
      denied: "Good instinct. Never approve a delete you did not ask for.",
      risky: true,
    },
  ] satisfies PermissionRequest[],
  aside:
    "Read the line before you press y. It is short on purpose, and it is the only thing standing between a suggestion and a change.",
} as const;

/* ==========================================================================
   08 — Install and start
   ========================================================================== */

export const INSTALL = {
  eyebrow: "Hands-on starts here",
  title: "Install and start",
  lead: "Three lines. Everyone in the room types them now, and we wait until the whole room is in.",
  steps: [
    {
      id: "install",
      label: "1. Install it, once, on your machine",
      command: "npm install -g @anthropic-ai/claude-code",
      output: [
        "added 1 package in 18s",
        "claude-code installed",
      ],
    },
    {
      id: "cd",
      label: "2. Go into the folder you want to work on",
      command: "cd ~/projects/my-website",
      output: ["~/projects/my-website"],
    },
    {
      id: "run",
      label: "3. Start it",
      command: "claude",
      output: [
        "✱ Welcome to Claude Code",
        "cwd: ~/projects/my-website",
        "Type your request, or /help for commands.",
      ],
    },
  ],
  requirement: "You need Node.js 18 or newer. If step 1 fails, that is almost always why.",
  exitHint: "To leave, type /exit or press Ctrl+C twice. Your files stay exactly as they were.",
} as const;

/* ==========================================================================
   09 — Your first session
   ========================================================================== */

export const FIRST_SESSION = {
  eyebrow: "Your turn",
  title: "Your first session",
  lead: "Type a request and watch the whole turn: it reads, it decides, it edits, it reports back.",
  placeholder: "Add a contact form to the home page",
  presets: [
    "Add a contact form to the home page",
    "Make the site work properly on a phone",
    "Change every button to rounded corners",
  ],
  hint: "Pick a request, or type your own, then send it.",
  aside:
    "Notice how much of the turn is reading. That is not the tool being slow — that is the tool refusing to guess.",
} as const;

/* ==========================================================================
   10 — A good prompt
   ========================================================================== */

export const GOOD_PROMPT = {
  eyebrow: "The one skill",
  title: "What a good request looks like",
  lead: "You cannot control the code any more. You control the request — so this is the skill worth an hour of your life.",
  lines: [
    { id: "what", text: "Add a contact form to the home page." },
    { id: "detail", text: "It needs a name, an email and a message." },
    { id: "constraint", text: "Match the styling of the newsletter box already on that page." },
    { id: "process", text: "Show me the plan before you change any files." },
  ],
  parts: [
    {
      id: "what",
      token: "Add a contact form to the home page.",
      title: "Say what, and say where",
      meaning:
        "One task, and the exact place it goes. “Improve the site” gives it nothing to aim at.",
    },
    {
      id: "detail",
      token: "It needs a name, an email and a message.",
      title: "List what it must do",
      meaning:
        "Anything you do not name, it will decide for you — and you will not like all of those decisions.",
    },
    {
      id: "constraint",
      token: "Match the styling of the newsletter box already on that page.",
      title: "Point at something that exists",
      meaning:
        "Pointing at real code in your project beats describing a look in words. This is the line a chat window cannot use.",
    },
    {
      id: "process",
      token: "Show me the plan before you change any files.",
      title: "Say how you want to work",
      meaning:
        "You can steer the process, not just the result. For a beginner this line is worth all the others.",
    },
  ] satisfies ExplanationItem[],
  result: [
    "Read  src/pages/Home.tsx",
    "Read  src/components/NewsletterBox.tsx",
    "Here is the plan before I touch anything:",
    "1. New ContactForm component, styled like NewsletterBox",
    "2. Drop it under the newsletter section on Home",
  ],
  comparison: {
    question: "Which of these gets you what you wanted?",
    note: "All three ask for the same thing. Only one of them will get it.",
    options: [
      "make the site better",
      "Add a contact form to the home page with name, email and message. Match the newsletter box styling.",
      "contact form pls",
    ],
    bestIndex: 1,
    right:
      "Right — it says what, where, what it must do, and what to match.",
    wrong:
      "Too vague. It will build something, and it will not be the thing in your head.",
  },
} as const;

/* ==========================================================================
   11 — Working in steps
   ========================================================================== */

export const PLAN = {
  eyebrow: "Working with it",
  title: "Read the plan first",
  lead: "For anything bigger than a one-line change, ask for a plan. Fixing a wrong step costs far less than fixing a wrong pile of code.",
  defaultPlan: [
    "Read the home page",
    "Build the form",
    "Match the styling",
    "Show me the diff",
  ],
  suggestions: [
    "Test on a phone",
    "Handle empty fields",
    "Write the README",
    "Commit the change",
  ],
  aside:
    "Delete a step you did not want. Reword one that is vague. The plan is a draft addressed to you, not an announcement.",
  emptyPlan: "The plan is empty",
  full: "That is plenty for one task. Small tasks beat big ones.",
  help: "Use the pencil to reword a step, or the cross to drop it.",
} as const;

/* ==========================================================================
   12 — CLAUDE.md
   ========================================================================== */

export const PROJECT_RULES = {
  eyebrow: "Working with it",
  title: "CLAUDE.md",
  lead: "A file of house rules that Claude Code reads before every single task. Write them once; they hold for every session after.",
  hint: "Try to break one",
  rules: [
    "Never push to main",
    "Explain before you edit",
    "No new packages without asking",
    "Keep the code commented",
    "Reply to me in Arabic",
  ],
  refusal: "That rule is in CLAUDE.md.",
  reason: "Claude Code reads the file before every task and will not quietly go around it.",
  aside:
    "Put anything you would otherwise retype every session in here: how to run the project, the style you like, and what is off-limits.",
  clear: "Every rule is in force. Click one and see.",
} as const;

/* ==========================================================================
   13 — Slash commands
   ========================================================================== */

export const SLASH_COMMANDS = {
  eyebrow: "Worth knowing",
  title: "Five commands to remember",
  lead: "Everything else is plain English. These five are the exceptions, and two of them carry most beginners.",
  hint: "Open a command",
  placeholder: "Pick a command to see what it does.",
  cards: [
    {
      id: "init",
      title: "/init",
      icon: ScrollText,
      example:
        "Run it once in a new project. It reads everything and writes the first CLAUDE.md for you.",
      snippet: "/init",
    },
    {
      id: "clear",
      title: "/clear",
      icon: Eraser,
      example:
        "Starts a fresh conversation. Use it when you move to a new task and the old one is just noise.",
      snippet: "/clear",
    },
    {
      id: "help",
      title: "/help",
      icon: BookMarked,
      example: "Lists every command available to you right now. Nothing to memorise.",
      snippet: "/help",
    },
    {
      id: "review",
      title: "/review",
      icon: Search,
      example: "Reads a pull request and tells you what is wrong with it before a human does.",
      snippet: "/review 42",
    },
    {
      id: "undo",
      title: "Escape, twice",
      icon: Blocks,
      example:
        "Not a command — a key. It stops Claude Code mid-task, which you will want more often than you expect.",
      snippet: "Esc  Esc",
    },
  ] satisfies ExplorerCard[],
} as const;

/* ==========================================================================
   14 — Ship it
   ========================================================================== */

export const SHIP_IT = {
  eyebrow: "The finish line",
  title: "From a change to a pull request",
  lead: "The part that scares beginners most is the part you now never have to do by hand.",
  steps: [
    {
      id: "change",
      title: "You describe the change",
      detail: "Still plain English. Nothing about this step is different from the rest of today.",
      sample: "Fix the broken link in the footer.",
    },
    {
      id: "commit",
      title: "It saves your work",
      detail: "It writes the commit message too, describing what actually changed.",
      sample: "git commit -m \"Fix broken privacy link in footer\"",
    },
    {
      id: "push",
      title: "It sends it to GitHub",
      detail: "On a new branch, so the live site is never the thing you are experimenting on.",
      sample: "git push -u origin fix-footer-link",
    },
    {
      id: "pr",
      title: "It opens the pull request",
      detail: "Title, description and the list of changes, ready for someone to review.",
      sample: "Opened PR #42 — Fix broken privacy link in footer",
    },
  ] satisfies SequenceStep[],
  complete:
    "You never typed a git command. You described four outcomes.",
  aside:
    "Ask it to explain any of these steps and it will. That is how you learn git — by watching it happen on your own project.",
} as const;

/* ==========================================================================
   15 — Quiz
   ========================================================================== */

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-where",
    prompt: "Where does Claude Code run?",
    options: [
      "In a browser tab, like a normal chat",
      "In your terminal, inside a project folder",
      "On a website you upload your files to",
      "Inside GitHub, in the pull request page",
    ],
    answerIndex: 1,
    because:
      "You start it with `claude` in a folder, and that folder is the whole project it can see.",
  },
  {
    id: "q-difference",
    prompt: "What can Claude Code do that a chat window cannot?",
    options: [
      "Write better code",
      "Answer faster",
      "Read and change the real files in your project",
      "Explain what a function does",
    ],
    answerIndex: 2,
    because:
      "Same model underneath. The difference is access: it opens your actual files and edits them.",
  },
  {
    id: "q-loop",
    prompt: "What does Claude Code do before it changes anything?",
    options: [
      "It reads the files that matter",
      "It installs the packages it needs",
      "It commits your current work",
      "It asks you to paste the code in",
    ],
    answerIndex: 0,
    because:
      "Ask, look, change, check. The looking is what makes the answer fit your project.",
  },
  {
    id: "q-claudemd",
    prompt: "What is CLAUDE.md for?",
    options: [
      "It stores your password",
      "It is where the code goes",
      "It holds project rules Claude Code reads before every task",
      "It is a log of everything it did",
    ],
    answerIndex: 2,
    because:
      "Write the rules once — how to run the project, the style you want, what is off-limits — and they hold every session.",
  },
  {
    id: "q-prompt",
    prompt: "Which request will get you what you actually wanted?",
    options: [
      "fix the site",
      "make it look nicer please",
      "Add a contact form to the home page with name, email and message.",
      "contact form",
    ],
    answerIndex: 2,
    because:
      "It says what, where, and exactly what it must do. Everything you leave out, it decides for you.",
  },
];

/* ==========================================================================
   16 — Summary
   ========================================================================== */

export const SUMMARY_CONCEPTS: SummaryConcept[] = [
  {
    id: "what",
    label: "What it is",
    slideIndex: 1,
    recap: "Claude, in your terminal, inside your project.",
  },
  {
    id: "loop",
    label: "The loop",
    slideIndex: 3,
    recap: "Ask, look, change, check — every single task.",
  },
  {
    id: "context",
    label: "Real files",
    slideIndex: 4,
    recap: "It answers from your project, not from a guess.",
  },
  {
    id: "control",
    label: "Your call",
    slideIndex: 6,
    recap: "It asks before it touches anything. No is an answer.",
  },
  {
    id: "prompt",
    label: "The request",
    slideIndex: 9,
    recap: "What, where, what it must do, and how to work.",
  },
  {
    id: "rules",
    label: "CLAUDE.md",
    slideIndex: 11,
    recap: "House rules it reads before every task.",
  },
];

export const SUMMARY = {
  eyebrow: "Well done",
  title: "You learned",
  lead: "You installed it, talked to it, and let it change a real project.",
  nextTitle: "Now break something small.",
  nextBody:
    "Open a folder you do not care about and give it a task. The first attempt is meant to be wrong.",
  promptTitle: "Your first real prompt",
  promptHelp: "Copy this, open Claude Code in a project folder, and paste it in.",
  steps: [
    "1. Copy the prompt",
    "2. Open a project folder",
    "3. Run claude",
    "4. Paste it in and go",
  ],
  footer: "Ask → Look → Change → Check",
} as const;

/**
 * The prompt the room copies at the end and runs for real.
 *
 * It is deliberately a *good* prompt, not merely a working one: it says what
 * to build, what it must do, what to match, and how to work — the same four
 * habits taught on slide 10. Do not shorten it into a one-liner; the shape is
 * the lesson.
 */
export const STARTER_PROMPT = `I am new to Claude Code and this is my first time using it.

Build me a small personal task tracker I can open in my browser.

It must let me:
- add a task
- tick a task off
- delete a task
- still have my tasks after I close the page

Please:
- show me the plan before you change any files
- use plain HTML, CSS and JavaScript, with no frameworks
- comment the code, because I want to read it afterwards
- tell me exactly how to open it when you are done

Go one step at a time and check with me between steps.`;

/** Icons used by the "where it lives" and "ship it" slides. */
export const ICONS = {
  terminal: Terminal,
  git: GitBranch,
  pr: GitPullRequest,
  rocket: Rocket,
  wrench: Wrench,
  checks: ListChecks,
} as const;
