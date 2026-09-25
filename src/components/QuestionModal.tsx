"use client";
import { AnimatePresence, motion } from "framer-motion";
import type { Question } from "@/types/game";
import { AnswerButton } from "@/components/AnswerButton";
export function QuestionModal({
  question,
  onAnswer,
  selectedAnswer,
  onContinue,
  rewardPoints = 10,
}: {
  question: Question | null;
  onAnswer: (index: number) => void;
  selectedAnswer: number | null;
  onContinue?: () => void;
  rewardPoints?: number;
}) {
  const isCorrect =
    question !== null && selectedAnswer === question.correctAnswer;
  return (
    <AnimatePresence>
      {question && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            className="question-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="question-title"
            initial={{ y: 30, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
          >
            <span className="eyebrow">CÂU HỎI XANH</span>
            <h2 id="question-title">{question.question}</h2>
            <div className="answer-grid">
              {question.answers.map((answer, index) => (
                <AnswerButton
                  key={answer}
                  autoFocus={index === 0}
                  ariaLabel={`Đáp án ${String.fromCharCode(65 + index)}: ${answer}`}
                  onClick={() => onAnswer(index)}
                  disabled={selectedAnswer !== null}
                  state={
                    selectedAnswer === null
                      ? undefined
                      : index === question.correctAnswer
                        ? "correct"
                        : index === selectedAnswer
                          ? "wrong"
                          : undefined
                  }
                >
                  {String.fromCharCode(65 + index)}. {answer}
                </AnswerButton>
              ))}
            </div>
            {selectedAnswer !== null && (
              <div
                className={`explanation ${isCorrect ? "is-correct" : "is-wrong"}`}
                role="status"
              >
                <strong>
                  {isCorrect
                    ? "✓ Chính xác!"
                    : "✕ Chưa đúng rồi! Xem thử vì sao nhé."}
                </strong>
                {isCorrect && (
                  <motion.span
                    className="score-gain"
                    initial={{ opacity: 0, y: 8, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    role="status"
                  >
                    +{rewardPoints} điểm
                  </motion.span>
                )}
                <p>{question.explanation}</p>
                <button
                  className="button button-primary"
                  onClick={onContinue}
                  aria-label="Tiếp tục trò chơi"
                >
                  Tiếp tục
                </button>
              </div>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
