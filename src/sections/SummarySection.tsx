import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  CheckCheck,
  Copy,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { STARTER_PROMPT, SUMMARY, SUMMARY_CONCEPTS } from "@/data/lesson";
import { SLIDE_INDEX } from "@/data/slides";
import { useDeck } from "@/hooks/useDeckContext";

/** Where "Open Claude Code" sends the room. */
const CLAUDE_CODE_URL = "https://claude.com/claude-code";

/** Slide 16 — what the room learned, and the one thing to do tonight. */
export function SummarySection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const { goTo, quizResult } = useDeck();

  async function copyStarterPrompt() {
    try {
      await navigator.clipboard.writeText(STARTER_PROMPT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked (insecure origin, denied permission).
      // The prompt is on screen and selectable, so this is not worth an alert.
      setCopied(false);
    }
  }

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={SUMMARY.eyebrow}
      title={SUMMARY.title}
      lead={SUMMARY.lead}
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
      <div className="min-w-0">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SUMMARY_CONCEPTS.map((concept, conceptIndex) => (
          <motion.li
            key={concept.id}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.45,
              delay: reduceMotion ? 0 : conceptIndex * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={reduceMotion ? undefined : { y: -4 }}
            className="glass glass-hover rounded-2xl p-2.5"
          >
            <button
              type="button"
              onClick={() => goTo(concept.slideIndex)}
              className="w-full cursor-pointer text-start"
            >
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ok/45 bg-ok/12 text-ok-bright"
                >
                  <Check className="h-3.5 w-3.5" />
                </span>

                <span className="font-mono text-[clamp(0.8rem,1vw,1.05rem)] text-chalk">
                  {concept.label}
                </span>
              </span>

              <span className="mt-1.5 block text-[clamp(0.75rem,0.88vw,0.95rem)] leading-snug text-mist">
                {concept.recap}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <Reveal delay={0.2}>
        <div className="mt-3 grid items-center gap-3 rounded-2xl border border-line bg-navy-900/45 p-3 lg:grid-cols-[1fr_auto] lg:gap-6">
          <div>
            <p className="text-[clamp(0.95rem,1.45vw,1.45rem)] leading-tight font-medium tracking-tight text-chalk">
              {SUMMARY.nextTitle}
            </p>

            <p className="mt-1.5 max-w-2xl text-[clamp(0.82rem,0.98vw,1.02rem)] leading-relaxed text-mist">
              {SUMMARY.nextBody}
            </p>
          </div>

          {quizResult ? (
            <div className="flex items-center gap-4 rounded-2xl border border-accent-warm/35 bg-accent-warm/6 px-5 py-4">
              <Sparkles
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-accent-warm"
              />

              <div>
                <p className="font-mono text-[0.7rem] tracking-[0.24em] text-dim uppercase">
                  Quiz score
                </p>

                <p className="mt-0.5 font-mono text-[clamp(1.3rem,2.1vw,1.9rem)] text-chalk tabular-nums">
                  <span className="text-accent-warm">{quizResult.score}</span>
                  <span className="mx-1 text-dim">/</span>
                  <span className="text-dim">{quizResult.total}</span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[clamp(0.86rem,1.02vw,1.05rem)] text-dim">
              Finish the quiz to see your score here.
            </p>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.28}>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <ActionButton
            variant="accent"
            icon={RotateCcw}
            onClick={() => goTo(SLIDE_INDEX["what-is-claude-code"] ?? 1)}
          >
            Run It Again
          </ActionButton>

          <ActionButton
            variant="outline"
            icon={ExternalLink}
            href={CLAUDE_CODE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Claude Code
          </ActionButton>
        </div>
      </Reveal>

      </div>

      <div className="min-w-0">
      <Reveal delay={0.26}>
        <div className="rounded-2xl border border-accent/25 bg-navy-950/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-[clamp(1rem,1.45vw,1.3rem)] font-semibold text-chalk">
                {SUMMARY.promptTitle}
              </p>

              <p className="mt-1 text-sm text-mist">{SUMMARY.promptHelp}</p>
            </div>

            <ActionButton
              icon={copied ? CheckCheck : Copy}
              variant={copied ? "accent" : "outline"}
              onClick={copyStarterPrompt}
            >
              {copied ? "Copied!" : "Copy Prompt"}
            </ActionButton>
          </div>

          <textarea
            value={STARTER_PROMPT}
            readOnly
            aria-label="Starter prompt for your first Claude Code session"
            className="mt-3 min-h-[122px] w-full resize-y rounded-xl border border-line bg-navy-950/80 p-4 font-mono text-[0.82rem] leading-6 text-chalk outline-none"
          />

          <p className="mt-3 font-mono text-[0.78rem] text-dim">
            {SUMMARY.steps.join("   ·   ")}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.34}>
        <p className="mt-3 font-mono text-[0.7rem] tracking-[0.18em] text-dim uppercase">
          {SUMMARY.footer}
        </p>
      </Reveal>
      </div>
      </div>
    </PresentationSection>
  );
}
