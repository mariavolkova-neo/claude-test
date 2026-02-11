# UI Best Practices

Single source of truth for building UI in this LMS/KMS application. All contributors should follow these conventions to ensure consistent, maintainable components.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS | 4 |
| Variants | class-variance-authority (CVA) | 0.7.x |
| Class Merging | clsx + tailwind-merge via `cn()` | - |
| Icons | Lucide React | 0.563.x |
| Global State | Zustand | 5.x |
| Server State | TanStack React Query | 5.x |
| Component Style | shadcn/ui "new-york" | - |

---

## 1. Design Tokens & Theming

Tokens are defined in `src/app/globals.css` using a two-layer system:

1. **CSS custom properties** on `:root` (light) and `.dark` (dark) define raw OKLch values.
2. **Tailwind `@theme inline`** maps them to `--color-*` so Tailwind utility classes work automatically.

### Color Tokens

| Token | Light | Dark | Tailwind Class |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | `bg-background` |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `text-foreground` |
| `--primary` | `oklch(0.55 0.18 250)` | `oklch(0.55 0.18 250)` | `bg-primary`, `text-primary` |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` | `text-primary-foreground` |
| `--secondary` | `oklch(0.965 0 0)` | `oklch(0.269 0 0)` | `bg-secondary` |
| `--secondary-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | `text-secondary-foreground` |
| `--muted` | `oklch(0.965 0 0)` | `oklch(0.269 0 0)` | `bg-muted` |
| `--muted-foreground` | `oklch(0.46 0 0)` | `oklch(0.708 0 0)` | `text-muted-foreground` |
| `--accent` | `oklch(0.965 0 0)` | `oklch(0.269 0 0)` | `bg-accent` |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.577 0.245 27.325)` | `bg-destructive` |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | `bg-card` |
| `--popover` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | `bg-popover` |
| `--border` | `oklch(0.922 0 0)` | `oklch(0.3 0 0)` | `border-border` |
| `--input` | `oklch(0.922 0 0)` | `oklch(0.3 0 0)` | `border-input` |
| `--ring` | `oklch(0.55 0.18 250)` | `oklch(0.55 0.18 250)` | `ring-ring` |

### Radius Tokens

| Token | Value | Tailwind Class |
|---|---|---|
| `--radius` | `0.5rem` | (base) |
| `--radius-sm` | `calc(var(--radius) - 4px)` | `rounded-sm` |
| `--radius-md` | `calc(var(--radius) - 2px)` | `rounded-md` |
| `--radius-lg` | `var(--radius)` | `rounded-lg` |
| `--radius-xl` | `calc(var(--radius) + 4px)` | `rounded-xl` |

### Layout Tokens

| Token | Value |
|---|---|
| `--sidebar-width` | `60px` |
| `--sidebar-width-expanded` | `240px` |

### Font Tokens

| Token | Stack |
|---|---|
| `--font-sans` | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| `--font-mono` | `ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace` |

### Rules

- **Always** use semantic token classes (`bg-primary`, `text-muted-foreground`), never raw color values.
- **Never** hard-code hex/rgb/oklch in component files. Define a new token in `globals.css` first.
- For opacity variations, use Tailwind's modifier: `bg-primary/10`, `hover:bg-primary/90`.
- New tokens must be added in three places: `:root`, `.dark`, and `@theme inline`.

```tsx
// Correct: uses semantic tokens
<div className="bg-card text-card-foreground border border-border rounded-xl" />

// Incorrect: hard-coded colors bypass theming
<div className="bg-white text-gray-900 border border-gray-200 rounded-xl" />
```

---

## 2. Component Architecture

Components are organized into three tiers:

| Tier | Directory | Purpose | Examples |
|---|---|---|---|
| Primitives | `src/components/ui/` | Reusable building blocks | Button, Card, Badge, Input, Tabs |
| Layout | `src/components/layout/` | App shell and structure | Sidebar, Topbar, PageHeader |
| Feature | `src/components/[feature]/` | Domain-specific, composed from primitives | AssetCard, FolderTree |

### Pattern A: CVA Variant Component

Use for primitives that need visual variants. Canonical example: `src/components/ui/button.tsx`

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**Key rules:**
1. `cva()` const defined at module scope and exported alongside the component.
2. Props extend native HTML attributes **and** `VariantProps<typeof variants>`.
3. `React.forwardRef` wraps the component; `displayName` is set explicitly.
4. `cn()` merges CVA output with any consumer-supplied `className`.
5. `...props` is spread last onto the root element.

### Pattern B: Compound Component

Use when a component has distinct sub-parts. Canonical example: `src/components/ui/card.tsx`

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

// CardTitle, CardDescription, CardContent follow the same pattern...

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
```

