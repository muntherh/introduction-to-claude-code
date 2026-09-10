import { motion, useReducedMotion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

const LETTER_CLASS =
  "inline-block bg-gradient-to-b from-white via-[#f0e4d6] to-[#c9805f] bg-clip-text text-transparent";

interface HeroWordmarkProps {
  /**
   * The deck's title, animated letter by letter. Keep it short: this is set
   * in `--word-size` as a fraction of viewport width, and a long title is
   * what breaks the opening slide at 1280x720. Re-check that token whenever
   * this text changes.
   */
  text: string;
  /** 0 at the top of the hero, 1 once the hero has scrolled away. */
  progress: MotionValue<number>;
}

/**
 * The opening statement of the deck.
 *
 * On load each letter rises out of its own mask. After that the word is
 * driven purely by scroll position: it scales down toward the top of the
 * screen, its tracking opens up slightly, and it clears out of the way so the
 * next slide reads underneath it. No bounce, no spin — one slow move.
 */
export function HeroWordmark({ text, progress }: HeroWordmarkProps) {
  const reduceMotion = useReducedMotion();

  const scale = useTransform(progress, [0, 1], [1, 0.34]);
  const y = useTransform(progress, [0, 1], [0, -64]);
  const letterSpacing = useTransform(
    progress,
    [0, 1],
    ["-0.045em", "0.085em"],
  );
  const opacity = useTransform(progress, [0, 0.6, 0.96], [1, 1, 0]);

  const word = (
    <span
      className="flex justify-center leading-[var(--word-lh)] font-extrabold text-[length:var(--word-size)] whitespace-nowrap"
      aria-hidden="true"
    >
      {text.split("").map((letter, letterIndex) =>
        // A title may be two words. A plain space between two inline-blocks
        // collapses to nothing, so the gap has to be an explicit box.
        letter === " " ? (
          <span
            key={`space-${letterIndex}`}
            className="inline-block w-[0.26em] shrink-0"
          />
        ) : (
        <span
          key={`${letter}-${letterIndex}`}
          className="inline-block overflow-hidden pb-[0.06em]"
        >
          {reduceMotion ? (
            <span className={LETTER_CLASS}>{letter}</span>
          ) : (
            <motion.span
              className={LETTER_CLASS}
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 1.25,
                delay: 0.18 + letterIndex * 0.075,
                ease: EASE,
              }}
            >
              {letter}
            </motion.span>
          )}
        </span>
        ),
      )}
    </span>
  );

  // Reduced motion: keep the word in the hero's own flow so it simply
  // scrolls away, with no transform driving it.
  if (reduceMotion) {
    return (
      <div
        className="pointer-events-none absolute inset-x-0 z-10 px-4"
        style={{ top: "var(--word-top)" }}
      >
        {word}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-10 px-4",
        "will-change-transform",
      )}
      style={{
        top: "var(--word-top)",
        scale,
        y,
        opacity,
        transformOrigin: "50% 0%",
      }}
    >
      <motion.div style={{ letterSpacing }}>{word}</motion.div>

      {/* Soft light bloom sitting behind the letters. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-[18%] top-[16%] -z-10 h-[62%] rounded-full bg-[radial-gradient(ellipse,rgba(139,127,240,0.22)_0%,transparent_70%)] blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.5, ease: EASE }}
      />
    </motion.div>
  );
}
