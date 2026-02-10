import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chat, DisplayMode, Project, Command } from "@/types/assistant";

interface AssistantState {
  isOpen: boolean;
  displayMode: DisplayMode;
  activeChat: Chat | null;
  chats: Chat[];
  projects: Project[];
  commands: Command[];
  setOpen: (open: boolean) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setActiveChat: (chat: Chat | null) => void;
  addChat: (chat: Chat) => void;
  removeChat: (chatId: string) => void;
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set) => ({
      isOpen: false,
      displayMode: "panel",
      activeChat: null,
      chats: [],
      projects: [],
      commands: [],
      setOpen: (open) => set({ isOpen: open }),
      setDisplayMode: (mode) => set({ displayMode: mode }),
      setActiveChat: (chat) => set({ activeChat: chat }),
      addChat: (chat) =>
        set((state) => ({ chats: [chat, ...state.chats] })),
      removeChat: (chatId) =>
        set((state) => ({
          chats: state.chats.filter((c) => c.id !== chatId),
        })),
    }),
    {
      name: "assistant-store",
      partialize: (state) => ({ displayMode: state.displayMode }),
    }
  )
);
