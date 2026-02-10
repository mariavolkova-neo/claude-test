export type DisplayMode = "panel" | "modal" | "page";

export type RenderBlockType = "text" | "chart" | "mermaid" | "html" | "code";

export interface RenderBlock {
  type: RenderBlockType;
  content: string;
  language?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  blocks?: RenderBlock[];
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  projectId?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  chatIds: string[];
}

export interface Command {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  icon?: string;
}