**Key rules:**
1. Each sub-component is a separate `forwardRef` with its own `displayName`.
2. All are **named exports** from the same file (not dot-notation like `Card.Header`).
3. Usage: `<Card><CardHeader>...</CardHeader><CardContent>...</CardContent></Card>`

### Pattern C: Context-Based Compound Component

Use when sub-components share internal state. Canonical example: `src/components/ui/tabs.tsx`

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType>({
  activeTab: "",
  setActiveTab: () => {},
});

function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsTrigger({ value, children, className }: { ... }) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors -mb-px cursor-pointer",
        isActive
          ? "border-b-2 border-primary text-primary"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
```

**Key rules:**
1. Context type is defined in the same file and **not exported** (private implementation detail).
2. `"use client"` is required because it uses hooks.
3. ARIA attributes (`role="tab"`, `aria-selected`) are included for accessibility.

### Pattern D: Feature Component

Composes primitives with domain types. Canonical example: `src/components/knowledge/asset-card.tsx`

```tsx
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Asset } from "@/types/knowledge";

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <div className="group rounded-xl border bg-card overflow-hidden transition-all hover:border-primary/20 hover:shadow-md">
      {/* Composes Badge, DropdownMenu, and other primitives */}
    </div>
  );
}
```

**Key rules:**
1. Props accept domain types from `src/types/`, not raw primitives.
2. Feature components compose from `src/components/ui/` primitives.
3. No `forwardRef` unless wrapping a single focusable element.
4. Add `"use client"` only if the component itself uses hooks or event handlers.

---

## 3. Styling Conventions

### The `cn()` Utility

Defined in `src/lib/utils.ts`, `cn()` combines `clsx` (conditional class joining) with `tailwind-merge` (conflict resolution). Use it in **every** component that accepts a `className` prop.

```tsx
// Basic: merge default + consumer classes
className={cn("base-classes", className)}

// With CVA: pass className into the CVA call
className={cn(buttonVariants({ variant, size, className }))}

// Conditional classes
className={cn(
  "base-classes",
  isActive ? "active-classes" : "inactive-classes",
  className
)}
```

### Tailwind Class Ordering

Apply classes in this order for consistency:

1. Layout/display: `flex`, `inline-flex`, `grid`, `block`
2. Positioning: `relative`, `absolute`, `fixed`, `sticky`, `z-*`
3. Sizing: `h-*`, `w-*`, `min-w-*`, `max-w-*`
4. Spacing: `p-*`, `px-*`, `py-*`, `m-*`, `gap-*`
5. Typography: `text-*` (size), `font-*`, `leading-*`, `tracking-*`
6. Borders: `border`, `border-*`, `rounded-*`
7. Colors: `bg-*`, `text-*` (color)
8. Effects: `shadow-*`, `opacity-*`, `overflow-*`
9. Transitions: `transition-*`
10. States: `hover:*`, `focus-visible:*`, `disabled:*`, `group-hover:*`

### Responsive Design

Mobile-first approach using Tailwind breakpoint prefixes:

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
```

- Common breakpoints: `sm:` (640px), `lg:` (1024px)
- Show/hide pattern: `hidden sm:inline`

### Standard Spacing

| Context | Value |
|---|---|
| Page padding | `p-6` |
| Card padding | `p-4` or `p-6` |
| Grid gap | `gap-4` or `gap-6` |
| Card header spacing | `space-y-1.5` |
| Section spacing | `space-y-3` to `space-y-6` |

---

## 4. Component Creation Checklists

### File Naming

| Convention | Example |
|---|---|
| File names | `kebab-case.tsx` (`asset-card.tsx`, `dropdown-menu.tsx`) |
| Component exports | `PascalCase` (`AssetCard`, `DropdownMenu`) |
| Type files | `kebab-case.ts` in `src/types/` (`knowledge.ts`, `assistant.ts`) |
| Store files | `kebab-case.ts` in `src/stores/` (`ui-store.ts`) |

### Props Interface Templates

