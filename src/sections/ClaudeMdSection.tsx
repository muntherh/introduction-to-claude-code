import { motion, useReducedMotion } from "framer-motion";
import { Lock, RotateCcw } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import { CodeBlock } from "@/components/CodeBlock";
import { OutputPanel } from "@/components/OutputPanel";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { PROJECT_RULES } from "@/data/lesson";
import { cn } from "@/lib/cn";
import { formatProjectRules } from "@/lib/simulate";

/** Slide 12 — CLAUDE.md: the rules that survive between sessions. */
export function ClaudeMdSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [attempts, setAttempts] = useState(0);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attemptBreak = useCallback((ruleIndex: number) => {
    setAttempts((count) => count + 1);
    setShakeIndex(ruleIndex);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShakeIndex(null), 420);
  }, []);

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={PROJECT_RULES.eyebrow}
      title={PROJECT_RULES.title}
      lead={PROJECT_RULES.lead}
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="min-w-0">
          <p className="mb-3 font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
            {PROJECT_RULES.hint}
          </p>

          <ul className="flex flex-wrap gap-2.5 sm:gap-3">
            {PROJECT_RULES.rules.map((rule, ruleIndex) => {
              const isShaking = shakeIndex === ruleIndex;

              return (
                <li key={rule}>
                  <motion.button
                    type="button"
                    onClick={() => attemptBreak(ruleIndex)}
                    aria-label={`Try to break the rule: ${rule}`}
                    animate={
                      isShaking && !reduceMotion
                        ? { x: [0, -7, 6, -4, 0] }
                        : { x: 0 }
                    }
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors duration-200",
                      isShaking
                        ? "border-bad/60 bg-bad/10"
                        : "border-line bg-navy-900/60 hover:border-accent-warm/45",
                    )}
                  >
                    <span className="font-mono text-[clamp(0.85rem,1.08vw,1.18rem)] text-chalk">
                      {rule}
                    </span>
                    <Lock
                      aria-hidden="true"
                      className={cn(
                        "h-3.5 w-3.5 transition-colors duration-200",
                        isShaking ? "text-bad" : "text-accent-warm/70",
                      )}
                    />
                  </motion.button>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ActionButton
              icon={RotateCcw}
              variant="ghost"
              onClick={() => {
                setAttempts(0);
                setShakeIndex(null);
              }}
              disabled={attempts === 0}
            >
              Clear
            </ActionButton>
            <p className="text-[clamp(0.85rem,1vw,1.05rem)] text-dim" aria-live="polite">
              {attempts === 0
                ? PROJECT_RULES.clear
                : `Blocked ${attempts} ${attempts === 1 ? "time" : "times"}. The rules hold.`}
            </p>
          </div>

          <Reveal delay={0.3}>
            <p className="mt-4 rounded-2xl border border-accent-warm/25 bg-accent-warm/6 p-4 text-[clamp(0.85rem,1vw,1.05rem)] leading-relaxed text-mist">
              {PROJECT_RULES.aside}
            </p>
          </Reveal>
        </div>

        <div className="grid min-w-0 gap-4">
          <Reveal delay={0.24}>
            <CodeBlock
              code={formatProjectRules(PROJECT_RULES.rules)}
              variant="prompt"
              fileName="CLAUDE.md"
              size="sm"
            />
          </Reveal>

          <Reveal delay={0.32}>
            <OutputPanel
              lines={
                attempts > 0
                  ? [PROJECT_RULES.refusal, PROJECT_RULES.reason]
                  : [
                      `Loaded CLAUDE.md — ${PROJECT_RULES.rules.length} project rules in effect.`,
                    ]
              }
              tone={attempts > 0 ? "error" : "normal"}
              title={attempts > 0 ? "Blocked" : "Claude Code"}
              minLines={2}
              placeholder=""
              size="sm"
            />
          </Reveal>
        </div>
      </div>
    </PresentationSection>
  );
}
