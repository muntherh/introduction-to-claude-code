import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/cn";

interface OutputPanelProps {
  /** One entry per printed line. Empty means "not run yet". */
  lines: string[];
  /** Shown before the first run. */
  placeholder?: string;
  title?: string;
  /** Renders the panel in its error state (used by the tuple slide). */
  tone?: "normal" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Minimum body height so the layout does not jump when output appears. */
  minLines?: number;
}

const SIZE_CLASS: Record<NonNullable<OutputPanelProps["size"]>, string> = {
  sm: "text-[clamp(0.85rem,1.05vw,1.18rem)]",
  md: "text-[clamp(0.95rem,1.35vw,1.55rem)]",
  lg: "text-[clamp(1.05rem,1.95vw,2.2rem)]",
};

/** The terminal-style result panel that pairs with every code example. */
export function OutputPanel({
  lines,
  placeholder = "Press Run Code to see the output.",
  title = "Output",
  tone = "normal",
  size = "md",
  className,
  minLines = 2,
}: OutputPanelProps) {
  const reduceMotion = useReducedMotion();
  const hasOutput = lines.length > 0;

  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-2xl border bg-navy-950/70",
        tone === "error"
          ? "border-bad/45 shadow-[0_0_60px_-30px_rgba(248,113,113,0.75)]"
          : "border-line",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2.5 border-b px-4 py-2.5 sm:px-5",
          tone === "error"
            ? "border-bad/35 bg-bad/10"
            : "border-line/80 bg-navy-900/70",
        )}
      >
        <Terminal
          aria-hidden="true"
          className={cn(
            "h-4 w-4",
            tone === "error" ? "text-bad" : "text-accent",
          )}
        />
        <span
          className={cn(
            "font-mono text-xs tracking-[0.18em] uppercase sm:text-[0.72rem]",
            tone === "error" ? "text-bad" : "text-dim",
          )}
        >
          {title}
        </span>
      </div>

      <div
        className={cn(
          "px-4 py-5 font-mono leading-[1.75] sm:px-6 sm:py-6",
          SIZE_CLASS[size],
        )}
        style={{ minHeight: `calc(${minLines} * 1.75em + 2.5rem)` }}
        aria-live="polite"
        aria-atomic="true"
      >
        {!hasOutput ? (
          <p className="text-dim italic">{placeholder}</p>
        ) : (
          <AnimatePresence initial={false} mode="sync">
            {lines.map((line, lineIndex) => (
              <motion.p
                key={`${lineIndex}-${line}`}
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.32,
                  delay: reduceMotion ? 0 : lineIndex * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "flex gap-3 break-words whitespace-pre-wrap",
                  tone === "error" ? "text-bad" : "text-chalk",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 select-none",
                    tone === "error" ? "text-bad/60" : "text-accent/60",
                  )}
                >
                  &gt;
                </span>
                <span>{line}</span>
              </motion.p>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
