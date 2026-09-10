import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { TOKEN_CLASS, tokenizeCode } from "@/lib/codeHighlight";
import type { Token } from "@/types";

/** Which characters get the teaching highlight ring. */
export type Emphasis = "none" | "brackets" | "parentheses" | "quotes";

/**
 * `code` runs the tokenizer and colours the snippet.
 * `prompt` renders plain sentences — a prompt is written in English, and
 * syntax-colouring English makes it look like something it is not.
 */
export type CodeBlockVariant = "code" | "prompt";

interface CodeBlockProps {
  code: string;
  /** File chip shown in the window bar, e.g. `terminal`. */
  fileName?: string;
  emphasis?: Emphasis;
  variant?: CodeBlockVariant;
  /**
   * Prompt variant only: rings this exact substring wherever it appears, so
   * the presenter can point at the part the learner just typed.
   */
  highlight?: string;
  size?: "sm" | "md" | "lg";
  showLineNumbers?: boolean;
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<CodeBlockProps["size"]>, string> = {
  sm: "text-[clamp(0.85rem,1.05vw,1.18rem)]",
  md: "text-[clamp(0.95rem,1.35vw,1.55rem)]",
  lg: "text-[clamp(1.05rem,1.95vw,2.2rem)]",
};

const HIGHLIGHT =
  "rounded-[3px] bg-accent-warm/18 px-[0.12em] text-accent-warm ring-1 ring-accent-warm/45";

const OPEN_BRACKETS: Record<Emphasis, string[]> = {
  none: [],
  brackets: ["[", "]"],
  parentheses: ["(", ")"],
  quotes: [],
};

/** Split a string token so only its surrounding quotes get emphasised. */
function renderQuotedToken(token: Token, key: string) {
  const { value } = token;
  const quote = value[0];
  if (!quote || (quote !== '"' && quote !== "'")) {
    return (
      <span key={key} className={TOKEN_CLASS.string}>
        {value}
      </span>
    );
  }
  const closed = value.length > 1 && value[value.length - 1] === quote;
  const inner = closed ? value.slice(1, -1) : value.slice(1);

  return (
    <Fragment key={key}>
      <span className={HIGHLIGHT}>{quote}</span>
      <span className={TOKEN_CLASS.string}>{inner}</span>
      {closed ? <span className={HIGHLIGHT}>{quote}</span> : null}
    </Fragment>
  );
}

/** One prompt line, with every occurrence of `highlight` ringed. */
function renderPromptLine(line: string, highlight: string | undefined) {
  if (line === "") return " ";
  if (!highlight) return line;

  const parts = line.split(highlight);
  if (parts.length === 1) return line;

  return parts.flatMap((part, partIndex) =>
    partIndex === 0
      ? [part]
      : [
          <span key={`h-${partIndex}`} className={HIGHLIGHT}>
            {highlight}
          </span>,
          part,
        ],
  );
}

/**
 * Read-only snippet panel with hand-rolled highlighting.
 *
 * `emphasis` is the teaching hook for code: it rings the brackets or the
 * quotation marks so the presenter can point at them from across the room.
 * `variant="prompt"` turns all of that off and shows plain sentences, which
 * is what most of this deck is made of.
 */
export function CodeBlock({
  code,
  fileName,
  emphasis = "none",
  variant = "code",
  highlight,
  size = "md",
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const isPrompt = variant === "prompt";
  const lines = isPrompt ? [] : tokenizeCode(code);
  const promptLines = isPrompt ? code.split("\n") : [];
  const emphasised = OPEN_BRACKETS[emphasis];

  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-2xl border border-line bg-navy-950/85 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line/80 bg-navy-900/70 px-4 py-2.5 sm:px-5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-warm/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ms-2 font-mono text-xs tracking-[0.18em] text-dim uppercase sm:text-[0.72rem]">
          {fileName ?? (isPrompt ? "prompt" : "terminal")}
        </span>
      </div>

      <pre
        className={cn(
          "overflow-x-auto px-4 py-5 font-mono leading-[1.75] sm:px-6 sm:py-6",
          SIZE_CLASS[size],
        )}
      >
        <code className="block min-w-max">
          {isPrompt
            ? promptLines.map((line, lineIndex) => (
                <span key={lineIndex} className="block text-chalk">
                  {renderPromptLine(line, highlight)}
                </span>
              ))
            : lines.map((tokens, lineIndex) => {
                const lineNumber = lineIndex + 1;

                return (
                  <span key={lineNumber} className="block">
                    {showLineNumbers ? (
                      <span className="me-4 inline-block w-5 shrink-0 text-end text-dim select-none">
                        {lineNumber}
                      </span>
                    ) : null}
                    {tokens.length === 0 ? " " : null}
                    {tokens.map((token, tokenIndex) => {
                      const key = `${lineNumber}-${tokenIndex}`;

                      if (emphasis === "quotes" && token.kind === "string") {
                        return renderQuotedToken(token, key);
                      }

                      if (
                        token.kind === "bracket" &&
                        emphasised.includes(token.value)
                      ) {
                        return (
                          <span key={key} className={HIGHLIGHT}>
                            {token.value}
                          </span>
                        );
                      }

                      return (
                        <span key={key} className={TOKEN_CLASS[token.kind]}>
                          {token.value}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
        </code>
      </pre>
    </div>
  );
}
