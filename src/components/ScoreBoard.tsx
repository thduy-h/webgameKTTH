import type { Team } from "@/types/game";
export function ScoreBoard({
  teams,
  activeId,
}: {
  teams: Team[];
  activeId?: string;
}) {
  return (
    <div className="scoreboard">
      {teams.map((team) => (
        <div
          key={team.id}
          className={`score-team ${activeId === team.id ? "active" : ""}`}
          style={{ "--team-color": team.color } as React.CSSProperties}
        >
          <span className="score-mascot">{team.mascot}</span>
          <span className="score-name">{team.name}</span>
          <strong>
            {team.score}
            <small> điểm</small>
          </strong>
        </div>
      ))}
    </div>
  );
}
