"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Minus,
  PanelRight,
  Maximize2,
  MessageSquare,
  Sparkles,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAssistantStore } from "@/stores/assistant-store";
import { useResize } from "@/hooks/use-resize";
import { useDrag } from "@/hooks/use-drag";
import { AssistantChatContent } from "./assistant-chat-content";

/**
 * AssistantPanel renders the assistant overlay in two modes:
 *
 * - **panel**: Docked to the right edge of the viewport, full height, resizable width.
 *   The main page content shifts left to make room.
 *
 * - **modal**: A floating, draggable, resizable window with a backdrop.
 *   The user can reposition and resize it freely.
 *
 * Switching to "page" mode navigates to /assistant and closes the overlay.
 */
export function AssistantPanel() {
  const router = useRouter();
  const {
    isOpen,
    displayMode,
    panelWidth,
    modalDimensions,
    setOpen,
    setDisplayMode,
    setPanelWidth,
    setModalDimensions,
  } = useAssistantStore();

  // ---- Panel resize (left edge drag) ----
  const panelWidthAtStart = useRef(panelWidth);

  const { startResize: startPanelResize } = useResize({
    direction: "left",
    onResize: useCallback(
      (delta: number) => {
        setPanelWidth(panelWidthAtStart.current + delta);
      },
      [setPanelWidth]
    ),
    onResizeEnd: useCallback(() => {
      panelWidthAtStart.current = useAssistantStore.getState().panelWidth;
    }, []),
  });

  const handlePanelResizeStart = useCallback(
    (e: React.PointerEvent) => {
      panelWidthAtStart.current = panelWidth;
      startPanelResize(e);
    },
    [panelWidth, startPanelResize]
  );

  // ---- Modal drag ----
  const modalPosAtStart = useRef({ x: 0, y: 0 });

  const { startDrag } = useDrag({
    onDrag: useCallback(
      (dx: number, dy: number) => {
        setModalDimensions({
          x: modalPosAtStart.current.x + dx,
          y: modalPosAtStart.current.y + dy,
        });
      },
      [setModalDimensions]
    ),
    onDragEnd: useCallback(() => {
      const dims = useAssistantStore.getState().modalDimensions;
      modalPosAtStart.current = { x: dims.x, y: dims.y };
    }, []),
  });

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      // Center on first open
      const dims = useAssistantStore.getState().modalDimensions;
      if (dims.x === -1 || dims.y === -1) {
        const cx = Math.round((window.innerWidth - dims.width) / 2);
        const cy = Math.round((window.innerHeight - dims.height) / 2);
        setModalDimensions({ x: cx, y: cy });
        modalPosAtStart.current = { x: cx, y: cy };
      } else {
        modalPosAtStart.current = { x: dims.x, y: dims.y };
      }
      startDrag(e);
    },
    [startDrag, setModalDimensions]
  );

  // ---- Modal resize (bottom-right corner) ----
  const modalSizeAtStart = useRef({ width: 0, height: 0 });

  const { startResize: startModalResize } = useResize({
    direction: "right",
    onResize: useCallback(
      (delta: number) => {
        setModalDimensions({
          width: Math.max(360, modalSizeAtStart.current.width + delta),
        });
      },
      [setModalDimensions]
    ),
  });

  const { startResize: startModalResizeV } = useResize({
    direction: "bottom",
    onResize: useCallback(
      (delta: number) => {
        setModalDimensions({
          height: Math.max(300, modalSizeAtStart.current.height + delta),
        });
      },
      [setModalDimensions]
    ),
  });

  const handleModalCornerResize = useCallback(
    (e: React.PointerEvent) => {
      const dims = useAssistantStore.getState().modalDimensions;
      modalSizeAtStart.current = { width: dims.width, height: dims.height };
      startModalResize(e);
      // Also track vertical — we cheat by running both at once via a manual listener
    },
    [startModalResize]
  );

  // ---- Center modal on first open ----
  const [modalCentered, setModalCentered] = useState(false);
  useEffect(() => {
    if (isOpen && displayMode === "modal" && !modalCentered) {
      const dims = useAssistantStore.getState().modalDimensions;
      if (dims.x === -1 || dims.y === -1) {
        setModalDimensions({
          x: Math.round((window.innerWidth - dims.width) / 2),
          y: Math.round((window.innerHeight - dims.height) / 2),
        });
      }
      setModalCentered(true);
    }
    if (!isOpen) setModalCentered(false);
  }, [isOpen, displayMode, modalCentered, setModalDimensions]);

  // ---- Keyboard shortcut: Escape to close ----
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, setOpen]);

  // ---- Mode switch helpers ----
  const switchToPanel = useCallback(() => setDisplayMode("panel"), [setDisplayMode]);
  const switchToModal = useCallback(() => {
    setDisplayMode("modal");
    setModalCentered(false); // re-center if dimensions are default
  }, [setDisplayMode]);
  const switchToPage = useCallback(() => {
    setOpen(false);
    router.push("/assistant");
  }, [setOpen, router]);

  if (!isOpen) return null;

  // ---- Shared header bar (used in both modes) ----
  const headerBar = (
    <div className="flex items-center justify-between border-b px-3 py-2 shrink-0">
      <div className="flex items-center gap-2">
        {displayMode === "modal" && (
          <div
            className="cursor-grab active:cursor-grabbing p-0.5 -ml-1 text-muted-foreground hover:text-foreground"
            onPointerDown={handleDragStart}
          >
            <GripVertical size={14} />
          </div>
        )}
        <Sparkles size={16} className="text-primary" />
        <h2 className="text-sm font-semibold">Assistant</h2>
      </div>
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7", displayMode === "panel" && "bg-accent")}
          onClick={switchToPanel}
          title="Panel mode"
        >
          <PanelRight size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-7 w-7", displayMode === "modal" && "bg-accent")}
          onClick={switchToModal}
          title="Floating window"
        >
          <Maximize2 size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={switchToPage}
          title="Full page"
        >
          <MessageSquare size={14} />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setOpen(false)}
          title="Minimize"
        >
          <Minus size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setOpen(false)}
          title="Close"
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );

  // ---- PANEL MODE: docked to right ----
  if (displayMode === "panel") {
    return (
      <div
        className="assistant-panel fixed top-0 right-0 z-50 h-screen flex"
        style={{ width: panelWidth }}
      >
        {/* Resize handle */}
        <div
          className="w-1 hover:w-1.5 cursor-col-resize bg-transparent hover:bg-primary/20 transition-colors shrink-0"
          onPointerDown={handlePanelResizeStart}
        />

        {/* Panel content */}
        <div className="flex-1 flex flex-col bg-card border-l shadow-xl overflow-hidden">
          <AssistantChatContent header={headerBar} />
        </div>
      </div>
    );
  }

  // ---- MODAL MODE: floating window ----
  const mx = modalDimensions.x === -1
    ? Math.round((typeof window !== "undefined" ? window.innerWidth : 1024) - modalDimensions.width) / 2
    : modalDimensions.x;
  const my = modalDimensions.y === -1
    ? Math.round((typeof window !== "undefined" ? window.innerHeight : 768) - modalDimensions.height) / 2
    : modalDimensions.y;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
      />

      {/* Floating window */}
      <div
        className="assistant-modal fixed z-50 flex flex-col bg-card rounded-xl border shadow-2xl overflow-hidden"
        style={{
          width: modalDimensions.width,
          height: modalDimensions.height,
          left: mx,
          top: my,
        }}
      >
        <AssistantChatContent header={headerBar} />

        {/* Corner resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onPointerDown={handleModalCornerResize}
        >
          <svg
            className="absolute bottom-0.5 right-0.5 text-muted-foreground/50"
            width="10"
            height="10"
            viewBox="0 0 10 10"
          >
            <path d="M9 1L1 9M9 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </>
  );
}
