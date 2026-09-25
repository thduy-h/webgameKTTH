"use client";
import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Mascot } from "@/components/Mascot";
import { soundManager } from "@/lib/game/sounds";
export function ResultModal({
  title,
  score,
  message,
  onRestart,
}: {
  title: string;
  score: number;
  message: string;
  onRestart: () => void;
}) {
  useEffect(() => {
    soundManager.playWin();
  }, []);

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.section
        className="result-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        initial={{ y: 25, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
      >
        <Mascot size={84} />
        <span className="eyebrow">HOÀN THÀNH</span>
        <h2 id="result-title">{title}</h2>
        <p>{message}</p>
        <div className="result-score">
          {score} <small>điểm</small>
        </div>
        <div className="result-actions">
          <button
            className="button button-primary"
            onClick={onRestart}
            aria-label="Chơi lại từ đầu"
            autoFocus
          >
            Chơi lại
          </button>
          <Link className="button button-secondary" href="/games">
            Chọn trò chơi
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
}
