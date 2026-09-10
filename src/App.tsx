import { useCallback, useMemo, useState } from "react";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { DeckChrome } from "@/components/DeckChrome";
import { OverviewMenu } from "@/components/OverviewMenu";
import { SLIDES } from "@/data/slides";
import { DeckContext, type DeckContextValue } from "@/hooks/useDeckContext";
import {
  useDeckKeyboard,
  useDeckNavigation,
} from "@/hooks/useDeckNavigation";
import { useFullscreen } from "@/hooks/useFullscreen";
import { SECTION_COMPONENTS } from "@/sections";
import type { QuizResult } from "@/types";

export default function App() {
  const { index, total, goTo, next, previous, restart, registerSlide, runId } =
    useDeckNavigation();
  const {
    isFullscreen,
    toggle: toggleFullscreen,
    supported: fullscreenSupported,
  } = useFullscreen();

  const [overviewOpen, setOverviewOpen] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const toggleOverview = useCallback(
    () => setOverviewOpen((open) => !open),
    [],
  );
  const closeOverview = useCallback(() => setOverviewOpen(false), []);

  const handleRestart = useCallback(() => {
    setQuizResult(null);
    setOverviewOpen(false);
    restart();
  }, [restart]);

  useDeckKeyboard({
    next,
    previous,
    goTo,
    toggleOverview,
    closeOverview,
    toggleFullscreen,
    overviewOpen,
  });

  const deckValue = useMemo<DeckContextValue>(
    () => ({
      index,
      total,
      goTo,
      next,
      previous,
      restart: handleRestart,
      quizResult,
      setQuizResult,
    }),
    [index, total, goTo, next, previous, handleRestart, quizResult],
  );

  return (
    <DeckContext.Provider value={deckValue}>
      <AmbientBackdrop />

      <a
        href={`#${SLIDES[1]?.id ?? "hero"}`}
        className="sr-only-focusable focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[80] focus:h-auto focus:w-auto focus:rounded-lg focus:bg-accent-warm focus:px-4 focus:py-2 focus:text-[#1a0e07] focus:[clip-path:none]"
      >
        Skip to the lesson
      </a>

      <main key={runId} className="relative z-10">
        {SECTION_COMPONENTS.map((Section, sectionIndex) => (
          <Section
            key={SLIDES[sectionIndex]?.id ?? sectionIndex}
            index={sectionIndex}
            registerRef={registerSlide(sectionIndex)}
          />
        ))}
      </main>

      <DeckChrome
        index={index}
        total={total}
        onPrevious={previous}
        onNext={next}
        onSelect={goTo}
        onRestart={handleRestart}
        onToggleOverview={toggleOverview}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        fullscreenSupported={fullscreenSupported}
        overviewOpen={overviewOpen}
      />

      <OverviewMenu
        open={overviewOpen}
        index={index}
        onClose={closeOverview}
        onSelect={goTo}
      />
    </DeckContext.Provider>
  );
}
