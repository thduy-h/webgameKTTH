export function AnswerButton({
  children,
  onClick,
  state,
  disabled,
  ariaLabel,
  autoFocus,
}: {
  children: React.ReactNode;
  onClick: () => void;
  state?: "correct" | "wrong";
  disabled?: boolean;
  ariaLabel: string;
  autoFocus?: boolean;
}) {
  return (
    <button
      className={`answer-button ${state ?? ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      autoFocus={autoFocus}
    >
      {children}
      {state === "correct" && <span aria-label="Đúng"> ✓</span>}
      {state === "wrong" && <span aria-label="Chưa đúng"> ✕</span>}
    </button>
  );
}
