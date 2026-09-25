"use client";
import { useState } from "react";
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
import { matchingPairs } from "@/data/matchingCards";
import { shuffleArray } from "@/lib/game/random";
import { dropTargetKeyboardCoordinates } from "@/lib/game/keyboardCoordinates";
import { useClientShuffle } from "@/lib/game/useClientShuffle";
import { soundManager } from "@/lib/game/sounds";

function MatchingCard({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, data: { targetId: id } });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      aria-label={`Kéo định nghĩa: ${String(children)}`}
      className={`matching-card draggable ${isDragging ? "dragging" : ""}`}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
    >
      {children}
      <span aria-hidden="true">⠿</span>
    </button>
  );
}
function DropZone({
  id,
  children,
  complete,
}: {
  id: string;
  children: React.ReactNode;
  complete: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`matching-card drop-zone ${isOver ? "is-over" : ""} ${complete ? "matched" : ""}`}
    >
      {children}
      <span aria-hidden="true">{complete ? "✓" : "＋"}</span>
    </div>
  );
}

export function MatchingGame() {
  const initialPairOrder = useClientShuffle(matchingPairs, "matching-terms");
  const initialDefinitions = useClientShuffle(
    matchingPairs,
    "matching-definitions",
  );
  const [roundPairOrder, setRoundPairOrder] = useState<
    typeof matchingPairs | null
  >(null);
  const [roundDefinitions, setRoundDefinitions] = useState<
    typeof matchingPairs | null
  >(null);
  const pairOrder = roundPairOrder ?? initialPairOrder;
  const definitions = roundDefinitions ?? initialDefinitions;
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: dropTargetKeyboardCoordinates,
    }),
  );
  const complete = matched.length === matchingPairs.length;
  const batchSize = 6;
  const batchIndex = Math.floor(matched.length / batchSize);
  const currentBatch = pairOrder.slice(
    batchIndex * batchSize,
    (batchIndex + 1) * batchSize,
  );
  const batchIds = new Set(currentBatch.map((pair) => pair.id));
  function onDragEnd(event: DragEndEvent) {
    if (!event.over) return;
    const pairId = String(event.active.id);
    const targetId = String(event.over.id);
    if (pairId === targetId) {
      const finishesGame = matched.length + 1 === matchingPairs.length;
      setMatched((current) => [...current, pairId]);
      setScore((s) => s + 10);
      if (!finishesGame) soundManager.playCorrect();
    } else {
      setWrong(targetId);
      soundManager.playWrong();
      window.setTimeout(() => setWrong(null), 500);
    }
  }
  function restart() {
    setMatched([]);
    setScore(0);
    setWrong(null);
    setRoundPairOrder(shuffleArray(matchingPairs));
    setRoundDefinitions(shuffleArray(matchingPairs));
  }
  return (
    <main className="game-page">
      <GameHeader
        title="Ghép thẻ thần tốc"
        subtitle="Kéo định nghĩa vào đúng khái niệm nhé!"
      />
      <section className="play-panel">
        <div className="play-toolbar">
          <ProgressBar
            value={matched.length}
            max={matchingPairs.length}
            label="Cặp đã ghép"
          />
          <ScoreDisplay score={score} />
        </div>
        <DndContext
          id="matching-game-dnd"
          sensors={sensors}
          onDragEnd={onDragEnd}
        >
          <div className="matched-summary" role="status">
            <span aria-hidden="true">✓</span>
            {matched.length === 0
              ? "Chặng 1/2 · Ghép đúng, cặp thẻ sẽ rời khỏi bàn."
              : `Chặng ${Math.min(2, batchIndex + 1)}/2 · ${matched.length} cặp đã hoàn thành · Còn ${matchingPairs.length - matched.length} cặp`}
          </div>
          <div className="matching-board">
            <div className="match-column">
              <h2>💭 Khái niệm</h2>
              {pairOrder
                .filter((pair) => batchIds.has(pair.id))
                .filter((pair) => !matched.includes(pair.id))
                .map((pair) => (
                  <div className="match-row" key={pair.id}>
                    <DropZone id={pair.id} complete={false}>
                      {pair.term}
                    </DropZone>
                    {wrong === pair.id && (
                      <span className="wrong-bump" aria-label="Chưa đúng">
                        Thử lại nhé
                      </span>
                    )}
                  </div>
                ))}
            </div>
            <div className="match-column definitions-column">
              <h2>
                🧩 Định nghĩa <small>Kéo thẻ sang trái</small>
              </h2>
              {definitions
                .filter((pair) => batchIds.has(pair.id))
                .filter((pair) => !matched.includes(pair.id))
                .map((pair) => (
                  <MatchingCard key={pair.id} id={pair.id}>
                    {pair.definition}
                  </MatchingCard>
                ))}
            </div>
          </div>
        </DndContext>
        <div className="game-hint">
          💡 Ghép đúng được <b>10 điểm</b>. Ghép sai thì thử lại, không mất
          điểm!
        </div>
      </section>
      {complete && (
        <ResultModal
          title="Thẻ nào cũng đã về đúng chỗ!"
          score={score}
          message="Bạn đã nối các ý tưởng xanh thật chuẩn."
          onRestart={restart}
        />
      )}
    </main>
  );
}
