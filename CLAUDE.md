# CLAUDE.md — Introduction to Claude Code (workshop deck)

> Handoff file. A fresh session should be able to read this and be useful
> immediately, without re-deriving anything.

## 0. Who you're working with

The owner (**muntherh**) is a **No-Code developer/designer**, not a traditional
software engineer. He runs a small student startup (Forsa) and gets
deliverables assigned with deadlines. He relies on Claude Code to handle the
engineering side end to end.

- **He writes in Arabic. Reply in Arabic.** The codebase and all deck copy are
  in English — keep it that way.
- Explain diagnoses and plans in plain language before touching code. Don't
  assume familiarity with React, git, or build tooling.
- He often verifies things himself in dashboards (GitHub, Vercel) via
  screenshots rather than the CLI — walk him through exact clicks when that is
  the only path.
- Get explicit approval before commits/pushes/deploys on anything beyond
  trivial docs.

## 1. What this project is

**Introduction to Claude Code** — a presenter-driven, **16-slide interactive
website** for a beginner workshop on Claude Code.

The audience is people who have opened a terminal maybe twice and have never
run a build tool. Every word in `src/data/lesson.ts` is written at that level:
no "repository", no "dependency", no "idempotent". Keep it there.

**The deck is deliberately in two halves**, and the split was the owner's
explicit requirement:

| Slides | Half | What it does |
| --- | --- | --- |
| 02–07 | **Theory** | What Claude Code is, where it lives, how it behaves |
| 08–14 | **Hands-on** | The room installs it and follows along in a real terminal |

Slide 08 (`install`) is the hinge — theory stops, hands start. **Do not
rebalance these halves** without the owner asking.

## 2. Status

The deck is **finished and verified**. See §10 for exactly what was verified.

**Not yet pushed to GitHub.** The repo `muntherh/introduction-to-claude-code`
exists (the owner created it), and it is attached to the session, but pushes
are refused:

> Claude doesn't have GitHub access to `muntherh/introduction-to-claude-code`
> for your organization.

The fix is a dashboard action **the owner has to take**: open
<https://github.com/apps/claude/installations/select_target> and add this
repository to the Claude GitHub App's allowed list. Or reconnect GitHub under
claude.ai Settings → Connectors. Once that is done, a push works normally —
nothing about the code needs to change.

Local history is on branch `claude/happy-davinci-r8wzov`.

## 3. Where this came from

