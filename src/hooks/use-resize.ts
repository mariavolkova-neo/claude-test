"use client";

import { useCallback, useRef } from "react";

interface UseResizeOptions {
  direction: "left" | "right" | "top" | "bottom";
  onResize: (delta: number) => void;
  onResizeEnd?: () => void;
}

/**
 * Hook that returns a `startResize` handler to attach to a drag handle.
 * It tracks pointer movement in the specified direction and calls `onResize`
 * with the signed delta from the drag start point.
 */
export function useResize({ direction, onResize, onResizeEnd }: UseResizeOptions) {
  const startPos = useRef(0);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const isHorizontal = direction === "left" || direction === "right";
      const current = isHorizontal ? e.clientX : e.clientY;
      const delta = current - startPos.current;

      // For "left" and "top" handles, dragging in the negative direction should grow
      const signedDelta =
        direction === "left" || direction === "top" ? -delta : delta;

      onResize(signedDelta);
    },
    [direction, onResize]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      onResizeEnd?.();
    },
    [handlePointerMove, onResizeEnd]
  );

  const startResize = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const isHorizontal = direction === "left" || direction === "right";
      startPos.current = isHorizontal ? e.clientX : e.clientY;

      document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [direction, handlePointerMove, handlePointerUp]
  );

  return { startResize };
}
