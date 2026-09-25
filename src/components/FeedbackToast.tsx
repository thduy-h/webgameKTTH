export function FeedbackToast({
  message,
  good,
}: {
  message: string;
  good: boolean;
}) {
  return (
    <div className={`feedback-toast ${good ? "good" : "try"}`} role="status">
      <span aria-hidden="true">{good ? "🌟" : "💡"}</span>
      {message}
    </div>
  );
}
