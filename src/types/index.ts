import type { LucideIcon } from "lucide-react";

/** One full-screen slide of the deck. */
export interface SlideMeta {
  /** Stable id, also used as the DOM id and hash anchor. */
  id: string;
  /** Short label shown in the overview menu and dot tooltips. */
  label: string;
  /** Line the presenter can read out loud to introduce the slide. */
  cue: string;
}

/**
 * A clickable card that reveals one example when you open it.
 *
 * Used twice: for what Claude Code actually is (slide 2) and for the slash
 * commands worth knowing (slide 13). Same interaction both times, so the room
 * only learns it once.
 */
export interface ExplorerCard {
  id: string;
  title: string;
  icon: LucideIcon;
  /** One short beginner-friendly sentence, revealed on click. */
  example: string;
  /** A tiny, readable line that matches the example. */
  snippet: string;
}

/** One step in an auto-revealed sequence (slides 4 and 14). */
export interface SequenceStep {
  id: string;
  title: string;
  detail: string;
  /** A short literal shown at the bottom of the step card. */
  sample: string;
}

/**
 * One line in a simulated Claude Code session (slides 8 and 11).
 *
 * `kind` decides how the line is drawn, not what it says — a `tool` line gets
 * the tool chip, a `say` line is Claude talking, a `done` line closes the turn.
 */
export interface TerminalLine {
  kind: "you" | "think" | "tool" | "say" | "done";
  text: string;
  /** `tool` lines only: the tool name shown in the chip, e.g. `Read`. */
  tool?: string;
}

/**
 * A question the room can ask on the context slide (slide 5), paired with the
 * files Claude Code would open to answer it.
 */
export interface ContextQuestion {
  id: string;
  question: string;
  /** Paths it reads, in the order it reads them. */
  reads: string[];
  answer: string;
}

/** One task to sort into the right tool on the comparison slide (slide 6). */
export interface SortingItem {
  id: string;
  task: string;
  answer: "chat" | "claude";
  because: string;
}

/** One permission prompt on the control slide (slide 7). */
export interface PermissionRequest {
  id: string;
  tool: string;
  detail: string;
  /** What happens if the room allows it. */
  allowed: string;
  /** What happens if the room refuses. */
  denied: string;
  /** Marks the request a beginner should think twice about. */
  risky?: boolean;
}

/** A multiple-choice quiz question (slide 15). */
export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  /** Index into `options`. */
  answerIndex: number;
  /** Shown after answering, whether right or wrong. */
  because: string;
}

/** One concept chip on the summary slide. */
export interface SummaryConcept {
  id: string;
  label: string;
  /** The slide index the chip jumps back to. */
  slideIndex: number;
  recap: string;
}

/** Token kinds produced by the code highlighter. */
export type TokenKind =
  | "plain"
  | "keyword"
  | "builtin"
  | "string"
  | "number"
  | "comment"
  | "operator"
  | "punctuation"
  | "bracket"
  | "identifier";

export interface Token {
  kind: TokenKind;
  value: string;
}

/** Result of running the quiz, shared with the summary slide. */
export interface QuizResult {
  score: number;
  total: number;
}
