import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { QuizQuestion } from "@/types";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  /** Index the learner picked, or null while unanswered. */
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

const LETTERS = ["A", "B", "C", "D"];

/**
 * One quiz question.
 *
 * Correctness is never signalled by colour alone: the right answer also gets
 * a check icon and the wrong pick gets a cross, plus a written explanation.
 */
export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  onSelect,
}: QuizCardProps) {
  const reduceMotion = useReducedMotion();
  const answered = selectedIndex !== null;
  const isCorrect = selectedIndex === question.answerIndex;

  return (
    <div className="glass rounded-3xl p-4 sm:p-6 lg:p-7">
      <p className="font-mono text-[0.72rem] tracking-[0.26em] text-dim uppercase">
        Question {questionNumber} of {totalQuestions}
      </p>

      <h3 className="mt-2.5 text-[clamp(1.2rem,2.1vw,2rem)] leading-tight font-semibold tracking-tight text-chalk">
        {question.prompt}
      </h3>

      <ul className="mt-[clamp(0.9rem,2.2vh,1.6rem)] grid gap-2.5 sm:grid-cols-2">
        {question.options.map((option, optionIndex) => {
          const isAnswer = optionIndex === question.answerIndex;
          const isPicked = optionIndex === selectedIndex;
          const showCorrect = answered && isAnswer;
          const showWrong = answered && isPicked && !isAnswer;

          return (
            <li key={option}>
              <button
                type="button"
                onClick={() => onSelect(optionIndex)}
                disabled={answered}
                aria-pressed={isPicked}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-start transition-all duration-200 sm:p-4",
                  !answered &&
                    "cursor-pointer border-line bg-navy-900/55 hover:border-accent/50 hover:bg-navy-850",
                  answered && "cursor-default",
                  showCorrect && "border-ok/60 bg-ok/10",
                  showWrong && "border-bad/60 bg-bad/10",
                  answered &&
                    !showCorrect &&
                    !showWrong &&
                    "border-line/60 bg-navy-900/35 opacity-55",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-[0.82rem] transition-colors duration-200",
                    showCorrect
                      ? "border-ok/60 bg-ok/18 text-ok"
                      : showWrong
                        ? "border-bad/60 bg-bad/18 text-bad"
                        : "border-line bg-white/5 text-mist",
                  )}
                >
                  {showCorrect ? (
                    <Check className="h-4 w-4" />
                  ) : showWrong ? (
                    <X className="h-4 w-4" />
                  ) : (
                    LETTERS[optionIndex]
                  )}
                </span>
                <span
                  className={cn(
                    "text-[clamp(0.92rem,1.18vw,1.18rem)] font-medium",
                    showCorrect
                      ? "text-ok"
                      : showWrong
                        ? "text-bad"
                        : "text-chalk",
                  )}
                >
                  {option}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence initial={false}>
        {answered ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mt-5 flex items-start gap-3 rounded-2xl border p-4 sm:p-5",
              isCorrect ? "border-ok/40 bg-ok/8" : "border-warn/40 bg-warn/8",
            )}
            role="status"
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                isCorrect ? "bg-ok/20 text-ok" : "bg-warn/20 text-warn",
              )}
            >
              {isCorrect ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
            </span>
            <p className="text-[clamp(0.92rem,1.15vw,1.15rem)] leading-snug text-chalk">
              <strong className="font-semibold">
                {isCorrect ? "Correct." : "Not quite."}
              </strong>{" "}
              <span className="text-mist">{question.because}</span>
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