```tsx
// For primitives wrapping a single HTML element:
export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // additional custom props
}

// For feature components with domain data:
interface ComponentProps {
  data: DomainType;         // typed from src/types/
  onAction?: () => void;    // callback props prefixed with "on"
  className?: string;       // always accept className for override
}
```

### New Primitive Checklist

1. Create file with kebab-case name in `src/components/ui/`.
2. Import `cn` from `@/lib/utils`.
3. If variants needed, import `cva` and `VariantProps` from CVA.
4. Use `React.forwardRef` and set `displayName`.
5. Props extend the appropriate `React.*HTMLAttributes` type.
6. Accept and spread `className` through `cn()`.
7. Spread `...props` on the root element.
8. Add `"use client"` only if the component uses hooks or event handlers.
9. Export the component **and** the variants const (if using CVA).

### New Feature Component Checklist

1. Create file in `src/components/[feature-name]/` matching the route name.
2. Import types from `src/types/`.
3. Compose from `src/components/ui/` primitives wherever possible.
4. Props should accept domain types, not raw data.
5. Keep business logic minimal -- delegate to hooks or stores.
6. Add `"use client"` if interactive.

---

## 5. State Management

| Scope | Tool | When to Use | Example |
|---|---|---|---|
| Element-local | `React.useState` | Toggles, form fields, open/closed | `tooltip.tsx`: `const [visible, setVisible] = useState(false)` |
| Component-tree | `React.createContext` | Shared state between compound sub-components | `tabs.tsx`: `TabsContext` coordinates active tab |
| App-global | Zustand store | Cross-page state, persisted preferences | `ui-store.ts`: theme, sidebar collapsed |
| Server/async | TanStack React Query | API data fetching, caching, mutations | API calls |

### Zustand Store Convention

Based on `src/stores/ui-store.ts`:

```tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface XxxState {
  someValue: string;
  setSomeValue: (value: string) => void;
}

export const useXxxStore = create<XxxState>()(
  persist(
    (set) => ({
      someValue: "",
      setSomeValue: (value) => set({ someValue: value }),
    }),
    { name: "xxx-store" }
  )
);
```

**Rules:**
- File name: `[domain]-store.ts` in `src/stores/`.
- Hook export: `useXxxStore` (always starts with `use`).
- Interface named `XxxState`.
- Use `persist` middleware for user preferences.
- Actions are defined inline in the store.

### Context for Compound Components

```tsx
// Private to the component file -- do NOT export
interface XxxContextType { ... }
const XxxContext = React.createContext<XxxContextType>({ ... });
```

---

## 6. Accessibility

### Required Patterns

**Focus ring** on all interactive elements:
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

**Disabled state:**
```
disabled:pointer-events-none disabled:opacity-50
```

**ARIA roles** for compound widgets:
```tsx
<div role="tablist">
<button role="tab" aria-selected={isActive}>
```

### Checklist for Every New Component

- Keyboard navigable (Tab, Enter, Escape where relevant)
- Focus ring visible when focused via keyboard
- ARIA attributes for non-standard interactive patterns
- Screen-reader-friendly text (no icon-only buttons without `aria-label`)
- All clickable elements use `<button>` or `<a>`, never `<div onClick>`
- Image elements have `alt` text or fallback content
- Reduced motion support via `motion-safe:` prefix when adding animations

---

## 7. Dark Mode

### How It Works

1. The `.dark` class is toggled on a parent element.
2. `@custom-variant dark (&:is(.dark *));` in `globals.css` activates `dark:` variants.
3. `useUIStore` (Zustand) holds and persists the `theme` state.
4. All color tokens have both `:root` and `.dark` definitions.

### Rules

- **Do not** use the `dark:` prefix when using semantic tokens. `bg-primary` already adapts.
- **Exception:** literal Tailwind colors (`bg-blue-100`) require an explicit `dark:` counterpart:

```tsx
// When using non-token colors, always pair with dark variant:
className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
```

- New tokens must always define both `:root` and `.dark` values in `globals.css` and register them in `@theme inline`.

---

## 8. Icon Usage (Lucide React)

### Import Convention

Always import individual icons, never the entire library:

```tsx
import { FileText, Globe, Upload, MoreHorizontal } from "lucide-react";
```

### Size Scale

