import type { KeyboardCoordinateGetter } from "@dnd-kit/core";

const arrowCodes = new Set(["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp"]);

/** Move keyboard drags between the centers of real drop targets. */
export const dropTargetKeyboardCoordinates: KeyboardCoordinateGetter = (
  event,
  { context },
) => {
  if (!arrowCodes.has(event.code)) return undefined;
  event.preventDefault();

  const current = context.collisionRect;
  if (!current) return undefined;

  const currentX = current.left + current.width / 2;
  const currentY = current.top + current.height / 2;
  const activeData = context.active?.data.current as
    { targetId?: string } | undefined;
  const targetId = activeData?.targetId;
  const horizontal = event.code === "ArrowLeft" || event.code === "ArrowRight";

  if (horizontal && targetId) {
    const targetRect = context.droppableRects.get(targetId);
    if (targetRect) {
      const targetX = targetRect.left + targetRect.width / 2;
      const pointsTowardTarget =
        (event.code === "ArrowLeft" && targetX < currentX) ||
        (event.code === "ArrowRight" && targetX > currentX);
      if (pointsTowardTarget) {
        return { x: targetRect.left, y: targetRect.top };
      }
    }
  }

  const candidates: Array<{
    left: number;
    top: number;
    width: number;
    height: number;
  }> = [];

  context.droppableContainers.getEnabled().forEach((container) => {
    const rect = context.droppableRects.get(container.id);
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const isInDirection =
      (event.code === "ArrowLeft" && centerX < currentX - 1) ||
      (event.code === "ArrowRight" && centerX > currentX + 1) ||
      (event.code === "ArrowUp" && centerY < currentY - 1) ||
      (event.code === "ArrowDown" && centerY > currentY + 1);
    if (isInDirection) candidates.push(rect);
  });

  const target = candidates.sort((a, b) => {
    const aX = a.left + a.width / 2;
    const aY = a.top + a.height / 2;
    const bX = b.left + b.width / 2;
    const bY = b.top + b.height / 2;
    const aScore = horizontal
      ? Math.abs(aY - currentY) * 10 + Math.abs(aX - currentX)
      : Math.abs(aX - currentX) * 10 + Math.abs(aY - currentY);
    const bScore = horizontal
      ? Math.abs(bY - currentY) * 10 + Math.abs(bX - currentX)
      : Math.abs(bX - currentX) * 10 + Math.abs(bY - currentY);
    return aScore - bScore;
  })[0];

  return target ? { x: target.left, y: target.top } : undefined;
};
