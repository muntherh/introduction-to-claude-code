import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, MessageSquare, RotateCcw, Terminal, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { CHAT_VS } from "@/data/lesson";
import { cn } from "@/lib/cn";

type Kind = "chat" | "claude";

const LABEL: Record<Kind, string> = {
  chat: "a chat window",
  claude: "Claude Code",
};

const ITEMS = CHAT_VS.items;

/** Slide 06 — the two side by side, then a quick sorting drill. */
export function ChatVsClaudeCodeSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [answers, setAnswers] = useState<Record<string, Kind>>({});

  const current = ITEMS.find((item) => !(item.id in answers)) ?? null;
  const correctCount = ITEMS.filter(
    (item) => answers[item.id] === item.answer,
  ).length;
  const answeredCount = Object.keys(answers).length;
  const lastAnswered = answeredCount > 0 ? ITEMS[answeredCount - 1] : null;
  const lastWasCorrect =
    lastAnswered !== null && answers[lastAnswered.id] === lastAnswered.answer;

  const choose = (kind: Kind) => {
    if (!current) return;
    setAnswers((existing) => ({ ...existing, [current.id]: kind }));
  };

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={CHAT_VS.eyebrow}
      title={CHAT_VS.title}
      lead={CHAT_VS.lead}
      width="wide"
    >
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <Reveal delay={0.2}>
          <ComparisonCard kind="chat" icon={MessageSquare} {...CHAT_VS.chat} />
        </Reveal>
        <Reveal delay={0.26}>
          <ComparisonCard kind="claude" icon={Terminal} {...CHAT_VS.claude} />
        </Reveal>
      </div>

      <Reveal delay={0.32}>
        <div className="glass mt-[clamp(0.85rem,2.2vh,1.6rem)] rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
              {CHAT_VS.drillHint}
            </p>
            <p
              className="font-mono text-[0.85rem] text-mist tabular-nums"
              aria-live="polite"
            >
              <span className="text-accent-warm">{correctCount}</span>
              <span className="mx-1 text-dim">/</span>
              <span className="text-dim">{ITEMS.length}</span>
            </p>
          </div>

          <div className="mt-4 grid items-center gap-4 md:grid-cols-[1fr_auto] md:gap-8">
            <div className="min-h-[2.8rem]">
              <AnimatePresence mode="wait">
                {current ? (
                  <motion.p
                    key={current.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="block text-[clamp(1rem,1.55vw,1.6rem)] leading-snug text-chalk"
                  >
                    {current.task}
                  </motion.p>
                ) : (
                  <motion.p
                    key="done"
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[clamp(1rem,1.6vw,1.65rem)] font-medium text-chalk"
                  >
                    {correctCount === ITEMS.length ? CHAT_VS.done : CHAT_VS.almost}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {current ? (
                <>
                  <ActionButton
                    variant="outline"
                    icon={MessageSquare}
                    onClick={() => choose("chat")}
                  >
                    Chat window
                  </ActionButton>
                  <ActionButton
                    variant="outline"
                    icon={Terminal}
                    onClick={() => choose("claude")}
                  >
                    Claude Code
                  </ActionButton>
                </>
              ) : (
                <ActionButton
                  variant="accent"
                  icon={RotateCcw}
                  onClick={() => setAnswers({})}
                >
                  Try Again
                </ActionButton>
              )}
            </div>
          </div>

          <div className="mt-3 min-h-[2.8rem]">
            <AnimatePresence mode="wait">
              {lastAnswered ? (
                <motion.div
                  key={`${lastAnswered.id}-${lastWasCorrect}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  role="status"
                  className="flex items-start gap-2.5"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-[0.15em] flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                      lastWasCorrect ? "bg-ok/25 text-ok-bright" : "bg-warn/20 text-warn",
                    )}
                  >
                    {lastWasCorrect ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </span>

                  <p
                    className={cn(
                      "text-[clamp(0.88rem,1.08vw,1.12rem)] leading-relaxed",
                      lastWasCorrect ? "text-ok-bright" : "text-warn",
                    )}
                  >
                    <span className="font-medium">
                      {lastWasCorrect
                        ? "Correct — "
                        : `That one suits ${LABEL[lastAnswered.answer]}. `}
                    </span>
                    {lastAnswered.because}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </PresentationSection>
  );
}

function ComparisonCard({
  kind,
  title,
  glyph,
  where,
  strength,
  icon: Icon,
  example,
}: {
  kind: Kind;
  title: string;
  glyph: string;
  where: string;
  strength: string;
  icon: LucideIcon;
  example: string;
}) {
  const isChat = kind === "chat";

  return (
    <div
      className={cn(
        "glass flex h-full flex-col gap-3 rounded-2xl p-4 sm:p-5",
        isChat ? "border-accent/30" : "border-accent-warm/35",
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[clamp(1.05rem,1.8vw,1.8rem)] font-semibold tracking-tight text-chalk">
          {title}
        </h3>
        <span
          aria-hidden="true"
          className={cn(
            "font-mono text-[clamp(1.1rem,1.95vw,1.95rem)] leading-none",
            isChat ? "text-accent" : "text-accent-warm",
          )}
        >
          {glyph}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        <li className="flex items-start gap-2.5 text-[clamp(0.84rem,1vw,1.06rem)] text-mist">
          <span
            aria-hidden="true"
            className={cn(
              "mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full",
              isChat ? "bg-accent" : "bg-accent-warm",
            )}
          />
          {where}
        </li>
        <li className="flex items-start gap-2.5 text-[clamp(0.84rem,1vw,1.06rem)] text-chalk">
          <Icon
            aria-hidden="true"
            className={cn(
              "mt-[0.2em] h-4 w-4 shrink-0",
              isChat ? "text-accent" : "text-accent-warm",
            )}
          />
          {strength}
        </li>
      </ul>

      <code className="mt-auto block overflow-x-auto rounded-xl border border-line bg-navy-950/75 px-3.5 py-2.5 font-mono text-[clamp(0.76rem,0.94vw,1rem)] whitespace-nowrap text-chalk">
        {example}
      </code>
    </div>
  );
}
