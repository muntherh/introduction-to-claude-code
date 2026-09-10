import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { QuizCard } from "@/components/QuizCard";
import { Reveal } from "@/components/Reveal";
import { QUIZ_QUESTIONS } from "@/data/lesson";
import { useDeck } from "@/hooks/useDeckContext";

const TOTAL = QUIZ_QUESTIONS.length;

/** Slide 15 — five short questions, scored live and shared with the summary. */
export function QuizSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const { next, setQuizResult } = useDeck();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(() =>
    Array.from({ length: TOTAL }, () => null),
  );

  const question = QUIZ_QUESTIONS[questionIndex]!;
  const selected = answers[questionIndex] ?? null;
  const score = answers.reduce<number>(
    (total, answer, answerIndex) =>
      answer !== null && answer === QUIZ_QUESTIONS[answerIndex]?.answerIndex
        ? total + 1
        : total,
    0,
  );
  const answeredAll = answers.every((answer) => answer !== null);
  const isLast = questionIndex === TOTAL - 1;

  // Publish the result so the summary slide can show it.
  useEffect(() => {
    setQuizResult(answeredAll ? { score, total: TOTAL } : null);
  }, [answeredAll, score, setQuizResult]);

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setAnswers((current) =>
      current.map((answer, answerIndex) =>
        answerIndex === questionIndex ? optionIndex : answer,
      ),
    );
  };

  const retry = () => {
    setAnswers(Array.from({ length: TOTAL }, () => null));
    setQuestionIndex(0);
  };

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Check yourself"
      title="Quick quiz"
      lead="Five short questions. Nothing you have not already seen today."
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2.5">
          {QUIZ_QUESTIONS.map((quizQuestion, quizIndex) => {
            const state =
              answers[quizIndex] === null
                ? "todo"
                : answers[quizIndex] === quizQuestion.answerIndex
                  ? "right"
                  : "wrong";
            return (
              <span
                key={quizQuestion.id}
                aria-hidden="true"
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  quizIndex === questionIndex ? "w-9" : "w-5",
                  state === "todo"
                    ? "bg-white/18"
                    : state === "right"
                      ? "bg-ok"
                      : "bg-bad",
                ].join(" ")}
              />
            );
          })}
        </div>

        <p
          className="font-mono text-[0.82rem] tracking-[0.16em] text-mist tabular-nums"
          aria-live="polite"
        >
          Score <span className="text-accent-warm">{score}</span>
          <span className="mx-1 text-dim">/</span>
          <span className="text-dim">{TOTAL}</span>
        </p>
      </div>

      <Reveal delay={0.18} className="mt-[clamp(0.8rem,2vh,1.4rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <QuizCard
              question={question}
              questionNumber={questionIndex + 1}
              totalQuestions={TOTAL}
              selectedIndex={selected}
              onSelect={handleSelect}
            />
          </motion.div>
        </AnimatePresence>
      </Reveal>

      <div className="mt-[clamp(0.8rem,2vh,1.4rem)] flex flex-wrap items-center gap-3">
        <ActionButton
          variant="ghost"
          onClick={() => setQuestionIndex((value) => Math.max(0, value - 1))}
          disabled={questionIndex === 0}
        >
          Back
        </ActionButton>

        {isLast ? (
          <ActionButton
            variant="accent"
            icon={Trophy}
            onClick={next}
            disabled={!answeredAll}
          >
            See Summary
          </ActionButton>
        ) : (
          <ActionButton
            variant="primary"
            icon={ArrowRight}
            onClick={() =>
              setQuestionIndex((value) => Math.min(TOTAL - 1, value + 1))
            }
            disabled={selected === null}
          >
            Next Question
          </ActionButton>
        )}

        <ActionButton icon={RotateCcw} variant="ghost" onClick={retry}>
          Retry Quiz
        </ActionButton>
      </div>
    </PresentationSection>
  );
}
