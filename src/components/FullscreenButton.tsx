"use client";

import { useEffect, useState } from "react";

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fallbackActive, setFallbackActive] = useState(false);
  const active = isFullscreen || fallbackActive;

  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("game-fullscreen-active", active);
    return () => document.body.classList.remove("game-fullscreen-active");
  }, [active]);

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (fallbackActive) {
      setFallbackActive(false);
      return;
    }
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      setFallbackActive(true);
    }
  }

  return (
    <button
      className="game-fullscreen-button"
      onClick={toggleFullscreen}
      aria-label={active ? "Thoát toàn màn hình" : "Chơi toàn màn hình"}
    >
      <span aria-hidden="true">{active ? "↙" : "⛶"}</span>
      {active ? "Thoát toàn màn hình" : "Toàn màn hình"}
    </button>
  );
}
