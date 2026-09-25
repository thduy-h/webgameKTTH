"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GameHeader } from "@/components/GameHeader";
import { ScoreBoard } from "@/components/ScoreBoard";
import { Dice } from "@/components/Dice";
import { QuestionModal } from "@/components/QuestionModal";
import { ResultModal } from "@/components/ResultModal";
import { questions } from "@/data/questions";
import { boardTiles } from "@/data/boardTiles";
import { rollDice } from "@/lib/game/dice";
import { moveTeam, getTileEffect } from "@/lib/game/board";
import { calculateScore } from "@/lib/game/score";
import { getRandomQuestions, shuffleQuestionAnswers } from "@/lib/game/random";
import { soundManager } from "@/lib/game/sounds";
import {
  BOARD_SESSION_KEY,
  isPersistedTeam,
  isRecord,
  readVersionedStorage,
  TEACHER_SETTINGS_KEY,
  writeVersionedStorage,
} from "@/lib/game/persistence";
import type { Question, Team, TileType } from "@/types/game";

const teamColors = ["#ee7a4a", "#5aa3e6", "#9e78d6", "#41a981"];
const icons: Record<TileType, string> = {
  NORMAL: "🌱",
  QUESTION: "❓",
  BONUS: "⭐",
  REPAIR: "🔧",
  REUSE: "🔄",
  PENALTY: "🗑️",
};
const descriptions: Record<TileType, string> = {
  NORMAL: "Hành động tốt",
  QUESTION: "Câu hỏi",
  BONUS: "Thưởng",
  REPAIR: "Sửa chữa",
  REUSE: "Dùng lại",
  PENALTY: "Ôi!",
};
function initialTeams(count = 2): Team[] {
  return ["Rùa", "Gấu trúc", "Thỏ", "Cáo"].slice(0, count).map((name, i) => ({
    id: `team-${i}`,
    name: `Đội ${name}`,
    mascot: ["🐢", "🐼", "🐰", "🦊"][i],
    color: teamColors[i],
    position: 0,
    score: 0,
  }));
}

type BoardSession = {
  teams: Team[];
  turn: number;
  die: number;
  question: Question | null;
  selectedAnswer: number | null;
  questionPoints: number;
  winner: Team | null;
  message: string;
  extraTurn: boolean;
};

type TeacherTeams = { teams: Team[] };

function resetTeams(teams: Team[]): Team[] {
  return teams.map((team) => ({ ...team, position: 0, score: 0 }));
}

function isQuestion(value: unknown): value is Question {
  if (!isRecord(value) || !Array.isArray(value.answers)) return false;
  return (
    typeof value.id === "string" &&
    (value.type === "multiple-choice" || value.type === "true-false") &&
    typeof value.question === "string" &&
    value.answers.length >= 2 &&
    value.answers.every((answer) => typeof answer === "string") &&
    Number.isInteger(value.correctAnswer) &&
    Number(value.correctAnswer) >= 0 &&
    Number(value.correctAnswer) < value.answers.length &&
    typeof value.explanation === "string" &&
    [1, 2, 3].includes(Number(value.difficulty)) &&
    [
      "reduce",
      "reuse",
      "repair",
      "share",
      "recycle",
      "waste",
      "food",
      "general",
    ].includes(String(value.topic))
  );
}

function isTeacherTeams(value: unknown): value is TeacherTeams {
  return (
    isRecord(value) &&
    Array.isArray(value.teams) &&
    value.teams.length >= 2 &&
    value.teams.length <= 4 &&
    value.teams.every(isPersistedTeam)
  );
}

function isBoardSession(value: unknown): value is BoardSession {
  if (
    !isRecord(value) ||
    !Array.isArray(value.teams) ||
    value.teams.length < 2 ||
    value.teams.length > 4 ||
    !value.teams.every(isPersistedTeam)
  ) {
    return false;
  }
  const teams = value.teams.filter(isPersistedTeam);
  const questionValid = value.question === null || isQuestion(value.question);
  const winnerValid = value.winner === null || isPersistedTeam(value.winner);
  const selectedAnswerValid =
    value.selectedAnswer === null ||
    (Number.isInteger(value.selectedAnswer) &&
      value.question !== null &&
      isQuestion(value.question) &&
      Number(value.selectedAnswer) >= 0 &&
      Number(value.selectedAnswer) < value.question.answers.length);

  return (
    teams.every(
      (team) =>
        Number.isInteger(team.position) &&
        team.position >= 0 &&
        team.position < boardTiles.length,
    ) &&
    new Set(teams.map((team) => team.id)).size === teams.length &&
    Number.isInteger(value.turn) &&
    Number(value.turn) >= 0 &&
    Number(value.turn) < teams.length &&
    Number.isInteger(value.die) &&
    Number(value.die) >= 1 &&
    Number(value.die) <= 6 &&
    questionValid &&
    selectedAnswerValid &&
    (value.questionPoints === 10 || value.questionPoints === 20) &&
    winnerValid &&
    typeof value.message === "string" &&
    typeof value.extraTurn === "boolean"
  );
}

