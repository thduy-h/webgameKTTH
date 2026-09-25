"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { GameHeader } from "@/components/GameHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultModal } from "@/components/ResultModal";
import {
  actionLabels,
  actions,
  detectiveScenarios,
} from "@/data/detectiveScenarios";
import type { EcoAction } from "@/data/detectiveScenarios";
import { soundManager } from "@/lib/game/sounds";
const actionIcons: Record<EcoAction, string> = {
  Reduce: "↓",
  Reuse: "🔁",
  Repair: "🔧",
  Share: "🤝",
  Recycle: "♻️",
  Dispose: "🗑️",
};
export default function DetectivePage() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<EcoAction | null>(null);
  const scenario = detectiveScenarios[index];
  const correct =
    selected && scenario ? scenario.best.includes(selected) : false;
  function choose(action: EcoAction) {
    if (selected) return;
    setSelected(action);
    if (scenario.best.includes(action)) {
      setScore((s) => s + 10);
      soundManager.playCorrect();
    } else soundManager.playWrong();
  }
  function next() {
    setSelected(null);
    setIndex((i) => i + 1);
  }
  function restart() {
    setIndex(0);
    setScore(0);
    setSelected(null);
  }
  return (
    <main className="game-page">
      <GameHeader
        title="Thám tử đồ vật"
        subtitle="Quan sát tình huống, chọn hành động xanh nhất!"
      />
      <section className="play-panel detective-panel">
        <div className="play-toolbar">
          <ProgressBar
            value={index + (selected ? 1 : 0)}
            max={detectiveScenarios.length}
            label="Vụ án đã giải"
          />
          <div className="score-pill">⭐ {score} điểm</div>
        </div>
        {scenario && (
          <motion.div
            key={scenario.id}
            className="case-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="case-object">
              <span>{scenario.icon}</span>
              <strong>{scenario.item}</strong>
              <small>HỒ SƠ #{String(index + 1).padStart(2, "0")}</small>
            </div>
            <div className="case-info">
              <span className="eyebrow">TÌNH TRẠNG</span>
              <h2>{scenario.condition}</h2>
              <h3>Bạn sẽ làm gì?</h3>
              <div className="action-grid">
                {actions.map((action) => (
                  <button
                    key={action}
                    aria-label={`Chọn ${actionLabels[action]} cho ${scenario.item}`}
                    className={`action-choice ${selected === action ? (correct ? "action-correct" : "action-wrong") : ""}`}
                    onClick={() => choose(action)}
                    disabled={Boolean(selected)}
                  >
                    <span aria-hidden="true">{actionIcons[action]}</span>
                    <b>{actionLabels[action]}</b>
                    <span className="action-en">{action}</span>
                    {selected === action && (
                      <small>
                        {correct ? "✓ Đúng rồi!" : "✕ Có cách tốt hơn"}
                      </small>
                    )}
                  </button>
                ))}
              </div>
              {selected && (
                <div
                  className={`case-feedback ${correct ? "good" : "try"}`}
                  role="status"
                >
                  <strong>
                    {correct
                      ? "🌟 Chính xác!"
                      : "💡 Chưa đúng rồi. Xem thử vì sao nhé."}
                  </strong>
                  <p>{scenario.explanation}</p>
                  {!correct && (
                    <p className="best-action">
                      Cách phù hợp:{" "}
                      {scenario.best
                        .map((action) => actionLabels[action])
                        .join(" hoặc ")}
                      .
                    </p>
                  )}
                  <button
                    className="button button-primary"
                    onClick={next}
                    aria-label={
                      index === detectiveScenarios.length - 1
                        ? "Xem kết quả"
                        : "Chuyển sang vụ tiếp theo"
                    }
                  >
                    {index === detectiveScenarios.length - 1
                      ? "Xem kết quả"
                      : "Vụ tiếp theo →"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </section>
      {index >= detectiveScenarios.length && (
        <ResultModal
          title="Vụ án xanh đã được phá!"
          score={score}
          message="Bạn đã tìm ra nhiều cách để đồ vật tiếp tục có ích."
          onRestart={restart}
        />
      )}
    </main>
  );
}