Built with the **`workshop` skill** (which lives in
`muntherh/vibe-coding-workshop` under `.claude/skills/workshop/`). The skill
supplies the presentation shell: chrome, navigation, the slide frame, and the
interaction primitives. Same shell as
[python-basics-interactive-workshop](https://github.com/muntherh/python-basics-interactive-workshop)
and [vibe-coding-workshop](https://github.com/muntherh/vibe-coding-workshop) —
which is why all three decks feel like one family.

The subject matter is entirely new. Nothing was pushed to either source repo.

## 4. Stack and how to run it

React 19 · Vite 7 · TypeScript 5.9 · Tailwind CSS 4 · Framer Motion 12 ·
Lucide React · Fontsource (Inter, JetBrains Mono)

Requires **Node 20.19+ or 22.12+** (Vite 7).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run preview    # serve the build (port 4173)
npm run typecheck  # no emit
```

No backend, no database, no API keys, no model calls. `base: "./"` in
`vite.config.ts` so `dist/` works from a sub-path or a USB stick.

## 5. The deck

| # | id | Slide | Mechanic |
| --- | --- | --- | --- |
| 01 | `hero` | Welcome | Scroll-linked `CLAUDE CODE` wordmark |
| 02 | `what-is-claude-code` | What is Claude Code? | `CardExplorer` — 5 cards |
| 03 | `where-it-lives` | It lives in your terminal | Static `TerminalFrame` + 3 points |
| 04 | `how-it-works` | How it works | `StepSequence` — the 4-beat loop |
| 05 | `it-reads-your-project` | It reads your real project | Pick a question → `TerminalSession` shows the reads |
| 06 | `chat-vs-claude-code` | A chat window vs Claude Code | Comparison + 4-item sorting drill |
| 07 | `you-are-in-control` | You are in control | Allow/refuse four real permission prompts |
| 08 | `install` | Install and start | Three commands, run one at a time |
| 09 | `first-session` | Your first session | Type a request → full simulated turn |
| 10 | `a-good-prompt` | What a good request looks like | Line-by-line breakdown + 3-way comparison |
| 11 | `working-in-steps` | Read the plan first | Add/edit/remove plan steps |
| 12 | `claude-md` | CLAUDE.md | Locked rules that refuse to break |
| 13 | `slash-commands` | Five commands to remember | `CardExplorer` — 5 cards |
| 14 | `ship-it` | From a change to a pull request | `StepSequence` — the 4-beat loop again |
| 15 | `quiz` | Quick quiz | 5 questions, live score |
| 16 | `summary` | You learned | Recap chips + copyable starter prompt |

`data/slides.ts` (order) and `sections/index.ts` (components) **must stay
index-aligned** — index N in one is slide N in the other. Nothing checks this
at compile time.

## 6. Where things live

```
src/
  deck.config.ts   locale + writing direction
  components/      the presentation shell + TerminalSession (this deck's own)
  sections/        one component per slide + index.ts (running order)
  data/            slides.ts (deck order), lesson.ts (ALL teaching copy)
  hooks/           useDeckNavigation, useDeckContext, useFullscreen,
                   useElementHeight
  lib/             simulate.ts (all fake responses), codeHighlight.ts, cn.ts
  styles/          index.css — design tokens and base styles
  types/           shared TypeScript types
scripts/           verify.mjs, verify-fit.mjs, verify-interactions.mjs
```

**All teaching copy lives in `src/data/lesson.ts`.** Wording changes should
never require touching a component.

## 7. Design tokens

Defined once in `src/styles/index.css` under `@theme`. This deck's palette is
**Anthropic's brand, warm end only**:

```css
--color-void:        #0f0e0d;   /* warm near-black canvas, not navy */
--color-accent:      #d4a27f;   /* kraft — the quiet structural accent */
--color-accent-warm: #d97757;   /* Anthropic orange — the dominant highlight */
--color-chalk:       #faf9f5;
```

**Both accents are warm on purpose.** A cool second accent (Anthropic's brand
blue is the obvious candidate) dilutes exactly the thing this workshop is
about — the deck should read as Claude Code from the back of a room. The token
names still say `navy-*` because the shell components reference them; renaming
would touch every file for no visual gain.

Use the tokens. Do not hard-code hex values in components.

## 8. Rules and gotchas (do not regress these)

1. **Everything is simulated, deterministically.** `lib/simulate.ts` holds pure
   functions. No model calls, no network, no `eval`. A live workshop must
   behave identically every run, on any wifi. **Never add a real API call.**
2. **`TerminalSession` is this deck's signature interaction** (slides 05 and
   09), and `TerminalFrame` — its window chrome — is reused on slides 03 and
   10. The staged reveal runs on a fixed 420ms cadence, not a random one, so
   the demo is identical every time it is presented.
3. **Prompts are not syntax-highlighted.** `CodeBlock` has `variant="prompt"`
   that skips the tokenizer. Prompts are English — colouring them like code
   teaches the room that prompts are a formal syntax, which is the opposite of
   the point. Use `variant="code"` only for terminal commands and real code.
4. **`OutputPanel` draws its own `>` on every line.** Do not also prefix your
   lines with `$` — it renders as `> $ npm install`, which reads as a bug.
   Indent the response under the command instead (see `InstallSection`).
5. **Blank lines in `CodeBlock` need a non-breaking space (U+00A0).** A regular
   space collapses and the line loses its height.
6. **`CardExplorer` (02, 13) and `StepSequence` (04, 14) are each used twice.**
   That is the design — the room learns each interaction once — so check both
   slides after touching either.
7. **`sent` on slide 09 is `string | null`, not `string`.** `null` means
   nothing has been sent; `""` means a real send of an empty box, which has its
   own answer. Collapsing the two makes the Send button appear dead, which is
   a bug that was already found and fixed once.
8. **The hero wordmark's space is an explicit box.** In `HeroWordmark.tsx` each
   letter is an `inline-block` in its own mask; a plain space between two
   inline-blocks collapses and the title renders as "CLAUDECODE". Keep the
   `letter === " "` spacer branch.
9. **Accessibility is not decoration.** One `h1`, a skip link as the first tab
   stop, every control labelled, quiz correctness never signalled by colour
   alone, `prefers-reduced-motion` respected throughout. Keep all of it.
10. **Logical layout only.** The deck is LTR English, but every margin and
    offset uses `ms-`/`me-`/`ps-`/`pe-`/`text-start`. Adding `ml-4` or
    `text-left` quietly makes the shell LTR-only for whoever retargets it next.

## 9. Decisions already made (don't re-litigate without asking)

- **16 slides, not 12 or 14.** The theory/hands-on split needs both halves to
  breathe; a 45–60 minute session at 2–4 minutes a slide lands here.
- **Slide 07 exists because beginners are frightened.** Denying a permission
  prompt and watching nothing happen is the reassurance that makes the rest of
  the workshop usable. Do not cut it for time.
- **The closing link → `https://claude.com/claude-code`**, a single constant
  (`CLAUDE_CODE_URL`) at the top of `SummarySection.tsx`.
- **The starter prompt on slide 16 is deliberately a *good* prompt** — it says
  what to build, what it must do, what to match, and how to work. It
  demonstrates the four habits taught on slide 10. Don't shorten it.
- **The canvas is dark.** It reads better on a projector in a room where the
  lights cannot be fully dimmed.

## 10. Verification status

Verified against the production build with Playwright (Chromium), three ways.
All three are in `scripts/` and runnable — this deck has the automated
happy-path the earlier two decks lacked.

```bash
npm run build && npm run preview &
npm run verify                # structural
npm run verify:fit            # fits the presenter's laptop
npm run verify:interactions   # drives all 30 interactions
```

- **`verify`** — 1920×1080, 1280×720, 390×844: zero console errors, zero
  horizontal overflow, heading outline intact, every control labelled. **Passes
  at all three.**
- **`verify:fit`** — every control on every slide is fully reachable at
  1280×720, and no slide overflows its 50px trailing-prose budget. At
  1920×1080 every slide fits completely. Six slides carry 19–41px of closing
  prose below the fold at 1280×720; that is a nudge of scroll, and it is inside
  budget deliberately — shrinking type further would cost legibility from the
  back of a room.
- **`verify:interactions`** — **30/30 pass, no console errors.** It drives the
  card explorers, the step sequences, the context reads, the sorting drill at
  4/4, the permission queue (allow and refuse), all three install commands, a
  scripted turn and a typed turn and an empty turn and a 200-character turn,
  the explain and compare panels, adding/editing/removing/resetting plan steps,
  a refused CLAUDE.md rule, the quiz to 5/5, the score reaching the summary,
  the closing link being a real `<a href>`, and a keyboard-only walk of the
  whole deck.

Two bugs were found and fixed during that pass:

1. **Slide 09 ignored an empty Send.** `sent` was a plain string, so `""` was
   indistinguishable from "nothing sent yet" and the button appeared dead. See
   §8.7.
2. **Eleven of sixteen slides needed internal scroll at 1280×720**, the worst
   by 288px, with controls below the fold on three of them. Fixed by
   restructuring `install` and `summary` and trimming the rest; `verify:fit`
   now guards against the regression.

## 11. Known open items

1. **Not pushed to GitHub** — see §2. Blocked on the owner granting the Claude
   GitHub App access to this repo. This is the only blocking item.
2. **Not deployed anywhere.** `dist/` is a static bundle with a relative base,
   so Vercel / GitHub Pages / Netlify all work with no configuration. The
   vibe-coding-workshop repo has a GitHub Pages workflow worth copying.
3. **No presenter script in the repo yet.** The `workshop` skill has a method
   and a template (`references/presenter-script.md`,
   `assets/script/template.html`) — Say / Do / Bridge per slide.
4. **`npm install` may report advisories** inherited from the shell's
   dependency set. Not triaged.
