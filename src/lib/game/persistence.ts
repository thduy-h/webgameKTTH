export const STORAGE_VERSION = 1;
export const TEACHER_SETTINGS_KEY = "vong-tron-xanh:teacher-settings";
export const BOARD_SESSION_KEY = "vong-tron-xanh:board-session";

type StoredEnvelope<T> = {
  version: number;
  data: T;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isPersistedTeam(value: unknown): value is Team {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.mascot === "string" &&
    typeof value.color === "string" &&
    typeof value.position === "number" &&
    Number.isFinite(value.position) &&
    typeof value.score === "number" &&
    Number.isFinite(value.score) &&
    value.score >= 0
  );
}

export function readVersionedStorage<T>(
  key: string,
  isValid: (value: unknown) => value is T,
): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      !isRecord(parsed) ||
      parsed.version !== STORAGE_VERSION ||
      !isValid(parsed.data)
    ) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function writeVersionedStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;

  try {
    const payload: StoredEnvelope<T> = { version: STORAGE_VERSION, data };
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Storage may be unavailable or full. The game remains usable in memory.
  }
}

export function removeStoredState(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore unavailable storage; the in-memory session can still continue.
  }
}
import type { Team } from "@/types/game";
