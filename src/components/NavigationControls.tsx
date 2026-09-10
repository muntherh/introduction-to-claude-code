import { ChevronLeft, ChevronRight } from "lucide-react";
import { IS_RTL } from "@/deck.config";
import { cn } from "@/lib/cn";

// A chevron points at a physical side, so it cannot be flipped by CSS
// logical properties the way margins and padding are. In RTL the deck
// advances leftwards, so "next" is the left-pointing glyph.
const BackChevron = IS_RTL ? ChevronRight : ChevronLeft;
const ForwardChevron = IS_RTL ? ChevronLeft : ChevronRight;

interface NavigationControlsProps {
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

const BASE =
  "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-[0.9rem] font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30 sm:px-5";

/** Previous / Next pair. Large enough to hit quickly while presenting. */
export function NavigationControls({
  index,
  total,
  onPrevious,
  onNext,
  className,
}: NavigationControlsProps) {
  const atStart = index === 0;
  const atEnd = index === total - 1;

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      <button
        type="button"
        onClick={onPrevious}
        disabled={atStart}
        aria-label="Previous slide"
        className={cn(
          BASE,
          "border-line bg-navy-900/70 text-mist hover:enabled:border-accent/50 hover:enabled:text-chalk",
        )}
      >
        <BackChevron aria-hidden="true" className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={atEnd}
        aria-label="Next slide"
        className={cn(
          BASE,
          "border-accent/45 bg-accent/12 text-chalk hover:enabled:border-accent hover:enabled:bg-accent/22",
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ForwardChevron aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
