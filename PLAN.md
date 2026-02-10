# LMS & KMS Frontend — Implementation Plan

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| State Management | Zustand (global stores) + React Query / TanStack Query (server state) |
| Rich Text Editor | Tiptap (for FlexDocs) |
| Charts / Diagrams | Chart.js (via react-chartjs-2) + Mermaid |
| Markdown | react-markdown + remark-gfm |
| File Integrations | Google Picker API, OneDrive File Picker SDK |
| Auth | NextAuth.js (or Auth.js v5) — placeholder until backend is defined |
| Testing | Vitest + React Testing Library + Playwright (E2E) |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth layout group (login, signup, forgot-password)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (main)/                   # Authenticated app layout group
│   │   ├── layout.tsx            # Shell: sidebar + topbar + assistant overlay
│   │   ├── knowledge/            # Knowledge Center
│   │   │   ├── page.tsx          # Root — all assets & folders
│   │   │   ├── folders/[id]/page.tsx
│   │   │   ├── assets/[id]/page.tsx        # Asset detail / viewer
│   │   │   └── assets/[id]/edit/page.tsx   # FlexDoc editor
│   │   ├── tasks/                # Tasks
│   │   │   └── page.tsx          # Tabs: My Tasks | Assigned by Me | All Tasks
│   │   ├── assistant/            # Full-page assistant view
│   │   │   ├── page.tsx          # Chat list / project view
│   │   │   └── [chatId]/page.tsx # Single chat thread
│   │   ├── admin/                # Admin Center
│   │   │   ├── page.tsx          # Dashboard / overview
│   │   │   ├── users/page.tsx
│   │   │   ├── roles/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx        # Admin sub-nav
│   │   └── account/              # Account Center
│   │       ├── page.tsx
│   │       ├── billing/page.tsx
│   │       └── credits/page.tsx
│   ├── api/                      # API routes (BFF proxies, webhooks)
│   └── layout.tsx                # Root layout (providers, fonts, metadata)
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (auto-generated)
│   ├── layout/                   # Shell components
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── nav-item.tsx
│   │   └── user-menu.tsx
│   ├── knowledge/                # Knowledge Center components
│   │   ├── asset-card.tsx
│   │   ├── asset-table.tsx
│   │   ├── folder-tree.tsx
│   │   ├── upload-dialog.tsx
│   │   ├── link-file-dialog.tsx  # Google / OneDrive picker
│   │   ├── flexdoc-editor.tsx    # Tiptap-based editor
│   │   └── asset-viewer.tsx
│   ├── tasks/                    # Tasks components
│   │   ├── task-list.tsx
│   │   ├── task-card.tsx
│   │   ├── task-detail-panel.tsx
│   │   ├── assign-task-dialog.tsx
│   │   └── task-filters.tsx
│   ├── assistant/                # Knowledge Assistant components
│   │   ├── assistant-shell.tsx   # Wrapper that handles panel/modal/page modes
│   │   ├── chat-thread.tsx
│   │   ├── message-bubble.tsx
│   │   ├── message-renderer.tsx  # Renders markdown, charts, mermaid, html
│   │   ├── chat-input.tsx
│   │   ├── chat-sidebar.tsx      # Chat list, projects, commands
│   │   ├── project-list.tsx
│   │   ├── command-palette.tsx   # Shortcuts to prompts
│   │   ├── chart-block.tsx       # Chart.js renderer
│   │   ├── mermaid-block.tsx     # Mermaid diagram renderer
│   │   └── html-block.tsx        # Sandboxed HTML renderer
│   ├── admin/
│   │   ├── user-table.tsx
│   │   ├── invite-user-dialog.tsx
│   │   └── role-editor.tsx
│   └── account/
│       ├── billing-overview.tsx
│       ├── plan-selector.tsx
│       └── credit-usage-chart.tsx
│
├── stores/                       # Zustand stores
│   ├── assistant-store.ts        # Chat state, active chat, display mode, projects
│   ├── knowledge-store.ts        # Asset/folder selection, filters, current view
│   ├── task-store.ts             # Active tab, filters, task state
│   └── ui-store.ts               # Sidebar collapsed, theme, global UI
│
├── hooks/                        # Custom hooks
│   ├── use-assistant.ts          # Assistant open/close, mode switching
│   ├── use-knowledge.ts          # Knowledge CRUD helpers
│   ├── use-tasks.ts              # Task CRUD helpers
│   └── use-streaming.ts          # SSE/WebSocket for assistant streaming
│
├── lib/                          # Utilities
│   ├── api-client.ts             # Fetch wrapper / API client
│   ├── query-keys.ts             # TanStack Query key factory
│   ├── utils.ts                  # General utilities (cn, formatDate, etc.)
│   └── constants.ts
│
└── types/                        # Shared TypeScript types
    ├── knowledge.ts              # Asset, Folder, FlexDoc, LinkedFile
    ├── tasks.ts                  # Task, Assignment, TaskStatus
    ├── assistant.ts              # Chat, Message, Project, Command, RenderBlock
    ├── admin.ts                  # User, Role, Permission
    └── account.ts                # BillingPlan, CreditUsage
