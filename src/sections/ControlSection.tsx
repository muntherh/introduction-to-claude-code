import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Check, RotateCcw, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { TerminalFrame } from "@/components/TerminalSession";
import { CONTROL } from "@/data/lesson";
import { cn } from "@/lib/cn";

type Answer = "allowed" | "denied";

const REQUESTS = CONTROL.requests;

/**
 * Slide 07 — the permission prompt, made real.
 *
 * The room denies one on purpose and watches nothing happen. For a beginner
 * that is the whole reassurance: the tool cannot change anything they did not
 * agree to, and refusing is a normal move rather than an error.
 */
export function ControlSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const current = REQUESTS.find((request) => !(request.id in answers)) ?? null;
  const answeredCount = Object.keys(answers).length;
  const lastAnswered = answeredCount > 0 ? REQUESTS[answeredCount - 1] : null;
  const lastAnswer = lastAnswered ? answers[lastAnswered.id] : null;
  const deniedCount = Object.values(answers).filter(
    (answer) => answer === "denied",
  ).length;

  const decide = (answer: Answer) => {
    if (!current) return;
    setAnswers((existing) => ({ ...existing, [current.id]: answer }));
  };

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={CONTROL.eyebrow}
      title={CONTROL.title}
      lead={CONTROL.lead}
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="min-w-0">
          <p className="mb-3 font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
            {CONTROL.hint}
          </p>

          <Reveal delay={0.2}>
            <TerminalFrame cwd="~/projects/my-website">
              <div className="min-h-[6.5rem]">
                <AnimatePresence mode="wait">
                  {current ? (
                    <motion.div
                      key={current.id}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="flex flex-wrap items-center gap-2.5">
                        <span className="rounded-md border border-accent/40 bg-accent/10 px-2 py-[0.1em] font-mono text-[0.8em] tracking-wide text-accent">
                          {current.tool}
                        </span>
                        <span className="min-w-0 font-mono text-[clamp(0.85rem,1.1vw,1.15rem)] break-words text-chalk">
                          {current.detail}
                        </span>
                      </p>

                      <p className="mt-4 font-mono text-[clamp(0.85rem,1.1vw,1.15rem)] text-mist">
                        Do you want to allow this?
                        {current.risky ? (
                          <span className="ms-2 inline-flex items-center gap-1.5 text-warn">
                            <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
                            think twice
                          </span>
                        ) : null}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="done"
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-mono text-[clamp(0.85rem,1.1vw,1.15rem)] leading-relaxed text-chalk"
                    >
                      {deniedCount === 0
                        ? "You allowed all four. Try it again and refuse one — nothing bad happens."
                        : `You refused ${deniedCount} of ${REQUESTS.length}. Every one of those files is untouched.`}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </TerminalFrame>
          </Reveal>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {current ? (
              <>
                <ActionButton
                  variant="primary"
                  icon={Check}
                  onClick={() => decide("allowed")}
                >
                  Allow
                </ActionButton>
                <ActionButton
                  variant="outline"
                  icon={X}
                  onClick={() => decide("denied")}
                >
                  Refuse
                </ActionButton>
              </>
            ) : (
              <ActionButton
                variant="accent"
                icon={RotateCcw}
                onClick={() => setAnswers({})}
              >
                Run It Again
              </ActionButton>
            )}

            <p className="font-mono text-[0.82rem] text-dim tabular-nums">
              {answeredCount} / {REQUESTS.length}
            </p>
          </div>
        </div>

        <div className="grid min-w-0 gap-4">
          <div className="min-h-[7rem]">
            <AnimatePresence mode="wait">
              {lastAnswered && lastAnswer ? (
                <motion.div
                  key={`${lastAnswered.id}-${lastAnswer}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.26 }}
                  role="status"
                  className={cn(
                    "rounded-2xl border p-4 sm:p-5",
                    lastAnswer === "allowed"
                      ? "border-accent/35 bg-accent/8"
                      : "border-ok/40 bg-ok/8",
                  )}
                >
                  <p className="flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.24em] uppercase">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full",
                        lastAnswer === "allowed"
                          ? "bg-accent/25 text-accent"
                          : "bg-ok/25 text-ok-bright",
                      )}
                    >
                      {lastAnswer === "allowed" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </span>
                    <span
                      className={
                        lastAnswer === "allowed" ? "text-accent" : "text-ok-bright"
                      }
                    >
                      {lastAnswer === "allowed" ? "You allowed it" : "You refused"}
                    </span>
                  </p>

                  <p className="mt-3 text-[clamp(0.9rem,1.12vw,1.18rem)] leading-relaxed text-chalk">
                    {lastAnswer === "allowed"
                      ? lastAnswered.allowed
                      : lastAnswered.denied}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="hint"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass flex items-start gap-4 rounded-2xl p-4 sm:p-5"
                >
                  <ShieldCheck
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent-warm"
                  />
                  <p className="text-[clamp(0.9rem,1.12vw,1.18rem)] leading-relaxed text-mist">
                    Four requests, one at a time. Allow the ones you understand
                    and refuse the ones you do not.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Reveal delay={0.3}>
            <p className="rounded-2xl border border-accent-warm/25 bg-accent-warm/6 p-4 text-[clamp(0.88rem,1.08vw,1.12rem)] leading-relaxed text-mist sm:p-5">
              {CONTROL.aside}
            </p>
          </Reveal>
        </div>
      </div>
    </PresentationSection>
  );
}
