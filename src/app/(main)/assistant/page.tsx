"use client";

import React from "react";
import {
  Sparkles,
  PanelRight,
  PanelLeft,
  Maximize2,
  MessageSquare,
  MoreHorizontal,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssistantStore } from "@/stores/assistant-store";
import { AssistantChatContent } from "@/components/assistant/assistant-chat-content";

const mockProjects = ["Safety Research", "Onboarding", "Compliance"];

export default function AssistantPage() {
  const { setOpen, setDisplayMode } = useAssistantStore();

  const openAsPanel = () => {
    setDisplayMode("panel");
    setOpen(true);
  };
  const openAsModal = () => {
    setDisplayMode("modal");
    setOpen(true);
  };

  const header = (
    <div className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-primary" />
        <h2 className="font-semibold">Knowledge Assistant</h2>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Panel mode"
          onClick={openAsPanel}
        >
          <PanelRight size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Modal mode"
          onClick={openAsModal}
        >
          <Maximize2 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-accent"
          title="Full page mode"
        >
          <MessageSquare size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal size={16} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Projects sidebar — only visible in full-page mode */}
      <aside className="w-48 shrink-0 border-r flex flex-col p-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
          Projects
        </p>
        {mockProjects.map((project) => (
          <button
            key={project}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          >
            <FolderOpen size={14} />
            {project}
          </button>
        ))}
      </aside>

      <AssistantChatContent showSidebar header={header} className="flex-1" />
    </div>
  );
}
