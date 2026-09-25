import { TEACHER_SETTINGS_KEY } from "@/lib/game/persistence";

type SoundName =
  | "correct"
  | "wrong"
  | "dice"
  | "move"
  | "bonus"
  | "combo"
  | "win";

type Tone = {
  frequency: number;
  start: number;
  duration: number;
  gain: number;
  type?: OscillatorType;
};

const soundPatterns: Record<SoundName, Tone[]> = {
  correct: [
    { frequency: 523, start: 0, duration: 0.11, gain: 0.2 },
    { frequency: 659, start: 0.07, duration: 0.12, gain: 0.18 },
    { frequency: 784, start: 0.14, duration: 0.14, gain: 0.16 },
  ],
  wrong: [
    { frequency: 330, start: 0, duration: 0.16, gain: 0.12, type: "triangle" },
    { frequency: 247, start: 0.13, duration: 0.2, gain: 0.1, type: "triangle" },
  ],
  dice: [
    { frequency: 180, start: 0, duration: 0.06, gain: 0.08, type: "square" },
    { frequency: 260, start: 0.06, duration: 0.06, gain: 0.07, type: "square" },
    { frequency: 195, start: 0.12, duration: 0.06, gain: 0.07, type: "square" },
    { frequency: 310, start: 0.18, duration: 0.08, gain: 0.06, type: "square" },
  ],
  move: [
    { frequency: 420, start: 0, duration: 0.08, gain: 0.09 },
    { frequency: 560, start: 0.07, duration: 0.09, gain: 0.08 },
  ],
  bonus: [
    { frequency: 523, start: 0, duration: 0.12, gain: 0.16, type: "triangle" },
    { frequency: 659, start: 0.08, duration: 0.12, gain: 0.15, type: "triangle" },
    { frequency: 784, start: 0.16, duration: 0.12, gain: 0.14, type: "triangle" },
    { frequency: 1047, start: 0.24, duration: 0.18, gain: 0.12, type: "triangle" },
  ],
  combo: [
    { frequency: 659, start: 0, duration: 0.1, gain: 0.13, type: "triangle" },
    { frequency: 784, start: 0.07, duration: 0.1, gain: 0.13, type: "triangle" },
    { frequency: 988, start: 0.14, duration: 0.16, gain: 0.12, type: "triangle" },
  ],
  win: [
    { frequency: 523, start: 0, duration: 0.16, gain: 0.18 },
    { frequency: 659, start: 0.11, duration: 0.16, gain: 0.17 },
    { frequency: 784, start: 0.22, duration: 0.18, gain: 0.16 },
    { frequency: 1047, start: 0.35, duration: 0.34, gain: 0.14 },
  ],
};

const minimumIntervals: Record<SoundName, number> = {
  correct: 140,
  wrong: 220,
  dice: 320,
  move: 220,
  bonus: 350,
  combo: 320,
  win: 900,
};

let runtimeEnabled = true;
let volume = 0.32;
let audioContext: AudioContext | null = null;
let resumePromise: Promise<void> | null = null;
const activeOscillators = new Set<OscillatorNode>();
const lastPlayed = new Map<SoundName, number>();

function persistedSoundPreference(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TEACHER_SETTINGS_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "data" in parsed &&
      typeof parsed.data === "object" &&
      parsed.data !== null &&
      "soundEnabled" in parsed.data &&
      typeof parsed.data.soundEnabled === "boolean"
    ) {
      return parsed.data.soundEnabled;
    }
  } catch {
    return null;
  }
  return null;
}

function soundIsEnabled(): boolean {
  return persistedSoundPreference() ?? runtimeEnabled;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (audioContext) return audioContext;
  const BrowserAudioContext =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!BrowserAudioContext) return null;
  try {
    audioContext = new BrowserAudioContext();
    return audioContext;
  } catch {
    return null;
  }
}

function stopActiveSounds(context: AudioContext) {
  activeOscillators.forEach((oscillator) => {
    try {
      oscillator.stop(context.currentTime + 0.015);
    } catch {
      // The oscillator may already have completed.
    }
  });
  activeOscillators.clear();
}

function schedulePattern(context: AudioContext, pattern: readonly Tone[]): void {
  stopActiveSounds(context);
  const now = context.currentTime + 0.01;
  pattern.forEach((tone) => {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const start = now + tone.start;
    const end = start + tone.duration;
    oscillator.type = tone.type ?? "sine";
    oscillator.frequency.setValueAtTime(tone.frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(
      Math.max(0.0001, tone.gain * volume),
      start + 0.012,
    );
    envelope.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(envelope);
    envelope.connect(context.destination);
    activeOscillators.add(oscillator);
    oscillator.addEventListener(
      "ended",
      () => {
        activeOscillators.delete(oscillator);
        oscillator.disconnect();
        envelope.disconnect();
      },
      { once: true },
    );
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  });
}

function play(name: SoundName): void {
  if (!soundIsEnabled()) return;
  const now = Date.now();
  if (now - (lastPlayed.get(name) ?? 0) < minimumIntervals[name]) return;
  lastPlayed.set(name, now);
  const context = getAudioContext();
  if (!context) return;
  const schedule = () => schedulePattern(context, soundPatterns[name]);
  if (context.state === "running") {
    schedule();
    return;
  }
  resumePromise ??= context.resume().finally(() => {
    resumePromise = null;
  });
  void resumePromise.then(schedule).catch(() => {
    // Browsers may block audio until a later user gesture.
  });
}

export const playCorrect = () => play("correct");
export const playWrong = () => play("wrong");
export const playDice = () => play("dice");
export const playMove = () => play("move");
export const playBonus = () => play("bonus");
export const playCombo = () => play("combo");
export const playWin = () => play("win");

function setEnabled(value: boolean) {
  runtimeEnabled = value;
  if (!value && audioContext) stopActiveSounds(audioContext);
}

function setVolume(value: number) {
  volume = Math.min(1, Math.max(0, value));
}

export const soundManager = {
  playCorrect,
  playWrong,
  playDice,
  playMove,
  playBonus,
  playCombo,
  playWin,
  setEnabled,
  isEnabled: soundIsEnabled,
  setVolume,
};
