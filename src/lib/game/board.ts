import type { Team, TileType } from "@/types/game";
export function moveTeam(team: Team, spaces: number, boardLength = 30): Team {
  return {
    ...team,
    position: Math.min(team.position + spaces, boardLength - 1),
  };
}
export function getTileEffect(type: TileType): number {
  return type === "BONUS"
    ? 20
    : type === "PENALTY"
      ? -1
      : type === "REUSE"
        ? 1
        : 0;
}
