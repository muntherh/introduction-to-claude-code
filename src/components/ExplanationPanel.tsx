import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface ExplanationItem {
  id: string;
  /** The literal piece of code this row explains. */
  token: string;
  title: string;
  meaning: string;
}

interface ExplanationPanelProps {
  items: readonly ExplanationItem[];
  activeId: string | null;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  visible: boolean;
  className?: string;
}

/**
 * The "Explain This Code" list that sits beside the snippet.
 * Rows are buttons so a presenter can walk them with Tab, and hovering a row
 * highlights the matching part of the code.
 */
export function ExplanationPanel({
  items,
  activeId,
  onHover,
  onSelect,
  visible,
  className,
}: ExplanationPanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.ul
          className={cn("flex flex-col gap-2.5", className)}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {items.map((item, itemIndex) => {
            const isActive = item.id === activeId;
            return (
              <motion.li
                key={item.id}
                initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : 0.06 * itemIndex,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <button
                  type="button"
                  onMouseEnter={() => onHover?.(item.id)}
                  onMouseLeave={() => onHover?.(null)}
                  onFocus={() => onHover?.(item.id)}
                  onBlur={() => onHover?.(null)}
                  onClick={() => onSelect?.(item.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex w-full cursor-pointer items-start gap-3.5 rounded-xl border p-3.5 text-start transition-all duration-200 sm:gap-4 sm:p-4",
                    isActive
                      ? "border-accent-warm/55 bg-accent-warm/8"
                      : "border-line bg-navy-900/45 hover:border-accent/40 hover:bg-navy-850/70",
                  )}
                >
                  <code
                    className={cn(
                      "shrink-0 rounded-md px-2 py-1 font-mono text-[clamp(0.78rem,0.95vw,1rem)] transition-colors duration-200",
                      isActive
                        ? "bg-accent-warm/18 text-accent-warm"
                        : "bg-white/6 text-accent-bright",
                    )}
                  >
                    {item.token}
                  </code>
                  <span className="min-w-0">
                    <span className="block text-[clamp(0.92rem,1.05vw,1.15rem)] font-medium text-chalk">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-[clamp(0.85rem,1vw,1.08rem)] leading-snug text-mist">
                      {item.meaning}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      ) : null}
    </AnimatePresence>
  );
}
