import type { Token, TokenKind } from "@/types";

/**
 * A deliberately small code tokenizer.
 *
 * It only has to colour the handful of terminal commands and snippets in this
 * deck, so it stays a plain string scanner: no dependency, no regex
 * backtracking traps, and — most importantly — no `eval` anywhere near
 * learner input. Prompts are not tokenized at all; they render as plain text
 * through CodeBlock's `prompt` variant.
 */

const KEYWORDS = new Set([
  "async",
  "await",
  "cd",
  "class",
  "const",
  "def",
  "else",
  "export",
  "false",
  "for",
  "from",
  "function",
  "git",
  "if",
  "import",
  "let",
  "new",
  "npm",
  "npx",
  "return",
  "true",
  "var",
  "while",
]);

const BUILTINS = new Set([
  "add",
  "build",
  "claude",
  "commit",
  "console",
  "dev",
  "install",
  "log",
  "print",
  "push",
  "run",
  "test",
]);

const BRACKETS = new Set(["(", ")", "[", "]", "{", "}"]);
const PUNCTUATION = new Set([",", ":", ".", ";"]);
const OPERATOR_CHARS = new Set(["=", "+", "-", "*", "/", "<", ">", "%", "!"]);

const isDigit = (c: string) => c >= "0" && c <= "9";
const isIdentStart = (c: string) =>
  (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
const isIdentPart = (c: string) => isIdentStart(c) || isDigit(c);

function push(tokens: Token[], kind: TokenKind, value: string) {
  if (!value) return;
  const last = tokens[tokens.length - 1];
  // Merge runs of the same kind so the DOM stays small. Brackets stay
  // separate because the deck highlights them one character at a time.
  if (last && last.kind === kind && kind !== "bracket") {
    last.value += value;
    return;
  }
  tokens.push({ kind, value });
}

/** Tokenize a single line of code. */
export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    const char = line[i]!;

    // Comment: runs to end of line.
    if (char === "#") {
      push(tokens, "comment", line.slice(i));
      break;
    }

    // String literal. Unterminated strings are still coloured as strings,
    // which is what a learner mid-typing expects to see.
    if (char === '"' || char === "'") {
      const quote = char;
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === "\\") j += 1;
        j += 1;
      }
      const end = Math.min(j + 1, line.length);
      push(tokens, "string", line.slice(i, end));
      i = end;
      continue;
    }

    // Number (integer or float).
    if (isDigit(char)) {
      let j = i;
      while (j < line.length && (isDigit(line[j]!) || line[j] === "_")) j += 1;
      if (line[j] === "." && isDigit(line[j + 1] ?? "")) {
        j += 1;
        while (j < line.length && isDigit(line[j]!)) j += 1;
      }
      push(tokens, "number", line.slice(i, j));
      i = j;
      continue;
    }

    // Identifier / keyword / builtin.
    if (isIdentStart(char)) {
      let j = i;
      while (j < line.length && isIdentPart(line[j]!)) j += 1;
      const word = line.slice(i, j);
      const kind: TokenKind = KEYWORDS.has(word)
        ? "keyword"
        : BUILTINS.has(word)
          ? "builtin"
          : "identifier";
      push(tokens, kind, word);
      i = j;
      continue;
    }

    if (BRACKETS.has(char)) {
      push(tokens, "bracket", char);
      i += 1;
      continue;
    }

    if (PUNCTUATION.has(char)) {
      push(tokens, "punctuation", char);
      i += 1;
      continue;
    }

    if (OPERATOR_CHARS.has(char)) {
      let j = i;
      while (j < line.length && OPERATOR_CHARS.has(line[j]!)) j += 1;
      push(tokens, "operator", line.slice(i, j));
      i = j;
      continue;
    }

    push(tokens, "plain", char);
    i += 1;
  }

  return tokens;
}

/** Tokenize a whole snippet, one token array per line. */
export function tokenizeCode(code: string): Token[][] {
  return code.replace(/\t/g, "    ").split("\n").map(tokenizeLine);
}

/** Tailwind text colour for each token kind. */
export const TOKEN_CLASS: Record<TokenKind, string> = {
  plain: "text-chalk",
  keyword: "text-accent-warm font-medium",
  builtin: "text-accent-bright",
  string: "text-[#7fdcc0]",
  number: "text-[#ffc46b]",
  comment: "text-dim italic",
  operator: "text-mist",
  punctuation: "text-mist",
  bracket: "text-accent-warm",
  identifier: "text-chalk",
};
