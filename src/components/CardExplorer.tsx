import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";
import type { ExplorerCard } from "@/types";

interface CardExplorerProps {
  cards: ExplorerCard[];
  /** Small instruction above the grid. */
  hint: string;
  /** Shown in the reveal area before anything is picked. */
  placeholder: string;
  /** Label on the prompt panel, e.g. `prompt`. */
  snippetFileName?: string;
}

/**
 * A grid of cards where picking one reveals a sentence and a matching prompt.
 *
 * Used for the places people vibe code, and again for the Claude Code
 * toolbelt — same interaction, so the room only learns it once.
 */
export function CardExplorer({
  cards,
  hint,
  placeholder,
  snippetFileName = "prompt",
}: CardExplorerProps) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = cards.find((card) => card.id === activeId) ?? null;

  return (
    <>
      <Reveal delay={0.22}>
        <p className="mb-[clamp(0.9rem,2vh,1.5rem)] font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
          {hint}
        </p>
      </Reveal>

      <Reveal delay={0.28}>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {cards.map((card, cardIndex) => {
            const Icon = card.icon;
            const isActive = card.id === activeId;
            const isLastOdd =
              cards.length % 2 === 1 && cardIndex === cards.length - 1;

            return (
              <li
                key={card.id}
                className={cn(isLastOdd && "col-span-2 lg:col-span-1")}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveId((current) =>
                      current === card.id ? null : card.id,
                    )
                  }
                  aria-pressed={isActive}
                  className={cn(
                    "glass glass-hover flex h-full w-full cursor-pointer flex-col items-start justify-between gap-5 rounded-2xl p-5 text-start sm:gap-7 sm:p-6 lg:min-h-[clamp(11rem,20vh,14rem)]",
                    isActive
                      ? "border-accent-warm/55 bg-accent-warm/6"
                      : "hover:-translate-y-1",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300 sm:h-14 sm:w-14",
                      isActive
                        ? "border-accent-warm/50 bg-accent-warm/14 text-accent-warm"
                        : "border-line bg-white/4 text-accent",
                    )}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5 sm:h-7 sm:w-7" />
                  </span>
                  <span className="text-[clamp(0.95rem,1.3vw,1.45rem)] leading-tight font-medium text-chalk">
                    {card.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <div className="mt-[clamp(1.1rem,2.8vh,2rem)] min-h-[clamp(7.5rem,17vh,11rem)]">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-start gap-4 lg:grid-cols-[1.05fr_1fr] lg:gap-8"
            >
              <p className="text-[clamp(1.05rem,1.85vw,1.85rem)] leading-[1.45] font-medium text-chalk">
                {active.example}
              </p>
              <CodeBlock
                code={active.snippet}
                variant="prompt"
                fileName={snippetFileName}
                size="sm"
              />
            </motion.div>
          ) : (
            <motion.p
              key="placeholder"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[clamp(1rem,1.3vw,1.45rem)] text-dim italic"
            >
              {placeholder}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
