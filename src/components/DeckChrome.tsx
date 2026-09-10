import { motion, useReducedMotion } from "framer-motion";
import {
  LayoutGrid,
  Maximize2,
  Minimize2,
  RotateCcw,
} from "lucide-react";
import { NavigationControls } from "@/components/NavigationControls";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { SLIDES } from "@/data/slides";
import { DECK_TITLE } from "@/deck.config";
import { cn } from "@/lib/cn";

interface DeckChromeProps {
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  onRestart: () => void;
  onToggleOverview: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  fullscreenSupported: boolean;
  overviewOpen: boolean;
}

const ICON_BUTTON =
  "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-navy-900/60 text-mist transition-colors duration-200 hover:border-accent/50 hover:text-chalk sm:h-11 sm:w-11";

/** The persistent presenter controls: top status bar and bottom control bar. */
export function DeckChrome({
  index,
  total,
  onPrevious,
  onNext,
  onSelect,
  onRestart,
  onToggleOverview,
  onToggleFullscreen,
  isFullscreen,
  fullscreenSupported,
  overviewOpen,
}: DeckChromeProps) {
  const reduceMotion = useReducedMotion();
  const slide = SLIDES[index];

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-4 sm:px-7 lg:px-10"
        style={{ height: "var(--chrome-top)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-void via-void/85 to-transparent"
        />

        <a
          href="#hero"
          onClick={(event) => {
            event.preventDefault();
            onSelect(0);
          }}
          className="flex items-center gap-2 sm:gap-3"
          aria-label={DECK_TITLE}
        >
          <div className="hidden flex-col items-start sm:flex">
            
            <span className="text-[0.92rem] font-medium tracking-tight text-chalk">{DECK_TITLE}</span>
          </div>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <p
            className="me-1 font-mono text-[0.8rem] tracking-[0.16em] text-mist tabular-nums sm:me-2 sm:text-[0.92rem]"
            aria-live="polite"
          >
            <span className="text-accent-warm">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mx-1.5 text-dim">/</span>
            <span className="text-dim">{String(total).padStart(2, "0")}</span>
            <span className="sr-only">
              {` — ${slide?.label ?? ""}`}
            </span>
          </p>

          <button
            type="button"
            onClick={onToggleOverview}
            className={cn(ICON_BUTTON, overviewOpen && "border-accent-warm/55 text-accent-warm")}
            aria-label="Open slide overview"
            aria-expanded={overviewOpen}
            title="Overview (O)"
          >
            <LayoutGrid aria-hidden="true" className="h-[1.05rem] w-[1.05rem]" />
          </button>

          <button
            type="button"
            onClick={onRestart}
            className={ICON_BUTTON}
            aria-label="Restart presentation"
            title="Restart"
          >
            <RotateCcw aria-hidden="true" className="h-[1.05rem] w-[1.05rem]" />
          </button>

          {fullscreenSupported ? (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className={ICON_BUTTON}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              aria-pressed={isFullscreen}
              title="Fullscreen (F)"
            >
              {isFullscreen ? (
                <Minimize2 aria-hidden="true" className="h-[1.05rem] w-[1.05rem]" />
              ) : (
                <Maximize2 aria-hidden="true" className="h-[1.05rem] w-[1.05rem]" />
              )}
            </button>
          ) : null}
        </div>
      </header>

      <motion.footer
        className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-4 px-4 pb-4 sm:items-end sm:gap-8 sm:px-7 sm:pb-5 lg:px-10"
        style={{ minHeight: "var(--chrome-bottom)" }}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-void via-void/88 to-transparent"
        />

        <div className="hidden min-w-[9rem] shrink-0 flex-col justify-end pb-1 lg:flex">
          <p className="font-mono text-[0.66rem] tracking-[0.26em] text-dim uppercase">
            Now showing
          </p>
          <p className="mt-1 truncate text-[0.95rem] font-medium text-chalk">
            {slide?.label}
          </p>
        </div>

        <ProgressIndicator index={index} total={total} onSelect={onSelect} />

        <NavigationControls
          index={index}
          total={total}
          onPrevious={onPrevious}
          onNext={onNext}
          className="shrink-0 sm:pb-1"
        />
      </motion.footer>
    </>
  );
}
