import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { TerminalFrame } from "@/components/TerminalSession";
import { WHERE_IT_LIVES } from "@/data/lesson";

/**
 * Slide 03 — the interface, sitting still.
 *
 * Deliberately the only static slide in the deck: the room needs one calm
 * look at the window before anything starts moving inside it. It uses the
 * same TerminalFrame the live sessions use, so the chrome is already familiar
 * by slide 05.
 */
export function WhereItLivesSection({ index, registerRef }: SectionProps) {
  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={WHERE_IT_LIVES.eyebrow}
      title={WHERE_IT_LIVES.title}
      lead={WHERE_IT_LIVES.lead}
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <Reveal delay={0.2}>
          <TerminalFrame cwd="~/projects/my-website">
            <pre className="overflow-x-auto font-mono text-[clamp(0.82rem,1.1vw,1.12rem)] leading-[1.6] text-mist">
              {WHERE_IT_LIVES.banner}
            </pre>
            <p className="mt-1 flex items-center gap-2.5 font-mono text-[clamp(0.82rem,1.1vw,1.12rem)] text-chalk">
              <span aria-hidden="true" className="text-accent-warm">
                &gt;
              </span>
              <span
                aria-hidden="true"
                className="inline-block h-[1.15em] w-[0.55em] animate-pulse bg-accent-warm/70"
              />
              <span className="sr-only">Waiting for you to type</span>
            </p>
          </TerminalFrame>
        </Reveal>

        <div className="grid min-w-0 gap-2.5">
          {WHERE_IT_LIVES.points.map((point, pointIndex) => (
            <Reveal key={point.id} delay={0.26 + pointIndex * 0.07}>
              <div className="glass flex items-start gap-3.5 rounded-2xl p-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/35 bg-accent/10 text-accent"
                >
                  <point.icon className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <p className="text-[clamp(0.95rem,1.2vw,1.22rem)] font-semibold tracking-tight text-chalk">
                    {point.title}
                  </p>
                  <p className="mt-1 text-[clamp(0.82rem,0.98vw,1.02rem)] leading-relaxed text-mist">
                    {point.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.5}>
            <p className="rounded-2xl border border-accent-warm/25 bg-accent-warm/6 p-3.5 text-[clamp(0.82rem,0.98vw,1.02rem)] leading-relaxed text-mist">
              {WHERE_IT_LIVES.aside}
            </p>
          </Reveal>
        </div>
      </div>
    </PresentationSection>
  );
}
