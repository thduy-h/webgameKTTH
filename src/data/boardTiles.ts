import type { TileType } from "@/types/game";
export const boardTiles: TileType[] = Array.from({ length: 30 }, (_, i) => {
  if (i === 29 || i === 0) return "NORMAL";
  const pattern: TileType[] = [
    "QUESTION",
    "NORMAL",
    "BONUS",
    "NORMAL",
    "REPAIR",
    "QUESTION",
    "REUSE",
    "NORMAL",
    "PENALTY",
    "QUESTION",
  ];
  return pattern[(i - 1) % pattern.length];
});
