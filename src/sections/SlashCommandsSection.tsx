import { CardExplorer } from "@/components/CardExplorer";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { SLASH_COMMANDS } from "@/data/lesson";

/**
 * Slide 13 — the same card explorer as slide 02.
 *
 * Reusing the interaction is deliberate: the room learned it eleven slides
 * ago, so all of its attention here goes to the commands themselves.
 */
export function SlashCommandsSection({ index, registerRef }: SectionProps) {
  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={SLASH_COMMANDS.eyebrow}
      title={SLASH_COMMANDS.title}
      lead={SLASH_COMMANDS.lead}
    >
      <CardExplorer
        cards={[...SLASH_COMMANDS.cards]}
        hint={SLASH_COMMANDS.hint}
        placeholder={SLASH_COMMANDS.placeholder}
        snippetFileName="you type"
      />
    </PresentationSection>
  );
}
