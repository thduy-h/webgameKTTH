"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { GameHeader } from "@/components/GameHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultModal } from "@/components/ResultModal";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { sortingCategories, sortingItems } from "@/data/sortingItems";
import { shuffleArray } from "@/lib/game/random";
import { dropTargetKeyboardCoordinates } from "@/lib/game/keyboardCoordinates";
import { useClientShuffle } from "@/lib/game/useClientShuffle";
import { soundManager } from "@/lib/game/sounds";

function ItemCard({
  id,
  icon,
  name,
  category,
}: {
  id: string;
  icon: string;
  name: string;
  category: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, data: { targetId: category } });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      aria-label={`Kéo ${name} vào nhóm phù hợp`}
      className={`sort-item ${isDragging ? "dragging" : ""}`}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
    >
      <span aria-hidden="true">{icon}</span>
      {name}
    </button>
  );
}
function Bin({ category, count }: { category: string; count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: category });
  return (
    <div ref={setNodeRef} className={`sort-bin ${isOver ? "is-over" : ""}`}>
      <div className="bin-icon">
        {category === "Hữu cơ"
          ? "🍃"
          : category === "Tái chế"
            ? "♻️"
            : category === "Thu gom riêng"
              ? "🔋"
              : category === "Tái sử dụng"
                ? "🔁"
                : "🗑️"}
      </div>
      <strong>{category}</strong>
      <span>{count} món đúng chỗ</span>
    </div>
  );
}
export default function SortingPage() {
  const initialItems = useClientShuffle(sortingItems, "sorting-items");
  const [roundItems, setRoundItems] = useState<typeof sortingItems | null>(
    null,
  );
  const items = roundItems ?? initialItems;
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [wrongId, setWrongId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: dropTargetKeyboardCoordinates,
    }),
  );
  function handleDrop(event: DragEndEvent) {
    if (!event.over) return;
    const item = items.find((entry) => entry.id === event.active.id);
    if (!item || placed[item.id]) return;
    if (item.category === event.over.id) {
      setPlaced((current) => ({
        ...current,
        [item.id]: String(event.over?.id),
      }));
      setScore((current) => current + 10);
      setCombo((current) => current + 1);
      const nextCombo = combo + 1;
      const finishesGame = Object.keys(placed).length + 1 === items.length;
      if (!finishesGame) {
        if (nextCombo === 3) soundManager.playCombo();
        else if (nextCombo === 5) soundManager.playBonus();
        else soundManager.playCorrect();
      }
      setFeedback(
        nextCombo >= 5
          ? "🏆 ECO MASTER!"
          : nextCombo >= 3
            ? `🔥 COMBO x${nextCombo}`
            : "✨ Chính xác!",
      );
    } else {
      setCombo(0);
      setWrongId(item.id);
      setFeedback("Chưa đúng rồi. Hãy đọc tên nhóm và thử lại nhé.");
      soundManager.playWrong();
      window.setTimeout(() => setWrongId(null), 500);
    }
  }
  const remaining = items.filter((item) => !placed[item.id]);
  function restart() {
    setPlaced({});
    setScore(0);
    setCombo(0);
    setFeedback("");
    setWrongId(null);
    setRoundItems(shuffleArray(sortingItems));
  }
  return (
    <main className="game-page">
      <GameHeader
        title="Siêu nhân phân loại"
        subtitle="Kéo mỗi món đồ vào đúng nhóm của mình!"
      />
      <section className="play-panel">
        <div className="play-toolbar">
          <ProgressBar
            value={Object.keys(placed).length}
            max={items.length}
            label="Đã phân loại"
          />
          <ScoreDisplay score={score} />
        </div>
        <div className="combo-line" role="status" aria-live="polite">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={feedback || "hint"}
              initial={{ opacity: 0, y: 5, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
            >
              {feedback || "Mỗi lần đúng được 10 điểm. Cùng cố gắng nhé!"}
            </motion.span>
          </AnimatePresence>
        </div>
        <DndContext
          id="sorting-game-dnd"
          sensors={sensors}
          onDragEnd={handleDrop}
        >
          <div className="sorting-layout">
            <section className="sort-items-panel">
              <h2>
                🧺 Vật phẩm còn lại <small>{remaining.length}</small>
              </h2>
              <div className="sort-items">
                {remaining.map((item) => (
                  <div
                    key={item.id}
                    className={wrongId === item.id ? "shake" : ""}
                  >
                    <ItemCard
                      id={item.id}
                      icon={item.icon}
                      name={item.name}
                      category={item.category}
                    />
                  </div>
                ))}
              </div>
            </section>
            <section className="sort-bins-panel">
              <h2>🗂️ Các nhóm</h2>
              <div className="sort-bins">
                {sortingCategories.map((category) => (
                  <Bin
                    key={category}
                    category={category}
                    count={
                      Object.values(placed).filter(
                        (value) => value === category,
                      ).length
                    }
                  />
                ))}
              </div>
            </section>
          </div>
        </DndContext>
      </section>
      {remaining.length === 0 && (
        <ResultModal
          title="Siêu nhân xanh hoàn thành nhiệm vụ!"
          score={score}
          message="Bạn đã giúp các món đồ tìm được nơi phù hợp."
          onRestart={restart}
        />
      )}
    </main>
  );
}
