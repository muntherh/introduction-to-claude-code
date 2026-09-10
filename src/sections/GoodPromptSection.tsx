import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Lightbulb, RotateCcw, Scale } from "lucide-react";
import { useCallback, useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { OutputPanel } from "@/components/OutputPanel";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { RunButton } from "@/components/RunButton";
import { TerminalFrame } from "@/components/TerminalSession";
import { GOOD_PROMPT } from "@/data/lesson";
import { cn } from "@/lib/cn";

type Panel = "hint" | "explain" | "compare";

const { comparison } = GOOD_PROMPT;
const BEST = comparison.options[comparison.bestIndex]!;

/**
 * Slide 10 — the request, taken apart line by line.
 *
 * The right-hand side has three states rather than three stacked blocks: at
 * 1280×720 there is only room for one at a time, and a slide that scrolls on
 * the presenter's own laptop is a broken slide.
 */
export function GoodPromptSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [panel, setPanel] = useState<Panel>("hint");
  const [output, setOutput] = useState<string[]>([]);
  const [activePart, setActivePart] = useState<string | null>(null);
  const [pick, setPick] = useState<string | null>(null);

  const explaining = panel === "explain";

  const toggle = useCallback((next: Panel) => {
    setActivePart(null);
    setPanel((current) => (current === next ? "hint" : next));
  }, []);

  const reset = useCallback(() => {
    setPanel("hint");
    setOutput([]);
    setActivePart(null);
    setPick(null);
  }, []);

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={GOOD_PROMPT.eyebrow}
      title={GOOD_PROMPT.title}
      lead={GOOD_PROMPT.lead}
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="min-w-0">
          <Reveal delay={0.2}>
            <TerminalFrame cwd="you type">
              {GOOD_PROMPT.lines.map((line) => {
                const isActive = explaining && activePart === line.id;

                return (
                  <p
                    key={line.id}
                    onMouseEnter={() => explaining && setActivePart(line.id)}
                    onMouseLeave={() => explaining && setActivePart(null)}
                    className={cn(
                      "rounded-[6px] px-2 py-0.5 font-mono text-[clamp(0.85rem,1.18vw,1.22rem)] leading-[1.55] transition-all duration-300",
                      explaining && "cursor-pointer",
                      isActive
                        ? "bg-accent-warm/18 text-accent-warm ring-1 ring-accent-warm/55"
                        : "text-chalk",
                      explaining && !isActive && "opacity-55",
                    )}
                  >
                    {line.text}
                  </p>
                );
              })}
            </TerminalFrame>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <RunButton
                onRun={() => setOutput([...GOOD_PROMPT.result])}
                label="Send It"
                runningLabel="Thinking"
              />
              <ActionButton
                icon={Lightbulb}
                onClick={() => toggle("explain")}
                active={explaining}
                aria-pressed={explaining}
              >
                {explaining ? "Hide Breakdown" : "Explain It"}
              </ActionButton>
              <ActionButton
                icon={Scale}
                onClick={() => toggle("compare")}
                active={panel === "compare"}
                aria-pressed={panel === "compare"}
              >
                Compare Three
              </ActionButton>
              <ActionButton icon={RotateCcw} variant="ghost" onClick={reset}>
                Reset
              </ActionButton>
            </div>
          </Reveal>

          <Reveal delay={0.34} className="mt-4">
            <OutputPanel
              lines={output}
              title="Claude Code"
              size="sm"
              minLines={2}
              placeholder="Press Send It to see what comes back."
            />
          </Reveal>
        </div>

        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {panel === "explain" ? (
              <motion.div
                key="explain"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="mb-3 font-mono text-[0.72rem] tracking-[0.24em] text-accent-warm uppercase">
                  Four parts
                </p>
                <ExplanationPanel
                  items={GOOD_PROMPT.parts}
                  activeId={activePart}
                  onHover={setActivePart}
                  onSelect={(id) =>
                    setActivePart((current) => (current === id ? null : id))
                  }
                  visible
                />
              </motion.div>
            ) : null}

            {panel === "compare" ? (
              <motion.div
                key="compare"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-accent/25 bg-navy-900/55 p-4 sm:p-5"
              >
                <p className="font-display text-[clamp(1rem,1.5vw,1.35rem)] font-semibold text-chalk">
                  {comparison.question}
                </p>
                <p className="mt-1 text-sm text-dim">{comparison.note}</p>

                <div className="mt-4 grid gap-2.5">
                  {comparison.options.map((option) => {
                    const selected = pick === option;
                    const correct = option === BEST;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setPick(option)}
                        className={cn(
                          "cursor-pointer rounded-xl border px-4 py-3 text-start font-mono text-[clamp(0.82rem,0.98vw,1.02rem)] leading-relaxed transition-all duration-200",
                          selected && correct
                            ? "border-ok/70 bg-ok/12 text-ok-bright"
                            : selected
                              ? "border-bad/60 bg-bad/12 text-bad"
                              : "border-line bg-navy-950/60 text-chalk hover:border-accent/50",
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}

                  {pick ? (
                    <p
                      role="status"
                      className={cn(
                        "rounded-xl border px-4 py-3 text-sm leading-relaxed",
                        pick === BEST
                          ? "border-ok/35 bg-ok/10 text-ok-bright"
                          : "border-bad/35 bg-bad/10 text-bad",
                      )}
                    >
                      {pick === BEST ? comparison.right : comparison.wrong}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ) : null}

            {panel === "hint" ? (
              <motion.div
                key="hint"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="glass rounded-2xl p-4 sm:p-5"
              >
                <p className="text-[clamp(0.96rem,1.22vw,1.28rem)] leading-relaxed text-mist">
                  Four short lines, and it no longer has to guess what you meant.
                </p>
                <p className="mt-4 text-[clamp(0.9rem,1.08vw,1.12rem)] leading-relaxed text-dim">
                  Press <span className="text-accent-warm">Explain It</span> to
                  take the request apart, line by line.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </PresentationSection>
  );
}