```

---

## Implementation Phases

### Phase 0 — Project Bootstrap
> **Goal:** Running Next.js app with tooling, design system, and empty shell.

- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Install and configure Tailwind CSS 4
- [ ] Initialize shadcn/ui, install base primitives (Button, Dialog, Input, Tabs, DropdownMenu, Avatar, Sheet, Tooltip, etc.)
- [ ] Set up folder structure (`components/`, `stores/`, `hooks/`, `lib/`, `types/`)
- [ ] Configure path aliases (`@/components`, `@/lib`, etc.)
- [ ] Add ESLint + Prettier config
- [ ] Install Zustand, TanStack Query, and create provider wrappers
- [ ] Create root layout with theme provider (light/dark)
- [ ] Stub out the authenticated shell layout: sidebar + topbar + `{children}` + assistant overlay slot
- [ ] Set up route groups: `(auth)` and `(main)`
- [ ] Create placeholder pages for every route listed above
- [ ] Verify the app builds and all routes are navigable

**Deliverable:** A running app with navigation between all placeholder pages and an empty shell UI.

---

### Phase 1 — App Shell & Navigation
> **Goal:** Fully functional sidebar, topbar, and responsive layout.

- [ ] Build `<Sidebar>` with nav sections:
  - Knowledge Center
  - Tasks
  - Assistant
  - Admin Center
  - Account
- [ ] Active route highlighting via `usePathname()`
- [ ] Collapsible sidebar (icon-only mode on collapse)
- [ ] `<Topbar>` with breadcrumbs, search trigger, user avatar menu
- [ ] `<UserMenu>` dropdown with profile, settings, logout
- [ ] Mobile-responsive sidebar (drawer via shadcn Sheet)
- [ ] Persist sidebar collapsed state in Zustand `ui-store`
- [ ] Dark mode toggle (Tailwind `dark:` classes + next-themes)

**Deliverable:** Polished app shell that feels like a real product. All navigation works.

---

### Phase 2 — Knowledge Center
> **Goal:** Full CRUD for assets and folders, file viewer, and FlexDoc editor.

#### 2A — Folder & Asset Browsing
- [ ] Define TypeScript types: `Asset`, `Folder`, `AssetType` (upload | flexdoc | google | onedrive)
- [ ] Build `<FolderTree>` sidebar component (nested, expandable)
- [ ] Build asset list view — table and grid toggle
- [ ] `<AssetCard>` with thumbnail, name, type badge, date, actions menu
- [ ] `<AssetTable>` with sortable columns
- [ ] Breadcrumb navigation within folder hierarchy
- [ ] Multi-select assets (checkbox + bulk action bar)
- [ ] Search and filter bar (by type, date, name)
- [ ] Empty states for folders and root

#### 2B — Asset Creation & Upload
- [ ] `<UploadDialog>` with drag-and-drop zone (using shadcn + custom drop area)
- [ ] Upload progress indicators
- [ ] "New FlexDoc" button → navigates to editor
- [ ] `<LinkFileDialog>` — tabbed picker for Google Drive and OneDrive
  - Google Picker API integration
  - OneDrive File Picker SDK integration
- [ ] "New Folder" inline creation

#### 2C — FlexDoc Editor
- [ ] Install and configure Tiptap with extensions:
  - StarterKit (bold, italic, headings, lists, code blocks, etc.)
  - Placeholder
  - Image
  - Table
  - Link
  - TaskList (checkboxes)
  - Collaboration-ready (Y.js stub for future real-time)
- [ ] Toolbar with formatting controls
- [ ] Slash command menu (type `/` to insert blocks)
- [ ] Auto-save with debounce
- [ ] Full-screen editor mode

#### 2D — Asset Viewer
- [ ] `<AssetViewer>` that renders different content types:
  - FlexDoc → read-only Tiptap render
  - PDF → embedded PDF viewer
  - Image → lightbox
  - Google/OneDrive → embedded iframe or redirect
- [ ] Asset metadata panel (owner, dates, tags, linked tasks)
- [ ] "Assign as Task" action from asset detail

**Deliverable:** Fully navigable Knowledge Center with uploads, FlexDocs, linked files, and folder management.

---

### Phase 3 — Tasks
> **Goal:** Task assignment, tracking, and filtering across three views.

- [ ] Define TypeScript types: `Task`, `TaskStatus`, `TaskAssignment`
- [ ] Task page with three tabs (shadcn `<Tabs>`):
  - **My Tasks** — tasks assigned to the current user
  - **Assigned by Me** — tasks the current user created/assigned
  - **All Tasks** — admin/manager view of all tasks in the account
- [ ] `<TaskList>` with status grouping (Not Started, In Progress, Completed, Overdue)
- [ ] `<TaskCard>` showing asset name, assignee, due date, status badge, progress
- [ ] `<TaskDetailPanel>` slide-over or modal:
  - Status update
  - Due date picker
  - Assignee(s)
  - Linked asset (click to open in Knowledge Center)
  - Comments / activity log
- [ ] `<AssignTaskDialog>` — asset picker + user picker + due date
  - Reachable from Knowledge Center ("Assign as Task") and from Tasks page ("New Task")
- [ ] Filters: status, assignee, due date range, asset type
- [ ] Sort: due date, status, created date, name
- [ ] Empty states per tab
- [ ] Bulk actions: mark complete, reassign, delete

**Deliverable:** Complete task management with assignment flow from Knowledge Center and standalone creation.

---

### Phase 4 — Knowledge Assistant (Core Feature)
> **Goal:** AI chat assistant available everywhere, with multi-format rendering.

#### 4A — Assistant Shell & Display Modes
- [ ] Define TypeScript types: `Chat`, `Message`, `Project`, `Command`, `RenderBlock`
- [ ] `<AssistantShell>` component that renders the assistant in three modes:
  - **Panel** — fixed right-side panel (resizable, ~400px default)
  - **Modal** — centered overlay dialog (shadcn Dialog, large)
  - **Page** — full-page route (`/assistant` and `/assistant/[chatId]`)
- [ ] Zustand `assistant-store`: activeChat, messages, displayMode, projects, isOpen
- [ ] Mode switcher UI (three small icons: panel / modal / page)
- [ ] Assistant trigger button — floating action button visible on all `(main)` pages
- [ ] Keyboard shortcut to toggle assistant (e.g., `Cmd+K` or `Cmd+J`)
- [ ] Smooth transitions between modes (panel slides in, modal fades, page navigates)
- [ ] Persist display mode preference in localStorage via Zustand middleware

#### 4B — Chat Interface
- [ ] `<ChatThread>` — scrollable message list with auto-scroll on new messages
- [ ] `<MessageBubble>` — user and assistant message styling
- [ ] `<ChatInput>` — multi-line textarea with:
  - Send button and `Enter` to send / `Shift+Enter` for newline
  - `/` command trigger (opens command palette inline)
  - Attachment button (link an asset from Knowledge Center for context)
  - Loading/streaming indicator
- [ ] `<MessageRenderer>` — renders assistant message content blocks:
  - **Text/Markdown** — `react-markdown` with `remark-gfm`
  - **Chart** — detect `chart` blocks → `<ChartBlock>` (Chart.js via react-chartjs-2)
  - **Mermaid** — detect `mermaid` blocks → `<MermaidBlock>` (lazy-loaded mermaid)
  - **HTML** — detect `html` blocks → `<HtmlBlock>` (sandboxed iframe)
  - Code blocks with syntax highlighting (shiki or highlight.js)
- [ ] Streaming support — SSE or WebSocket hook (`use-streaming.ts`)
- [ ] "Stop generating" button during streaming
- [ ] Copy message, retry, delete actions per message

#### 4C — Chat Management & Projects
- [ ] `<ChatSidebar>` — list of chats grouped by date or project
- [ ] Create new chat
- [ ] Rename / delete chat
- [ ] `<ProjectList>` — organize chats into projects (folders for chats)
  - Create / rename / delete project
  - Drag-and-drop chat into project
  - Project-level context (e.g., "this project is about onboarding content")
- [ ] Search across chats

#### 4D — Commands
- [ ] `<CommandPalette>` — searchable list of pre-built commands
  - Commands are shortcuts to long/valuable prompts
  - Each command has: name, description, prompt template, optional parameters
  - e.g., "Summarize asset" → pre-fills prompt to summarize a selected asset
  - e.g., "Quiz me" → generates a quiz from knowledge base content
  - e.g., "Compare documents" → structured comparison prompt
- [ ] Commands triggered by typing `/` in chat input
- [ ] Command parameters UI (e.g., select which asset, choose format)
- [ ] Admin-configurable commands (future — stub the data model)

**Deliverable:** A fully functional AI assistant that works in panel/modal/page modes, renders rich content (charts, diagrams, HTML, markdown), supports chat organization with projects, and includes a command system.

---

### Phase 5 — Admin Center
> **Goal:** User management and account configuration.

- [ ] Admin layout with sub-navigation (sidebar or tabs)
- [ ] **Users page:**
  - User table with search, role filter
  - `<InviteUserDialog>` — email, role picker
  - User detail: edit role, deactivate, view activity
  - Bulk invite via CSV
- [ ] **Roles page:**
  - Role list with permission matrix
  - Create/edit custom roles
  - Permission categories: Knowledge (view/edit/delete), Tasks (assign/manage), Assistant (access/configure), Admin (users/billing)
- [ ] **Settings page:**
  - Account name, logo upload
  - Default permissions
  - Integration settings (Google Workspace, OneDrive connector configs)
  - Notification preferences

**Deliverable:** Admin center for managing users, roles, and account-wide settings.

---

### Phase 6 — Account Center
> **Goal:** Billing management and credit usage tracking.

- [ ] **Billing page:**
  - Current plan display (tier, price, renewal date)
  - `<PlanSelector>` — upgrade/downgrade plans
  - Payment method management
  - Invoice history table with download links
- [ ] **Credits page:**
  - `<CreditUsageChart>` — Chart.js line/bar chart showing AI credit consumption over time
  - Credit balance display
  - Usage breakdown by user / by feature
  - Credit purchase / top-up flow
- [ ] Usage alerts and limits configuration

**Deliverable:** Billing and credit management pages.

---

### Phase 7 — Polish, Integration & Testing
> **Goal:** Production-ready quality.

- [ ] **API integration layer:**
  - Finalize `api-client.ts` with interceptors, error handling, token refresh
  - TanStack Query hooks for all data-fetching (with optimistic updates for mutations)
  - Mock service worker (MSW) for development without backend
- [ ] **Auth flow:**
  - Login / signup / forgot-password pages
  - Protected route middleware
  - Session management
- [ ] **Loading & error states:**
  - Skeleton loaders for every list/page (shadcn Skeleton)
  - Error boundaries with retry
  - Toast notifications (shadcn Sonner)
  - Optimistic UI for common actions
- [ ] **Accessibility:**
  - Keyboard navigation for all interactive elements
  - ARIA labels on custom components
  - Focus management for modals/panels
  - Screen reader testing
- [ ] **Performance:**
  - Dynamic imports for heavy components (Tiptap, Chart.js, Mermaid)
  - Image optimization (next/image)
  - Route prefetching
  - Bundle analysis and code splitting review
- [ ] **Testing:**
  - Unit tests for stores, hooks, and utility functions
  - Component tests for critical UI (assistant renderer, task list, knowledge table)
  - E2E tests (Playwright) for key flows:
    - Upload asset → assign as task → complete task
    - Open assistant → ask question → view chart response
    - Create FlexDoc → edit → save
- [ ] **Responsive design audit** — ensure all pages work on tablet and mobile

**Deliverable:** A polished, tested, accessible, and performant frontend ready for backend integration.

---

## Cross-Cutting Concerns

| Concern | Approach |
|---|---|
| **Authentication** | NextAuth.js / Auth.js with JWT strategy; middleware-protected routes |
| **Authorization** | Role-based guards on routes + component-level permission checks |
| **Data Fetching** | TanStack Query for server state; Zustand for client-only state |
| **Real-time** | SSE for assistant streaming; WebSocket stub for future collaboration |
| **Error Handling** | Global error boundary + per-query error states + toast notifications |
| **Theming** | Tailwind `dark:` classes + `next-themes` + shadcn theme tokens |
| **Internationalization** | Stub with `next-intl` — not implemented in v1 but architecture supports it |
| **Analytics** | Event tracking hooks — stub for Mixpanel/Amplitude/PostHog integration |

---

## Dependency Summary

```
# Core
next@15           react@19          react-dom@19        typescript

