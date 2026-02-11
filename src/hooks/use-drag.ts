"use client";

import { useCallback, useRef } from "react";

interface UseDragOptions {
  onDrag: (deltaX: number, deltaY: number) => void;
  onDragEnd?: () => void;
}

/**
 * Hook that returns a `startDrag` handler to attach to a draggable element.
 * Tracks pointer movement and calls `onDrag` with the delta from start.
 */
export function useDrag({ onDrag, onDragEnd }: UseDragOptions) {
  const startX = useRef(0);
  const startY = useRef(0);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const deltaX = e.clientX - startX.current;
      const deltaY = e.clientY - startY.current;
      onDrag(deltaX, deltaY);
    },
    [onDrag]
  );

  const handlePointerUp = useCallback(
    () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      onDragEnd?.();
    },
    [handlePointerMove, onDragEnd]
  );

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      startX.current = e.clientX;
      startY.current = e.clientY;

      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [handlePointerMove, handlePointerUp]
  );

  return { startDrag };
}
