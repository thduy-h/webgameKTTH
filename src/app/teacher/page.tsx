"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TeamCard } from "@/components/TeamCard";
import {
  BOARD_SESSION_KEY,
  isPersistedTeam,
  isRecord,
  readVersionedStorage,
  removeStoredState,
  TEACHER_SETTINGS_KEY,
  writeVersionedStorage,
} from "@/lib/game/persistence";
import { soundManager } from "@/lib/game/sounds";
import type { Team } from "@/types/game";

const colors = ["#ee7a4a", "#5aa3e6", "#9e78d6", "#41a981"];
const mascots = ["🐢", "🐼", "🐰", "🦊"];
const games = [
  "Đường đua tuần hoàn",
  "Ghép thẻ thần tốc",
  "Siêu nhân phân loại",
  "Thám tử đồ vật",
] as const;
const difficulties = ["Dễ", "Vừa", "Thử thách"] as const;
type SessionPhase = "setup" | "live" | "summary";
type PendingAction = "reset" | "end" | null;
type TeacherSettings = {
  count: number;
  teams: Team[];
  game: string;
  difficulty: string;
  questionCount: string;
  sessionStarted: boolean;
  soundEnabled: boolean;
  sessionPhase?: SessionPhase;
  isPaused?: boolean;
};

function createTeams(count: number): Team[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `team-${i}`,
    name: `Đội ${["Rùa", "Gấu trúc", "Thỏ", "Cáo"][i]}`,
    mascot: mascots[i],
    color: colors[i],
    position: 0,
    score: 0,
  }));
}

function resetTeamProgress(teams: Team[]): Team[] {
  return teams.map((team) => ({ ...team, position: 0, score: 0 }));
}

function isTeacherSettings(value: unknown): value is TeacherSettings {
  if (!isRecord(value) || !Array.isArray(value.teams)) return false;
  return (
    Number.isInteger(value.count) &&
    Number(value.count) >= 2 &&
    Number(value.count) <= 4 &&
    value.teams.length === value.count &&
    value.teams.every(isPersistedTeam) &&
    new Set(value.teams.filter(isPersistedTeam).map((team) => team.id)).size ===
      value.teams.length &&
    typeof value.game === "string" &&
    games.includes(value.game as (typeof games)[number]) &&
    typeof value.difficulty === "string" &&
    difficulties.includes(value.difficulty as (typeof difficulties)[number]) &&
    ["10", "15", "20"].includes(String(value.questionCount)) &&
    typeof value.sessionStarted === "boolean" &&
    typeof value.soundEnabled === "boolean" &&
    (value.sessionPhase === undefined ||
      value.sessionPhase === "setup" ||
      value.sessionPhase === "live" ||
      value.sessionPhase === "summary") &&
    (value.isPaused === undefined || typeof value.isPaused === "boolean")
  );
}

