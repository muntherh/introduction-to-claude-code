import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { StepSequence } from "@/components/StepSequence";
import { SHIP_IT } from "@/data/lesson";

/**
 * Slide 14 — the same step sequence as slide 04, closing the loop it opened.
 *
 * Slide 04 was the loop inside one task; this is the loop that ends with the
 * work leaving your machine. Same rhythm, so the presenter can move fast.
 */
export function ShipItSection({ index, registerRef }: SectionProps) {
  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={SHIP_IT.eyebrow}
      title={SHIP_IT.title}
      lead={SHIP_IT.lead}
      width="wide"
    >
      <StepSequence
        steps={[...SHIP_IT.steps]}
        completeMessage={SHIP_IT.complete}
      />

      <Reveal delay={0.4}>
        <p className="mt-[clamp(0.7rem,1.8vh,1.2rem)] rounded-2xl border border-accent-warm/25 bg-accent-warm/6 p-3.5 text-[clamp(0.82rem,0.98vw,1.02rem)] leading-relaxed text-mist">
          {SHIP_IT.aside}
        </p>
      </Reveal>
    </PresentationSection>
  );
}
