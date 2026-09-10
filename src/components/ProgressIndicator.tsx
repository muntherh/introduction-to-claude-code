import { motion, useReducedMotion } from "framer-motion";
import { SLIDES } from "@/data/slides";
import { cn } from "@/lib/cn";

interface ProgressIndicatorProps {
  index: number;
  total: number;
  onSelect: (index: number) => void;
}

/**
 * Progress bar plus one clickable marker per slide.
 * The markers are real buttons, so the whole thing is keyboard reachable.
 */
export function ProgressIndicator({
  index,
  total,
  onSelect,
}: ProgressIndicatorProps) {
  const reduceMotion = useReducedMotion();
  const percent = total > 1 ? (index / (total - 1)) * 100 : 100;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div
        className="relative h-px w-full bg-line"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Slide ${index + 1} of ${total}`}
      >
        <motion.span
          className="absolute inset-y-0 start-0 block bg-gradient-to-r from-accent to-accent-warm"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          }
        />
      </div>

      <div className="hidden items-center gap-1.5 md:flex">
        {SLIDES.map((slide, slideIndex) => {
          const isCurrent = slideIndex === index;
          const isDone = slideIndex < index;

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => onSelect(slideIndex)}
              aria-label={`Go to slide ${slideIndex + 1}: ${slide.label}`}
              aria-current={isCurrent ? "true" : undefined}
              title={`${String(slideIndex + 1).padStart(2, "0")} — ${slide.label}`}
              className="group relative cursor-pointer py-2"
            >
              <span
                className={cn(
                  "block h-1 rounded-full transition-all duration-300",
                  isCurrent
                    ? "w-11 bg-accent-warm"
                    : isDone
                      ? "w-5 bg-accent/70 group-hover:bg-accent"
                      : "w-5 bg-white/18 group-hover:bg-white/45",
                )}
              />
              <span className="pointer-events-none absolute bottom-full start-1/2 mb-2 -translate-x-1/2 rounded-md border border-line bg-navy-900 px-2.5 py-1 text-[0.72rem] whitespace-nowrap text-mist opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                {slide.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