export default function BoardPage() {
  const [teams, setTeams] = useState(initialTeams);
  const [turn, setTurn] = useState(0);
  const [die, setDie] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionPoints, setQuestionPoints] = useState(10);
  const [winner, setWinner] = useState<Team | null>(null);
  const [message, setMessage] = useState("Đến lượt đội đầu tiên!");
  const [extraTurn, setExtraTurn] = useState(false);
  const [persistenceReady, setPersistenceReady] = useState(false);
  const turnLock = useRef(false);
  const active = teams[turn];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readVersionedStorage(BOARD_SESSION_KEY, isBoardSession);
      if (saved) {
        setTeams(saved.teams);
        setTurn(saved.turn);
        setDie(saved.die);
        setQuestion(saved.question);
        setSelectedAnswer(saved.selectedAnswer);
        setQuestionPoints(saved.questionPoints);
        setWinner(saved.winner);
        setMessage(saved.message);
        setExtraTurn(saved.extraTurn);
      } else {
        const teacher = readVersionedStorage(
          TEACHER_SETTINGS_KEY,
          isTeacherTeams,
        );
        if (teacher) setTeams(resetTeams(teacher.teams));
      }
      setRolling(false);
      turnLock.current = false;
      setPersistenceReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!persistenceReady) return;
    writeVersionedStorage<BoardSession>(BOARD_SESSION_KEY, {
      teams,
      turn,
      die,
      question,
      selectedAnswer,
      questionPoints,
      winner,
      message,
      extraTurn,
    });
  }, [
    teams,
    turn,
    die,
    question,
    selectedAnswer,
    questionPoints,
    winner,
    message,
    extraTurn,
    persistenceReady,
  ]);

  function endTurn() {
    setTurn((t) => (t + 1) % teams.length);
  }
  function takeTurn() {
    if (turnLock.current || rolling || question || winner) return;
    turnLock.current = true;
    setExtraTurn(false);
    setRolling(true);
    soundManager.playDice();
    const value = rollDice();
    setDie(value);
    window.setTimeout(() => {
      const next = moveTeam(active, value);
      const tile = boardTiles[next.position];
      setTeams((current) =>
        current.map((team, i) => (i === turn ? next : team)),
      );
      turnLock.current = false;
      setRolling(false);
      if (next.position >= boardTiles.length - 1) {
        setWinner(next);
        return;
      }
      soundManager.playMove();
      if (tile === "QUESTION" || tile === "BONUS") {
        const nextQuestion = getRandomQuestions(questions, 1)[0];
        if (!nextQuestion) {
          setMessage(
            "Tí Xanh chưa tìm thấy câu hỏi. Chuyển sang lượt tiếp theo!",
          );
          endTurn();
          return;
        }
        setQuestion(shuffleQuestionAnswers(nextQuestion));
        setSelectedAnswer(null);
        setQuestionPoints(getTileEffect(tile) || 10);
        if (tile === "BONUS") {
          window.setTimeout(() => soundManager.playBonus(), 160);
        }
        setMessage(
          tile === "BONUS"
            ? "Ô thưởng! Trả lời đúng được 20 điểm!"
            : "Trả lời đúng được 10 điểm!",
        );
      } else if (tile === "PENALTY") {
        setTeams((current) =>
          current.map((team, i) =>
            i === turn
              ? { ...team, position: Math.max(0, team.position - 1) }
              : team,
          ),
        );
        setMessage("Ôi! Lùi lại một ô. Cố lên nhé!");
        endTurn();
      } else if (tile === "REUSE") {
        setTeams((current) =>
          current.map((team, i) =>
            i === turn
              ? { ...team, position: Math.min(team.position + 1, 29) }
              : team,
          ),
        );
        setMessage("Dùng lại thật hay! Tiến thêm một ô!");
        endTurn();
      } else if (tile === "REPAIR") {
        window.setTimeout(() => soundManager.playBonus(), 160);
        setExtraTurn(true);
        setMessage("Sửa chữa thật tốt! Đội bạn được tung thêm lượt.");
      } else {
        setMessage(`${active.name} đã đi ${value} ô. Lượt tiếp theo!`);
        endTurn();
      }
    }, 620);
  }
  function chooseAnswer(index: number) {
    if (!question || selectedAnswer !== null) return;
    const ok = index === question.correctAnswer;
    setSelectedAnswer(index);
    setTeams((current) =>
      current.map((team, i) =>
        i === turn && ok
          ? { ...team, score: calculateScore(team.score, questionPoints) }
          : team,
      ),
    );
    if (ok) soundManager.playCorrect();
    else soundManager.playWrong();
  }
  function continueGame() {
    const wasCorrect =
      question !== null && selectedAnswer === question.correctAnswer;
    setQuestion(null);
    setSelectedAnswer(null);
    setMessage(
      wasCorrect
        ? `Chính xác! ${active.name} nhận ${questionPoints} điểm.`
        : "Chưa đúng rồi. Xem lời giải và thử tiếp ở lượt sau nhé.",
    );
    endTurn();
  }
  function restart() {
    setTeams((current) => resetTeams(current));
    setTurn(0);
    setDie(1);
    setWinner(null);
    setQuestion(null);
    setSelectedAnswer(null);
    setExtraTurn(false);
    turnLock.current = false;
    setMessage("Đến lượt đội đầu tiên!");
  }
  const boardCells = [...boardTiles].map((type, i) => ({ type, position: i }));
  return (
    <main className="game-page board-game">
      <GameHeader
        title="Đường đua tuần hoàn"
        subtitle="Lăn xúc xắc, cùng đồng đội đưa Trái Đất về đích!"
      />
      <div className="board-toolbar">
        <div className="board-teams">
          <ScoreBoard teams={teams} activeId={active?.id} />
          <label className="team-count-control">
            Đội{" "}
            <select
              aria-label="Số đội chơi"
              value={teams.length}
              disabled={rolling || Boolean(question)}
              onChange={(event) => {
                const nextCount = Number(event.target.value);
                setTeams((current) => {
                  const defaults = initialTeams(nextCount);
                  return defaults.map((team, index) => ({
                    ...(current[index] ?? team),
                    position: 0,
                    score: 0,
                  }));
                });
                setTurn(0);
                setDie(1);
                setWinner(null);
                setQuestion(null);
                setSelectedAnswer(null);
                setExtraTurn(false);
                turnLock.current = false;
                setMessage("Đến lượt đội đầu tiên!");
              }}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </label>
        </div>
        <div className="turn-pill" aria-live="polite">
          <span>Lượt của</span> <strong>{active?.name}</strong>
        </div>
      </div>
      <section className="board-layout">
        <div className="board-grid" aria-label="Bàn chơi gồm 30 ô">
          {boardCells.map(({ type, position }) => {
            const row = position < 10 ? 3 : position < 20 ? 2 : 1;
            const col =
              position < 10
                ? position + 1
                : position < 20
                  ? 20 - position
                  : position - 19;
            return (
              <div
                className={`board-tile tile-${type.toLowerCase()} ${position === 0 ? "start-tile" : ""} ${position === 29 ? "finish-tile" : ""}`}
                style={{ gridRow: row, gridColumn: col }}
                key={position}
              >
                <span className="tile-number">
                  {position === 0 ? "GO" : position === 29 ? "🏁" : position}
                </span>
                <span className="tile-symbol">{icons[type]}</span>
                <small>
                  {position === 0
                    ? "START"
                    : position === 29
                      ? "ĐÍCH"
                      : descriptions[type]}
                </small>
                {teams
                  .filter((team) => team.position === position)
                  .map((team) => (
                    <motion.span
                      key={team.id}
                      layout
                      className="team-token"
                      style={{ background: team.color }}
                      aria-label={team.name}
                    >
                      {team.mascot}
                    </motion.span>
                  ))}
              </div>
            );
          })}
        </div>
        <aside className="board-side">
          <div className="board-message" role="status" aria-live="polite">
            <span className="message-mascot">🐢</span>
            <p>{message}</p>
          </div>
          <div className="dice-area">
            <Dice value={die} rolling={rolling} />
            <button
              className="button button-primary roll-button"
              onClick={takeTurn}
              disabled={rolling || Boolean(question) || Boolean(winner)}
              aria-label={
                extraTurn ? "Tung xúc xắc cho lượt thêm" : "Tung xúc xắc"
              }
            >
              {rolling
                ? "Đang tung…"
                : extraTurn
                  ? "Tung thêm lượt!"
                  : "Tung xúc xắc"}
              <span aria-hidden="true">🎲</span>
            </button>
            <small>Mỗi ô là một điều xanh mới!</small>
          </div>
          <div className="legend">
            <b>Chú giải</b>
            <span>
              ❓ Câu hỏi <em>+10</em>
            </span>
            <span>
              ⭐ Thưởng <em>+20</em>
            </span>
            <span>
              🔧 Sửa chữa <em>thêm lượt</em>
            </span>
            <span>
              🔄 Dùng lại <em>tiến 1</em>
            </span>
            <span>
              🗑️ Chưa tốt <em>lùi 1</em>
            </span>
          </div>
        </aside>
      </section>
      <QuestionModal
        question={question}
        selectedAnswer={selectedAnswer}
        onAnswer={chooseAnswer}
        onContinue={continueGame}
        rewardPoints={questionPoints}
      />
      {winner && (
        <ResultModal
          title={`${winner.name} đã về đích!`}
          score={winner.score}
          message="Cả lớp cùng tạo nên một vòng tuần hoàn xanh!"
          onRestart={restart}
        />
      )}
    </main>
  );
}
