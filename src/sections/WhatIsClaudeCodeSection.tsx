import { CardExplorer } from "@/components/CardExplorer";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { WHAT_IS_CLAUDE_CODE } from "@/data/lesson";

/** Slide 02 — five parallel facts about the tool, opened one at a time. */
export function WhatIsClaudeCodeSection({ index, registerRef }: SectionProps) {
  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={WHAT_IS_CLAUDE_CODE.eyebrow}
      title={WHAT_IS_CLAUDE_CODE.title}
      lead={WHAT_IS_CLAUDE_CODE.lead}
    >
      <CardExplorer
        cards={[...WHAT_IS_CLAUDE_CODE.cards]}
        hint={WHAT_IS_CLAUDE_CODE.hint}
        placeholder={WHAT_IS_CLAUDE_CODE.placeholder}
        snippetFileName="you type"
      />
    </PresentationSection>
  );
}