export default function TeacherPage() {
  const [count, setCount] = useState(2);
  const [teams, setTeams] = useState(createTeams(2));
  const [game, setGame] = useState("Đường đua tuần hoàn");
  const [difficulty, setDifficulty] = useState("Dễ");
  const [questionCount, setQuestionCount] = useState("10");
  const [phase, setPhase] = useState<SessionPhase>("setup");
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenFallback, setFullscreenFallback] = useState(false);
  const [persistenceReady, setPersistenceReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readVersionedStorage(
        TEACHER_SETTINGS_KEY,
        isTeacherSettings,
      );
      if (saved) {
        setCount(saved.count);
        setTeams(saved.teams);
        setGame(saved.game);
        setDifficulty(saved.difficulty);
        setQuestionCount(saved.questionCount);
        setPhase(
          saved.sessionPhase ?? (saved.sessionStarted ? "live" : "setup"),
        );
        setIsPaused(saved.isPaused ?? false);
        setSoundEnabled(saved.soundEnabled);
      }
      setPersistenceReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!persistenceReady) return;
    writeVersionedStorage<TeacherSettings>(TEACHER_SETTINGS_KEY, {
      count,
      teams,
      game,
      difficulty,
      questionCount,
      sessionStarted: phase === "live",
      soundEnabled,
      sessionPhase: phase,
      isPaused,
    });
  }, [
    count,
    teams,
    game,
    difficulty,
    questionCount,
    phase,
    isPaused,
    soundEnabled,
    persistenceReady,
  ]);

  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      if (document.fullscreenElement) setFullscreenFallback(false);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const supportsQuestionSettings = game === "Đường đua tuần hoàn";
  const gameHref =
    game === "Đường đua tuần hoàn"
      ? "/games/board"
      : game === "Ghép thẻ thần tốc"
        ? "/games/matching"
        : game === "Siêu nhân phân loại"
          ? "/games/sorting"
          : "/games/detective";
  const rankedTeams = useMemo(
    () => [...teams].sort((a, b) => b.score - a.score),
    [teams],
  );
  const totalScore = teams.reduce((total, team) => total + team.score, 0);
  const classroomMode = isFullscreen || fullscreenFallback;

  function settingsSnapshot(): TeacherSettings {
    return {
      count,
      teams,
      game,
      difficulty,
      questionCount,
      sessionStarted: phase === "live",
      soundEnabled,
      sessionPhase: phase,
      isPaused,
    };
  }

  function persistBeforeLaunch() {
    writeVersionedStorage(TEACHER_SETTINGS_KEY, settingsSnapshot());
    removeStoredState(BOARD_SESSION_KEY);
  }

  function changeCount(next: number) {
    setCount(next);
    setTeams(createTeams(next));
  }

  function updateScore(id: string, delta: number) {
    if (phase !== "live" || isPaused) return;
    setTeams((current) =>
      current.map((team) =>
        team.id === id
          ? { ...team, score: Math.max(0, team.score + delta) }
          : team,
      ),
    );
  }

  function updateTeam(id: string, update: Partial<Team>) {
    if (phase !== "setup") return;
    setTeams((current) =>
      current.map((team) => (team.id === id ? { ...team, ...update } : team)),
    );
  }

  function startSession() {
    setTeams((current) => resetTeamProgress(current));
    setIsPaused(false);
    setPendingAction(null);
    setPhase("live");
    removeStoredState(BOARD_SESSION_KEY);
  }

  function togglePause() {
    setIsPaused((current) => !current);
    setPendingAction(null);
  }

  function requestReset() {
    if (pendingAction !== "reset") {
      setPendingAction("reset");
      return;
    }
    setTeams((current) => resetTeamProgress(current));
    setIsPaused(false);
    setPendingAction(null);
    removeStoredState(BOARD_SESSION_KEY);
  }

  function requestEndSession() {
    if (pendingAction !== "end") {
      setPendingAction("end");
      return;
    }
    setIsPaused(false);
    setPendingAction(null);
    setPhase("summary");
  }

  function prepareNewSession() {
    setTeams((current) => resetTeamProgress(current));
    setIsPaused(false);
    setPendingAction(null);
    setPhase("setup");
    removeStoredState(BOARD_SESSION_KEY);
  }

  async function toggleFullscreen() {
    setPendingAction(null);
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (fullscreenFallback) {
      setFullscreenFallback(false);
      return;
    }
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      setFullscreenFallback(true);
    }
  }

  return (
    <main
      className={`page-wrap teacher-page teacher-phase-${phase} ${classroomMode ? "teacher-classroom-mode" : ""}`}
    >
      {phase === "setup" && (
        <>
          <div className="teacher-intro">
            <div>
              <span className="eyebrow">BẢNG ĐIỀU KHIỂN LỚP HỌC</span>
              <h1>
                Teacher <span>Mode</span>
              </h1>
              <p>Chuẩn bị một phiên học xanh rõ ràng và dễ điều khiển.</p>
            </div>
            <span className="teacher-icon">👩‍🏫</span>
          </div>

          <div className="teacher-step-label">
            <span>1</span> Thiết lập tiết học
          </div>
          <section className="teacher-settings">
            <div className="setting-card">
              <label htmlFor="team-count">Số đội</label>
              <select
                id="team-count"
                value={count}
                onChange={(event) => changeCount(Number(event.target.value))}
              >
                {[2, 3, 4].map((value) => (
                  <option value={value} key={value}>
                    {value} đội
                  </option>
                ))}
              </select>
            </div>
            <div className="setting-card">
              <label htmlFor="game-select">Trò chơi</label>
              <select
                id="game-select"
                value={game}
                onChange={(event) => setGame(event.target.value)}
              >
                {games.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </div>
            {supportsQuestionSettings && (
              <>
                <div className="setting-card">
                  <label htmlFor="difficulty">Độ khó</label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value)}
                  >
                    {difficulties.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </div>
                <div className="setting-card">
                  <label htmlFor="question-count">Số câu</label>
                  <select
                    id="question-count"
                    value={questionCount}
                    onChange={(event) => setQuestionCount(event.target.value)}
                  >
                    {[10, 15, 20].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div className="setting-card setting-card-action">
              <span>Âm thanh</span>
              <button
                type="button"
                className="sound-toggle"
                aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
                aria-pressed={soundEnabled}
                onClick={() => setSoundEnabled((current) => !current)}
              >
                <span aria-hidden="true">{soundEnabled ? "🔊" : "🔇"}</span>
                {soundEnabled ? "Đang bật" : "Đang tắt"}
              </button>
            </div>
          </section>

          <div className="teacher-section-heading">
            <div>
              <span className="eyebrow">2 · CHUẨN BỊ ĐỘI CHƠI</span>
              <h2>Đặt tên cho các đội</h2>
            </div>
          </div>
          <section className="team-admin-grid setup-team-grid">
            {teams.map((team) => (
              <article className="team-admin-card" key={team.id}>
                <div className="team-config">
                  <select
                    aria-label={`Mascot ${team.name}`}
                    value={team.mascot}
                    onChange={(event) =>
                      updateTeam(team.id, { mascot: event.target.value })
                    }
                  >
                    {mascots.map((mascot) => (
                      <option key={mascot}>{mascot}</option>
                    ))}
                  </select>
                  <input
                    aria-label={`Tên ${team.name}`}
                    value={team.name}
                    onChange={(event) =>
                      updateTeam(team.id, { name: event.target.value })
                    }
                  />
                  <span
                    className="team-color-dot"
                    style={{ background: team.color }}
                  />
                </div>
                <TeamCard
                  team={team}
                  onChange={(delta) => updateScore(team.id, delta)}
                  showControls={false}
                />
              </article>
            ))}
          </section>

          <section className="teacher-launch">
            <div>
              <b>🎮 {game}</b>
              <p>
                {supportsQuestionSettings
                  ? `${difficulty} · ${questionCount} câu · `
                  : ""}
                {teams.length} đội · {soundEnabled ? "Có âm thanh" : "Tắt âm"}
              </p>
            </div>
            <button
              className="button button-primary"
              aria-label="Bắt đầu phiên lớp học"
              onClick={startSession}
            >
              Bắt đầu phiên lớp học →
            </button>
          </section>
        </>
      )}

      {phase === "live" && (
        <>
          <header className={`teacher-live-header ${isPaused ? "paused" : ""}`}>
            <div>
              <span className="teacher-live-status" role="status">
                <i aria-hidden="true" />
                {isPaused ? "ĐANG TẠM DỪNG" : "PHIÊN ĐANG DIỄN RA"}
              </span>
              <h1>{game}</h1>
              <p>
                {supportsQuestionSettings
                  ? `${difficulty} · ${questionCount} câu · `
                  : ""}
                {teams.length} đội
              </p>
            </div>
            <button
              className="button button-secondary fullscreen-button"
              onClick={toggleFullscreen}
              aria-label={
                classroomMode ? "Thoát toàn màn hình" : "Bật toàn màn hình"
              }
            >
              {classroomMode ? "↙ Thoát toàn màn hình" : "⛶ Toàn màn hình"}
            </button>
          </header>

          <div className="teacher-section-heading live-score-heading">
            <div>
              <span className="eyebrow">BẢNG ĐIỂM TRỰC TIẾP</span>
              <h2>
                {isPaused ? "Điểm đang được khóa" : "Cộng điểm cho các đội"}
              </h2>
            </div>
            <strong className="session-total">{totalScore} điểm xanh</strong>
          </div>
          <section className="team-admin-grid live-team-grid">
            {teams.map((team) => (
              <article className="team-admin-card" key={team.id}>
                <TeamCard
                  team={team}
                  onChange={(delta) => updateScore(team.id, delta)}
                  disabled={isPaused}
                />
              </article>
            ))}
          </section>

          <section
            className="teacher-live-controls"
            aria-label="Điều khiển phiên học"
          >
            <div className="teacher-primary-controls">
              <button
                className={`button ${isPaused ? "button-primary" : "button-secondary"}`}
                onClick={togglePause}
                aria-label={
                  isPaused ? "Tiếp tục phiên học" : "Tạm dừng phiên học"
                }
              >
                {isPaused ? "▶ Tiếp tục phiên" : "Ⅱ Tạm dừng"}
              </button>
              {isPaused ? (
                <button className="button button-primary" disabled>
                  Trò chơi đang tạm dừng
                </button>
              ) : (
                <Link
                  href={gameHref}
                  className="button button-primary"
                  onClick={persistBeforeLaunch}
                >
                  Mở trò chơi →
                </Link>
              )}
            </div>
            <div className="teacher-utility-controls">
              <button
                className="button button-secondary"
                aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
                aria-pressed={soundEnabled}
                onClick={() => {
                  setSoundEnabled((current) => !current);
                  setPendingAction(null);
                }}
              >
                {soundEnabled ? "🔊 Âm thanh" : "🔇 Đã tắt âm"}
              </button>
              <button
                className={`button ${pendingAction === "reset" ? "button-warning" : "button-secondary"}`}
                onClick={requestReset}
                aria-label="Đặt lại trò chơi và điểm"
              >
                {pendingAction === "reset"
                  ? "Bấm lại để reset"
                  : "↻ Reset game"}
              </button>
              <button
                className={`button ${pendingAction === "end" ? "button-danger" : "button-secondary"}`}
                onClick={requestEndSession}
                aria-label="Kết thúc phiên học"
              >
                {pendingAction === "end"
                  ? "Bấm lại để kết thúc"
                  : "Kết thúc phiên"}
              </button>
            </div>
          </section>
          {isPaused && (
            <div className="teacher-paused-note" role="status">
              ⏸ Phiên học đang tạm dừng. Điểm số và cấu hình đã được lưu.
            </div>
          )}
        </>
      )}

      {phase === "summary" && (
        <section className="teacher-summary" aria-labelledby="summary-title">
          <div className="summary-heading">
            <div>
              <span className="eyebrow">3 · TỔNG KẾT PHIÊN HỌC</span>
              <h1 id="summary-title">Cả lớp đã hoàn thành!</h1>
              <p>
                {game} · {teams.length} đội · {totalScore} điểm xanh
              </p>
            </div>
            <span className="summary-trophy" aria-hidden="true">
              🏆
            </span>
          </div>
          <div className="summary-ranking">
            {rankedTeams.map((team, index) => (
              <article
                className={`summary-team ${index === 0 ? "winner" : ""}`}
                key={team.id}
                style={{ "--team-color": team.color } as React.CSSProperties}
              >
                <span className="summary-rank">{index + 1}</span>
                <span className="summary-mascot">{team.mascot}</span>
                <strong>{team.name}</strong>
                <b>{team.score} điểm</b>
              </article>
            ))}
          </div>
          <div className="summary-actions">
            <button
              className="button button-secondary"
              onClick={toggleFullscreen}
              aria-label={
                classroomMode ? "Thoát toàn màn hình" : "Bật toàn màn hình"
              }
            >
              {classroomMode ? "↙ Thoát toàn màn hình" : "⛶ Toàn màn hình"}
            </button>
            <button
              className="button button-primary"
              onClick={prepareNewSession}
              aria-label="Chuẩn bị phiên học mới"
            >
              Chuẩn bị phiên mới →
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
