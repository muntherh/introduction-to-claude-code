import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { SLIDES } from "@/data/slides";
import { cn } from "@/lib/cn";

interface OverviewMenuProps {
  open: boolean;
  index: number;
  onClose: () => void;
  onSelect: (index: number) => void;
}

/** Full-screen slide index, opened with the grid button or the `O` key. */
export function OverviewMenu({
  open,
  index,
  onClose,
  onSelect,
}: OverviewMenuProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Move focus into the panel while it is open, and hand it back on close.
  useEffect(() => {
    if (open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      const firstButton = panelRef.current?.querySelector("button");
      firstButton?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      returnFocusRef.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-void/92 px-4 backdrop-blur-md sm:px-8"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          role="dialog"
          aria-modal="true"
          aria-label="Slide overview"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <div
            ref={panelRef}
            className="max-h-[86vh] w-full max-w-[1180px] overflow-y-auto"
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[0.72rem] tracking-[0.28em] text-dim uppercase">
                  Overview
                </p>
                <p className="mt-1 text-[clamp(1.35rem,2.4vw,2rem)] font-semibold tracking-tight text-chalk">
                  Jump to any slide
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close overview"
                className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line bg-navy-900/70 text-mist transition-colors duration-200 hover:border-accent/50 hover:text-chalk"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SLIDES.map((slide, slideIndex) => {
                const isCurrent = slideIndex === index;
                return (
                  <li key={slide.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(slideIndex);
                        onClose();
                      }}
                      aria-current={isCurrent ? "true" : undefined}
                      className={cn(
                        "group flex w-full cursor-pointer flex-col gap-2 rounded-2xl border p-5 text-start transition-all duration-200",
                        isCurrent
                          ? "border-accent-warm/55 bg-accent-warm/8"
                          : "border-line bg-navy-900/55 hover:border-accent/45 hover:bg-navy-850",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "font-mono text-[0.8rem] tabular-nums",
                            isCurrent ? "text-accent-warm" : "text-dim",
                          )}
                        >
                          {String(slideIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[1.05rem] font-medium text-chalk">
                          {slide.label}
                        </span>
                      </span>
                      <span className="text-[0.9rem] leading-snug text-mist">
                        {slide.cue}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
