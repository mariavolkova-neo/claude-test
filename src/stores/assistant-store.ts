import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chat, DisplayMode, Project, Command } from "@/types/assistant";

interface PanelDimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface AssistantState {
  isOpen: boolean;
  displayMode: DisplayMode;
  activeChat: Chat | null;
  chats: Chat[];
  projects: Project[];
  commands: Command[];

  /** Panel dimensions for "panel" mode (right-side dock) */
  panelWidth: number;

  /** Modal dimensions for "modal" mode (floating window) */
  modalDimensions: PanelDimensions;

  setOpen: (open: boolean) => void;
  toggle: () => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setActiveChat: (chat: Chat | null) => void;
  addChat: (chat: Chat) => void;
  removeChat: (chatId: string) => void;
  setPanelWidth: (width: number) => void;
  setModalDimensions: (dims: Partial<PanelDimensions>) => void;
}

const DEFAULT_PANEL_WIDTH = 420;
const DEFAULT_MODAL_DIMENSIONS: PanelDimensions = {
  width: 480,
  height: 600,
  x: -1, // -1 signals "center on first open"
  y: -1,
};

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set) => ({
      isOpen: false,
      displayMode: "panel",
      activeChat: null,
      chats: [],
      projects: [],
      commands: [],
      panelWidth: DEFAULT_PANEL_WIDTH,
      modalDimensions: DEFAULT_MODAL_DIMENSIONS,

      setOpen: (open) => set({ isOpen: open }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setDisplayMode: (mode) => set({ displayMode: mode }),
      setActiveChat: (chat) => set({ activeChat: chat }),

      addChat: (chat) =>
        set((state) => ({ chats: [chat, ...state.chats] })),

      removeChat: (chatId) =>
        set((state) => ({
          chats: state.chats.filter((c) => c.id !== chatId),
        })),

      setPanelWidth: (width) =>
        set({ panelWidth: Math.max(320, Math.min(width, 800)) }),

      setModalDimensions: (dims) =>
        set((state) => ({
          modalDimensions: { ...state.modalDimensions, ...dims },
        })),
    }),
    {
      name: "assistant-store",
      partialize: (state) => ({
        displayMode: state.displayMode,
        panelWidth: state.panelWidth,
        modalDimensions: state.modalDimensions,
      }),
    }
  )
);
