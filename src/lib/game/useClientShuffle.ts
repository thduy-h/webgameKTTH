"use client";

import { useEffect, useState } from "react";
import { shuffleArray } from "@/lib/game/random";

export function useClientShuffle<T>(
  items: readonly T[],
  key: string,
): readonly T[] {
  const [shuffled, setShuffled] = useState<readonly T[]>(items);

  useEffect(() => {
    const timer = window.setTimeout(() => setShuffled(shuffleArray(items)), 0);
    return () => window.clearTimeout(timer);
  }, [items, key]);

  return shuffled;
}
