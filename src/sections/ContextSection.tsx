import { useMemo, useState } from "react";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { TerminalSession } from "@/components/TerminalSession";
import { CONTEXT } from "@/data/lesson";
import { cn } from "@/lib/cn";
import { simulateContextTurn } from "@/lib/simulate";

/**
 * Slide 05 — the difference that matters: it opens your files before it
 * answers. The room picks a question and watches the reads happen.
 */
export function ContextSection({ index, registerRef }: SectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playToken, setPlayToken] = useState(0);

  const active =
    CONTEXT.questions.find((question) => question.id === activeId) ?? null;

  const lines = useMemo(
    () => (active ? simulateContextTurn(active) : []),
    [active],
  );

  const ask = (id: string) => {
    setActiveId(id);
    setPlayToken((token) => token + 1);
  };

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={CONTEXT.eyebrow}
      title={CONTEXT.title}
      lead={CONTEXT.lead}
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
        <div className="min-w-0">
          <p className="mb-3 font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
            {CONTEXT.hint}
          </p>

          <ul className="grid gap-2.5">
            {CONTEXT.questions.map((question, questionIndex) => {
              const isActive = question.id === activeId;

              return (
                <Reveal key={question.id} delay={0.18 + questionIndex * 0.06}>
                  <li>
                    <button
                      type="button"
                      onClick={() => ask(question.id)}
                      className={cn(
                        "w-full cursor-pointer rounded-xl border px-4 py-3.5 text-start text-[clamp(0.9rem,1.15vw,1.2rem)] transition-colors duration-200",
                        isActive
                          ? "border-accent-warm/60 bg-accent-warm/10 text-chalk"
                          : "border-line bg-navy-900/60 text-mist hover:border-accent/45 hover:text-chalk",
                      )}
                    >
                      {question.question}
                    </button>
                  </li>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={0.44}>
            <p className="mt-4 rounded-2xl border border-accent-warm/25 bg-accent-warm/6 p-3.5 text-[clamp(0.82rem,0.98vw,1.02rem)] leading-relaxed text-mist">
              {CONTEXT.aside}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.26} className="min-w-0">
          <TerminalSession
            lines={lines}
            playToken={playToken}
            minLines={6}
            placeholder="Pick a question and watch which files it opens."
          />
        </Reveal>
      </div>
    </PresentationSection>
  );
}
