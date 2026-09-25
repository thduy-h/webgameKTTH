import type { Team } from "@/types/game";
export function TeamCard({
  team,
  onChange,
  disabled = false,
  showControls = true,
}: {
  team: Team;
  onChange: (delta: number) => void;
  disabled?: boolean;
  showControls?: boolean;
}) {
  return (
    <article
      className="team-admin"
      style={{ "--team-color": team.color } as React.CSSProperties}
    >
      <div className="team-admin-head">
        <span>{team.mascot}</span>
        <strong>{team.name}</strong>
      </div>
      <b className="team-admin-score">{team.score}</b>
      {showControls && (
        <div className="team-controls">
          <button
            onClick={() => onChange(-5)}
            aria-label={`Trừ 5 điểm cho ${team.name}`}
            disabled={disabled}
          >
            −5
          </button>
          <button
            onClick={() => onChange(5)}
            aria-label={`Cộng 5 điểm cho ${team.name}`}
            disabled={disabled}
          >
            +5
          </button>
          <button
            onClick={() => onChange(10)}
            aria-label={`Cộng 10 điểm cho ${team.name}`}
            disabled={disabled}
          >
            +10
          </button>
          <button
            onClick={() => onChange(15)}
            aria-label={`Cộng 15 điểm cho ${team.name}`}
            disabled={disabled}
          >
            +15
          </button>
        </div>
      )}
    </article>
  );
}
