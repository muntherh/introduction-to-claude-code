import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { ActionButton } from "@/components/ActionButton";
import { HeroWordmark } from "@/components/HeroWordmark";
import type { SectionProps } from "@/components/PresentationSection";
import { HERO } from "@/data/lesson";
import { useDeck } from "@/hooks/useDeckContext";
import { useElementHeight } from "@/hooks/useElementHeight";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The opening slide. It carries the deck's only <h1>; every other slide
 * heading is an <h2> supplied by PresentationSection, which is what keeps the
 * document outline honest for screen readers.
 */
export function HeroSection({ registerRef }: SectionProps) {
  const { next } = useDeck();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  // 0 while the hero fills the screen, 1 once it has scrolled fully away.
  //
  // Window scroll rather than a target-relative scroll: framer stops updating
  // a target-based progress once the element leaves the viewport, which would
  // freeze the wordmark part-way through its move.
  const { scrollY } = useScroll();
  const heroHeight = useElementHeight(sectionRef, 1);
  const progress = useTransform(scrollY, [0, Math.max(heroHeight, 1)], [0, 1], {
    clamp: true,
  });

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay, ease: EASE },
        };

  return (
    <section
      id="hero"
      ref={(node) => {
        sectionRef.current = node;
        registerRef(node);
      }}
      aria-labelledby="hero-heading"
      className="deck-slide relative flex min-h-[var(--vh-full)] w-full flex-col"
    >
      <h1 id="hero-heading" className="sr-only">
        {HERO.headline}
      </h1>

      <HeroWordmark text={HERO.wordmark} progress={progress} />

      <div
        className="relative z-20 mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-start px-5 text-center sm:px-8"
        style={{
          paddingTop: "var(--hero-pad-top)",
          paddingBottom: "calc(var(--chrome-bottom) - 1rem)",
        }}
      >
        <motion.p
          {...fadeUp(1.0)}
          className="flex items-center gap-4 font-display text-[clamp(1.15rem,2.6vw,2.4rem)] font-light tracking-[0.34em] text-accent-warm uppercase"
        >
          <span aria-hidden="true" className="h-px w-8 bg-accent-warm/40 sm:w-14" />
          {HERO.kicker}
          <span aria-hidden="true" className="h-px w-8 bg-accent-warm/40 sm:w-14" />
        </motion.p>

        <motion.p
          {...fadeUp(1.12)}
          className="mt-[clamp(0.85rem,2vh,2rem)] max-w-[24ch] text-[clamp(1.15rem,2.15vw,2.15rem)] leading-[1.25] font-medium tracking-[-0.02em] text-chalk text-balance-tight sm:max-w-[30ch]"
        >
          {HERO.headline}
        </motion.p>

        <motion.p
          {...fadeUp(1.24)}
          className="mt-[clamp(0.5rem,1.6vh,1.1rem)] max-w-[46ch] text-[clamp(0.95rem,1.25vw,1.3rem)] leading-relaxed text-mist"
        >
          {HERO.lead}
        </motion.p>

        <motion.div
          {...fadeUp(1.38)}
          className="mt-[clamp(1.1rem,2.6vh,2.6rem)] flex flex-col items-center gap-3.5"
        >
          <ActionButton
            variant="accent"
            size="lg"
            icon={ArrowDown}
            onClick={next}
            className="glow-accent"
          >
            {HERO.cta}
          </ActionButton>
        </motion.div>
      </div>
    </section>
  );
}