# Styling & UI
tailwindcss@4     @tailwindcss/postcss  shadcn/ui components
next-themes       lucide-react      class-variance-authority  clsx  tailwind-merge

# State & Data
zustand           @tanstack/react-query  immer (zustand middleware)

# Editor
@tiptap/react     @tiptap/starter-kit   @tiptap/extension-*

# AI Rendering
react-chartjs-2   chart.js          mermaid           react-markdown
remark-gfm        rehype-raw        shiki (syntax highlighting)

# File Integrations
(Google Picker API — loaded via script tag)
(OneDrive File Picker — loaded via script tag)

# Auth
next-auth@5

# Dev & Testing
vitest            @testing-library/react   playwright
msw               eslint            prettier
```

---

## Design Integration Notes

Designs will be provided for each page. During implementation:
1. **Before starting each phase**, review the relevant designs
2. Map design elements to shadcn primitives where possible
3. Create custom components only when shadcn doesn't cover the pattern
4. Extract design tokens (colors, spacing, typography) into Tailwind config
5. Build a few shared layout patterns (page header, content area, card grid) that match the design system

---

## Suggested Build Order (Sprint Planning)

| Sprint | Phase | Duration Estimate |
|---|---|---|
| Sprint 1 | Phase 0 (Bootstrap) + Phase 1 (Shell) | Foundation |
| Sprint 2 | Phase 4A–4B (Assistant Shell + Chat) | Core differentiator first |
| Sprint 3 | Phase 2A–2B (Knowledge Browsing + Upload) | Content foundation |
| Sprint 4 | Phase 2C–2D (FlexDoc Editor + Viewer) | Content creation |
| Sprint 5 | Phase 3 (Tasks) | Connects knowledge to users |
| Sprint 6 | Phase 4C–4D (Chat Projects + Commands) | Assistant completion |
| Sprint 7 | Phase 5 (Admin) + Phase 6 (Account) | Configuration |
| Sprint 8 | Phase 7 (Polish & Testing) | Production readiness |

> **Note:** The Assistant (Phase 4) is prioritized early because it's the core differentiator and is architecturally cross-cutting (appears on every page). Building it early ensures the overlay/panel/modal system is solid before other features layer on top.
