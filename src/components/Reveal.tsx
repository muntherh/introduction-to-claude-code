import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance travelled on entry, in pixels. */
  distance?: number;
}

/**
 * Fade + rise on first entry into view.
 * With reduced motion the content is simply rendered in place.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 20,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  // `min-w-0` matters: Reveal is often a grid or flex item wrapping a code
  // block, and the default `min-width: auto` would let that block push the
  // whole slide wider than the viewport.
  if (reduceMotion) {
    return <div className={cn("min-w-0", className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("min-w-0", className)}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.68, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface RevealWordsProps {
  text: string;
  className?: string;
  delay?: number;
  /** Seconds between each word. */
  stagger?: number;
}

/** Word-by-word reveal used for the large headings. */
export function RevealWords({
  text,
  className,
  delay = 0,
  stagger = 0.055,
}: RevealWordsProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className={cn(
            "inline-block overflow-hidden align-bottom",
            wordIndex < words.length - 1 && "me-[0.26em]",
          )}
          aria-hidden="true"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "108%", opacity: 0 },
              visible: { y: "0%", opacity: 1 },
            }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
