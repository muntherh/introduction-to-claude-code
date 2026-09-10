import { createContext, useContext } from "react";
import type { QuizResult } from "@/types";

export interface DeckContextValue {
  index: number;
  total: number;
  goTo: (index: number, options?: { instant?: boolean }) => void;
  next: () => void;
  previous: () => void;
  restart: () => void;
  quizResult: QuizResult | null;
  setQuizResult: (result: QuizResult | null) => void;
}

export const DeckContext = createContext<DeckContextValue | null>(null);

/** Access deck navigation and shared lesson state from any slide. */
export function useDeck(): DeckContextValue {
  const value = useContext(DeckContext);
  if (!value) {
    throw new Error("useDeck must be used inside the deck provider");
  }
  return value;
}
