export function shuffleArray<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getRandomQuestions<T>(
  questions: readonly T[],
  count: number,
): T[] {
  return shuffleArray(questions).slice(0, Math.min(count, questions.length));
}

export function shuffleQuestionAnswers<
  T extends { answers: string[]; correctAnswer: number },
>(question: T): T {
  const answerEntries = question.answers.map((answer, index) => ({
    answer,
    index,
  }));
  const shuffled = shuffleArray(answerEntries);
  return {
    ...question,
    answers: shuffled.map((entry) => entry.answer),
    correctAnswer: shuffled.findIndex(
      (entry) => entry.index === question.correctAnswer,
    ),
  };
}