| Context | Size |
|---|---|
| Inline with text / small buttons | `size={14}` |
| Standard icon buttons / nav items | `size={16}` to `size={20}` |
| Stat cards / hero / empty state | `size={24}` to `size={32}` |

### Styling

```tsx
// Color via className, not the color prop
<FileText size={20} className="text-muted-foreground" />

// Prevent compression in flex layouts
<ChevronRight size={14} className="shrink-0 transition-transform" />

// Lighter stroke for decorative icons
<SomeIcon size={24} strokeWidth={1.5} />
```

- Always use the `size` prop, never separate `width`/`height`.
- Use `shrink-0` on icons inside flex containers.
- Use `transition-transform` when animating rotation (e.g., chevron expand/collapse).

---

## 9. File & Folder Organization

```
src/
  app/
    globals.css                # Design tokens and global styles
    layout.tsx                 # Root layout (Server Component)
    (main)/
      layout.tsx               # Authenticated shell (Sidebar + Topbar)
      dashboard/page.tsx       # Route pages...
      knowledge/page.tsx
      tasks/page.tsx
      assistant/page.tsx
      admin/page.tsx
      account/page.tsx
      help/page.tsx
  components/
    ui/                        # Tier 1: Primitives
    layout/                    # Tier 2: Shell / structural
    [feature]/                 # Tier 3: Domain-specific
  lib/
    utils.ts                   # cn() and shared utilities
  stores/
    ui-store.ts                # Global UI state
    assistant-store.ts         # AI assistant state
  types/
    knowledge.ts               # Domain type definitions
    assistant.ts
    tasks.ts
    admin.ts
    account.ts
```

### Where to Put New Code

| What You're Building | Where It Goes |
|---|---|
| Reusable visual primitive | `src/components/ui/` |
| App shell / structural element | `src/components/layout/` |
| Feature-specific component | `src/components/[feature-name]/` |
| Shared utility function | `src/lib/` |
| Global app state | `src/stores/[domain]-store.ts` |
| TypeScript interfaces/types | `src/types/[domain].ts` |
| Route page | `src/app/(main)/[route]/page.tsx` |
| Custom React hook | `src/hooks/` |

---

## 10. Do's and Don'ts

### Do

1. Use `cn()` for every `className` that accepts external overrides.
2. Use semantic token classes (`bg-card`, `text-muted-foreground`) for all colors.
3. Use `forwardRef` and set `displayName` for all primitives in `src/components/ui/`.
4. Export variant constants alongside components (`export { Button, buttonVariants }`).
5. Spread `...props` on the root element of every primitive.
6. Add `"use client"` when a component uses hooks, event handlers, or browser APIs.
7. Import icons individually from `lucide-react`.
8. Use TypeScript `interface` (not `type`) for component props.
9. Keep page components thin -- delegate to feature and layout components.
10. Define domain types in `src/types/` and import them in feature components.
11. Add `cursor-pointer` to custom clickable elements.
12. Use `transition-colors` on interactive elements for smooth hover effects.
13. Use `focus-visible:ring-2 focus-visible:ring-ring` for keyboard focus indicators.
14. Check `src/components/ui/` before creating a similar component in a feature folder.
15. Define both `:root` and `.dark` values when creating new design tokens.

### Don't

1. Hard-code colors. No `#hex`, no `rgb()`, no `bg-blue-500` without a `dark:` counterpart.
2. Use inline `style` for colors or sizing -- only for truly dynamic values (e.g., percentage widths).
3. Create `<div onClick>` for interactive elements. Use `<button>` or `<a>`.
4. Use `React.FC` -- use explicit return types or inferred types with `forwardRef`.
5. Put client-side state in Server Components. Add `"use client"` if you need state.
6. Use global CSS for component-level styling. Tailwind utilities only.
7. Import the entire Lucide icon library (`import * as Icons`).
8. Use `useEffect` for derived state. Use `useMemo` or computed values.
9. Put business logic in UI components. Extract to hooks, stores, or utility functions.
10. Use `any` in TypeScript. Define proper types in `src/types/`.
11. Nest ternaries for className logic. Use `cn()` with conditional values instead.
12. Create new tokens without both light/dark values in `globals.css` and registration in `@theme inline`.
13. Use `z-index` values outside the established scale: `z-30` (topbar), `z-40` (sidebar), `z-50` (popover/dropdown/tooltip).
14. Duplicate component patterns. Reuse existing primitives from `src/components/ui/`.
