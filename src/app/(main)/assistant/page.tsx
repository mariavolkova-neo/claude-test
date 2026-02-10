"use client";

import React, { useState } from "react";
import {
  Send,
  Plus,
  Sparkles,
  PanelRight,
  Maximize2,
  MessageSquare,
  FolderOpen,
  Slash,
  MoreHorizontal,
  Bot,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MockMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MockChat {
  id: string;
  title: string;
  project?: string;
  lastMessage: string;
  date: string;
}

const mockChats: MockChat[] = [
  {
    id: "1",
    title: "Nuclear safety regulations overview",
    project: "Safety Research",
    lastMessage: "The key regulations include...",
    date: "Today",
  },
  {
    id: "2",
    title: "Compare reactor designs",
    project: "Safety Research",
    lastMessage: "Here's a comparison chart...",
    date: "Today",
  },
  {
    id: "3",
    title: "Training plan for new engineers",
    project: "Onboarding",
    lastMessage: "I recommend the following schedule...",
    date: "Yesterday",
  },
  {
    id: "4",
    title: "Environmental compliance checklist",
    lastMessage: "Based on the knowledge base...",
    date: "Yesterday",
  },
  {
    id: "5",
    title: "Risk assessment methodology",
    project: "Safety Research",
    lastMessage: "The ALARA principle states...",
    date: "Last week",
  },
];

const mockMessages: MockMessage[] = [
  {
    id: "1",
    role: "user",
    content:
      "Can you summarize the key nuclear safety standards we need to comply with?",
  },
  {
    id: "2",
    role: "assistant",
    content: `Based on the knowledge center documents, here are the key nuclear safety standards your organization needs to comply with:

## International Standards

1. **IAEA Safety Standards** — The foundational framework including GSR Part 1 (Governmental, Legal and Regulatory Framework) and GSR Part 2 (Leadership and Management for Safety).

2. **WENRA Reference Levels** — Harmonized safety reference levels for existing reactors across European countries.

## National Regulations

- **10 CFR Part 50** — Domestic licensing of production and utilization facilities
- **10 CFR Part 52** — Licenses, certifications, and approvals for nuclear power plants

## Key Compliance Areas

| Area | Standard | Status |
|------|----------|--------|
| Radiation Protection | ICRP 103 | Active |
| Quality Assurance | ASME NQA-1 | Active |
| Emergency Preparedness | NUREG-0654 | Under Review |
| Environmental Monitoring | Reg Guide 4.1 | Active |

Would you like me to generate a detailed compliance checklist based on these standards?`,
  },
];

const mockProjects = ["Safety Research", "Onboarding", "Compliance"];

const mockCommands = [
  {
    name: "Summarize",
    description: "Summarize a document or topic from the knowledge base",
  },
  {
    name: "Quiz me",
    description: "Generate a quiz from knowledge base content",
  },
  {
    name: "Compare",
    description: "Compare two documents or topics side by side",
  },
  {
    name: "Create checklist",
    description: "Generate a compliance or task checklist",
  },
];

export default function AssistantPage() {
  const [selectedChat, setSelectedChat] = useState<string>("1");
  const [input, setInput] = useState("");
  const [showCommands, setShowCommands] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Chat Sidebar */}
      <aside className="w-72 shrink-0 border-r flex flex-col">
        <div className="p-4 border-b">
          <Button className="w-full" size="sm">
            <Plus size={16} />
            New Chat
          </Button>
        </div>

        {/* Projects */}
        <div className="p-3 border-b">
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
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Chats
          </p>
          <div className="space-y-1">
            {mockChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={cn(
                  "flex w-full flex-col rounded-lg px-3 py-2 text-left transition-colors cursor-pointer",
                  selectedChat === chat.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent"
                )}
              >
                <span className="text-sm font-medium truncate">
                  {chat.title}
                </span>
                <span className="text-xs text-muted-foreground truncate mt-0.5">
                  {chat.lastMessage}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Commands */}
        <div className="p-3 border-t">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Commands
          </p>
          {mockCommands.map((cmd) => (
            <button
              key={cmd.name}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <Slash size={14} />
              {cmd.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b px-6 py-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <h2 className="font-semibold">Knowledge Assistant</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Panel mode">
              <PanelRight size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Modal mode">
              <Maximize2 size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Full page mode">
              <MessageSquare size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={16} />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 max-w-3xl",
                msg.role === "user" ? "ml-auto" : ""
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={cn(
                  "rounded-xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {msg.role === "assistant" ? (
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold mt-4 mb-2">$1</h2>')
                        .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold mt-3 mb-1">$1</h3>')
                        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                        .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
                        .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
                        .replace(
                          /\|(.+)\|/g,
                          (match) => `<code class="text-xs">${match}</code>`
                        )
                        .replace(/\n/g, "<br />"),
                    }}
                  />
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-end gap-2 rounded-xl border bg-card p-2">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setShowCommands(e.target.value.startsWith("/"));
                }}
                placeholder="Ask anything about your knowledge base... Type / for commands"
                rows={1}
                className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                  }
                }}
              />
              <Button size="icon" className="h-8 w-8 shrink-0">
                <Send size={16} />
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Knowledge Assistant can make mistakes. Verify important
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
