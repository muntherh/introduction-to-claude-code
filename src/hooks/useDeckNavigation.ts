import { useCallback, useEffect, useRef, useState } from "react";
import { TOTAL_SLIDES } from "@/data/slides";
import { IS_RTL } from "@/deck.config";

/** Elements that own the keyboard while focused. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/** Space and Enter belong to the focused control, not to the deck. */
function isActivatableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest("button, a[href], [role='button'], summary, label"),
  );
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export interface DeckNavigation {
  index: number;
  total: number;
  goTo: (index: number, options?: { instant?: boolean }) => void;
  next: () => void;
  previous: () => void;
  restart: () => void;
  registerSlide: (index: number) => (node: HTMLElement | null) => void;
  /** Bumped on restart so slides can reset their local state. */
  runId: number;
}

/**
 * Owns deck position.
 *
 * The deck is a plain vertical scroller with CSS scroll-snap, which buys us
 * mouse wheel, trackpad and touch navigation for free (and keeps the hero
 * word animation genuinely scroll-linked). Buttons, dots and the keyboard all
 * funnel through `goTo`, so every input method stays in sync.
 */
export function useDeckNavigation(): DeckNavigation {
  const [index, setIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);

  // The slide `goTo` most recently aimed for. next()/previous() read this —
  // never the observer-driven `index` state — so a second press queued
  // while a smooth scroll is still animating advances from the intended
  // slide, not from whichever slide the IntersectionObserver happens to be
  // transiting past at that instant. Without this split, pressing "next"
  // twice quickly could land two, three, even five slides ahead: the second
  // press would compute target+1 from a mid-flight observer reading instead
  // of from the first press's actual target.
  const targetIndexRef = useRef(0);

  // True while a goTo-triggered scroll is animating. The observer still
  // fires for every slide the viewport passes over during that transit;
  // suppressing its `setIndex` calls until the scroll settles is what stops
  // the displayed index (and therefore next/previous) from bouncing through
  // intermediate slides mid-jump.
  const isProgrammaticScrollRef = useRef(false);
  const settleTimerRef = useRef<
    ReturnType<typeof window.setTimeout> | undefined
  >(undefined);

  const registerSlide = useCallback(
    (slideIndex: number) => (node: HTMLElement | null) => {
      slideRefs.current[slideIndex] = node;
    },
    [],
  );

  const goTo = useCallback(
    (target: number, options?: { instant?: boolean }) => {
      const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, target));
      const node = slideRefs.current[clamped];
      if (!node) return;

      // Long jumps are snapped instantly: smooth-scrolling across ten
      // viewports looks slow and fights scroll-snap on the way.
      const distance = Math.abs(clamped - targetIndexRef.current);
      const instant =
        options?.instant ?? (distance > 2 || prefersReducedMotion());

      targetIndexRef.current = clamped;
      isProgrammaticScrollRef.current = true;
      window.clearTimeout(settleTimerRef.current);
      // Fallback in case 'scrollend' doesn't fire (an instant jump never
      // dispatches it at all): matches the smooth-scroll's own duration, so
      // the observer is re-armed right as the animation actually finishes.
      settleTimerRef.current = window.setTimeout(
        () => {
          isProgrammaticScrollRef.current = false;
        },
        instant ? 50 : 700,
      );

      setIndex(clamped);
      // "instant" is required rather than "auto": the deck sets
      // `scroll-behavior: smooth` in CSS, and "auto" defers to it.
      window.scrollTo({
        top: node.offsetTop,
        behavior: instant ? "instant" : "smooth",
      });
    },
    [],
  );

  const next = useCallback(
    () => goTo(targetIndexRef.current + 1),
    [goTo],
  );
  const previous = useCallback(
    () => goTo(targetIndexRef.current - 1),
    [goTo],
  );

  const restart = useCallback(() => {
    setRunId((value) => value + 1);
    targetIndexRef.current = 0;
    setIndex(0);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Track the slide crossing the middle of the viewport. This keeps the
  // counter, progress bar and dots correct for wheel and touch scrolling too.
  useEffect(() => {
    const nodes = slideRefs.current.filter(
      (node): node is HTMLElement => node !== null,
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // A goTo-driven scroll is still in flight — the slides passing
        // through the middle band right now are scenery, not a position
        // change. Let the settle timer (or 'scrollend' below) re-arm this.
        if (isProgrammaticScrollRef.current) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const found = slideRefs.current.indexOf(entry.target as HTMLElement);
          if (found >= 0) {
            targetIndexRef.current = found;
            setIndex(found);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));

    // Clears the suppression the moment the browser confirms scrolling has
    // actually stopped, rather than waiting out the timeout fallback above.
    function onScrollEnd() {
      isProgrammaticScrollRef.current = false;
    }
    window.addEventListener("scrollend", onScrollEnd);

    return () => {
      observer.disconnect();
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, [runId]);

  return {
    index,
    total: TOTAL_SLIDES,
    goTo,
    next,
    previous,
    restart,
    registerSlide,
    runId,
  };
}

export interface KeyboardOptions {
  next: () => void;
  previous: () => void;
  goTo: (index: number, options?: { instant?: boolean }) => void;
  toggleOverview: () => void;
  closeOverview: () => void;
  toggleFullscreen: () => void;
  overviewOpen: boolean;
}

/** Presenter keyboard shortcuts, disabled while the user is typing. */
export function useDeckKeyboard({
  next,
  previous,
  goTo,
  toggleOverview,
  closeOverview,
  toggleFullscreen,
  overviewOpen,
}: KeyboardOptions): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      // Never hijack typing in the learner inputs.
      if (isTypingTarget(event.target)) {
        if (event.key === "Escape" && event.target instanceof HTMLElement) {
          event.target.blur();
        }
        return;
      }

      switch (event.key) {
        // Horizontal arrows follow the reading direction: in RTL the deck
        // runs right-to-left, so ArrowLeft is what moves it forward. The
        // vertical arrows and Page keys are unaffected — the deck always
        // scrolls downwards.
        case "ArrowRight":
          event.preventDefault();
          if (IS_RTL) previous();
          else next();
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (IS_RTL) next();
          else previous();
          break;
        case "ArrowDown":
        case "PageDown":
          event.preventDefault();
          next();
          break;
        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          previous();
          break;
        case " ":
        case "Spacebar":
          // Space still activates a focused button.
          if (isActivatableTarget(event.target)) return;
          event.preventDefault();
          next();
          break;
        case "Home":
          event.preventDefault();
          goTo(0, { instant: true });
          break;
        case "End":
          event.preventDefault();
          goTo(Number.MAX_SAFE_INTEGER, { instant: true });
          break;
        case "Escape":
          if (overviewOpen) {
            event.preventDefault();
            closeOverview();
          }
          break;
        case "o":
        case "O":
          event.preventDefault();
          toggleOverview();
          break;
        case "f":
        case "F":
          event.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    next,
    previous,
    goTo,
    toggleOverview,
    closeOverview,
    toggleFullscreen,
    overviewOpen,
  ]);
}
