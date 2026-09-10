import type { ReactNode } from "react";
import { Reveal, RevealWords } from "@/components/Reveal";
import { SLIDES } from "@/data/slides";
import { cn } from "@/lib/cn";

export interface SectionProps {
  index: number;
  registerRef: (node: HTMLElement | null) => void;
}

interface PresentationSectionProps extends SectionProps {
  eyebrow: string;
  title: string;
  /** One short sentence. Kept to a single idea per slide, on purpose. */
  lead?: string;
  children: ReactNode;
  /** Width cap for the slide body. */
  width?: "normal" | "wide";
  className?: string;
  headerClassName?: string;
}

/**
 * The shared full-screen slide frame: number, eyebrow, heading, lead, body.
 *
 * Every teaching slide uses it, which is what keeps the deck feeling like one
 * designed object rather than twelve separate pages.
 */
export function PresentationSection({
  index,
  registerRef,
  eyebrow,
  title,
  lead,
  children,
  width = "normal",
  className,
  headerClassName,
}: PresentationSectionProps) {
  const slide = SLIDES[index];
  const headingId = `${slide?.id ?? index}-heading`;
  const slideNumber = String(index + 1).padStart(2, "0");

  return (
    <section
      id={slide?.id}
      ref={registerRef}
      aria-labelledby={headingId}
      className={cn(
        "deck-slide relative h-[var(--vh-full)] max-h-[var(--vh-full)] w-full overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-full w-full flex-col px-5 sm:px-8 lg:px-14",
          width === "wide" ? "max-w-[1660px]" : "max-w-[1360px]",
        )}
        style={{
          paddingTop: "calc(var(--chrome-top) + clamp(1rem,3vh,2.5rem))",
          paddingBottom: "calc(var(--chrome-bottom) + clamp(0.5rem,2vh,1.5rem))",
        }}
      >
        <header className={cn("mb-[clamp(1.5rem,4vh,3rem)] shrink-0", headerClassName)}>
          <Reveal className="mb-[clamp(0.75rem,1.8vh,1.35rem)] flex items-center gap-4">
            <span className="font-mono text-[0.78rem] tracking-[0.3em] text-accent-warm tabular-nums sm:text-[0.85rem]">
              {slideNumber}
            </span>
            <span
              aria-hidden="true"
              className="h-px w-10 bg-line sm:w-14"
            />
            <span className="font-mono text-[0.7rem] tracking-[0.28em] text-dim uppercase sm:text-[0.78rem]">
              {eyebrow}
            </span>
          </Reveal>

          <h2
            id={headingId}
            className="max-w-[22ch] text-[clamp(2rem,4.4vw,4.4rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-chalk"
          >
            <RevealWords text={title} />
          </h2>

          {lead ? (
            <Reveal delay={0.16}>
              <p className="mt-[clamp(0.85rem,2vh,1.6rem)] max-w-[54ch] text-[clamp(1.02rem,1.5vw,1.7rem)] leading-[1.55] text-mist">
                {lead}
              </p>
            </Reveal>
          ) : null}
        </header>

        <div className="min-w-0 flex-1 overflow-y-auto pb-32">{children}</div>
      </div>
    </section>
  );
}
