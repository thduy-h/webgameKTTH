export function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label?: string;
}) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{label ?? "Tiến độ"}</span>
        <strong>
          {value}/{max}
        </strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
