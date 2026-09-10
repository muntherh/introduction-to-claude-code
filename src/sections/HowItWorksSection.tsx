import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { StepSequence } from "@/components/StepSequence";
import { HOW_IT_WORKS } from "@/data/lesson";

/** Slide 04 — the four-beat loop every task follows. */
export function HowItWorksSection({ index, registerRef }: SectionProps) {
  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={HOW_IT_WORKS.eyebrow}
      title={HOW_IT_WORKS.title}
      lead={HOW_IT_WORKS.lead}
      width="wide"
    >
      <StepSequence
        steps={[...HOW_IT_WORKS.steps]}
        completeMessage={HOW_IT_WORKS.complete}
      />
    </PresentationSection>
  );
}
