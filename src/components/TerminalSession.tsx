import { motion, useReducedMotion } from "framer-motion";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { TerminalLine } from "@/types";

/** Milliseconds between revealed lines. A constant, so every run is identical. */
const CADENCE = 420;

/**
 * The window chrome a Claude Code session sits in.
 *
 * Shared with the static terminal on "Where it lives", which is the point:
 * the room sees the same window twice, so by the time it starts moving on the
 * hands-on slides it already looks familiar.
 */
export function TerminalFrame({
  cwd,
  children,
  className,
}: {
  cwd: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-2xl border border-line bg-navy-950/85 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line/80 bg-navy-900/70 px-4 py-2.5 sm:px-5">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-accent-warm/70" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ms-2 truncate font-mono text-[0.72rem] tracking-[0.18em] text-dim uppercase">
          {cwd}
        </span>
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </div>
  );
}

interface TerminalSessionProps {
  lines: TerminalLine[];
  /** Path shown in the window bar. */
  cwd?: string;
  /**
   * Bump this to replay the reveal. Changing `lines` alone does not restart
   * it — a presenter often wants to run the same turn again.
   */
  playToken: number;
  /** Shown before the first run. */
  placeholder?: string;
  /** Minimum body height, so the slide does not jump when the turn lands. */
  minLines?: number;
  className?: string;
}

/**
 * One turn of a Claude Code session, revealed line by line.
 *
 * The reveal is the teaching: most of a real turn is the tool reading files,
 * and watching that happen is what separates this from a chat window. It runs
 * on a fixed cadence rather than a random one, so the demo behaves identically
 * every time it is presented.
 */
export function TerminalSession({
  lines,
  cwd = "~/projects/my-website",
  playToken,
  placeholder = "Send a request to start the session.",
  minLines = 6,
  className,
}: TerminalSessionProps) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (playToken === 0) {
      setRevealed(0);
      return;
    }

    // Someone who asked for reduced motion gets the whole turn at once: the
    // staged reveal is decoration, the content is not.
    if (reduceMotion) {
      setRevealed(lines.length);
      return;
    }

    setRevealed(0);
    const timers = lines.map((_, lineIndex) =>
      window.setTimeout(() => setRevealed(lineIndex + 1), CADENCE * lineIndex),
    );

    return () => timers.forEach(window.clearTimeout);
  }, [playToken, lines, reduceMotion]);

  const visible = lines.slice(0, revealed);
  const running = revealed > 0 && revealed < lines.length;

  return (
    <TerminalFrame cwd={cwd} className={className}>
      <div
        role="log"
        aria-live="polite"
        aria-busy={running}
        className="flex flex-col gap-2"
        style={{ minHeight: `calc(${minLines} * 1.85em)` }}
      >
        {visible.length === 0 ? (
          <p className="font-mono text-[clamp(0.82rem,1.05vw,1.05rem)] text-dim">
            {placeholder}
          </p>
        ) : (
          visible.map((line, lineIndex) => (
            <Line
              key={`${playToken}-${lineIndex}`}
              line={line}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))
        )}
      </div>
    </TerminalFrame>
  );
}

function Line({
  line,
  reduceMotion,
}: {
  line: TerminalLine;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-w-0 items-start gap-2.5 font-mono text-[clamp(0.82rem,1.05vw,1.08rem)] leading-[1.6]"
    >
      {line.kind === "you" ? (
        <>
          <ChevronRight
            aria-hidden="true"
            className="mt-[0.3em] h-3.5 w-3.5 shrink-0 text-accent-warm"
          />
          <span className="min-w-0 break-words text-chalk">{line.text}</span>
        </>
      ) : null}

      {line.kind === "think" ? (
        <>
          <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-dim" />
          <span className="min-w-0 break-words text-dim">{line.text}</span>
        </>
      ) : null}

      {line.kind === "tool" ? (
        <>
          <span className="mt-[0.1em] shrink-0 rounded-md border border-accent/40 bg-accent/10 px-2 py-[0.1em] text-[0.78em] tracking-wide text-accent">
            {line.tool}
          </span>
          <span className="min-w-0 break-words text-mist">{line.text}</span>
        </>
      ) : null}

      {line.kind === "say" ? (
        <>
          <Sparkles
            aria-hidden="true"
            className="mt-[0.3em] h-3.5 w-3.5 shrink-0 text-accent-warm"
          />
          <span className="min-w-0 break-words text-chalk">{line.text}</span>
        </>
      ) : null}

      {line.kind === "done" ? (
        <>
          <span
            aria-hidden="true"
            className="mt-[0.2em] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ok/20 text-ok"
          >
            <Check className="h-2.5 w-2.5" />
          </span>
          <span className="min-w-0 break-words text-ok-bright">{line.text}</span>
        </>
      ) : null}
    </motion.div>
  );
}
