export function ScoreDisplay({ score }: { score: number }) {
  return (
    <div className="score-pill" aria-label={`${score} điểm`}>
      ⭐ {score} điểm
    </div>
  );
}
