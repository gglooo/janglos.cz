# Project Context: janglos.cz

## Overview
- **Name:** `janglos.cz`
- **Type:** `web-app`
- **Purpose:** Retro Windows 95-style personal portfolio with draggable desktop, window manager, Start menu, Run dialog, and Brno weather widget.

## Stack
- **Runtime:** Vite + React 19 + TypeScript
- **State:** Zustand (slice-based, persisted)
- **Data:** `@tanstack/react-query`
- **UI:** TailwindCSS v4 + custom Win95 styling
- **Tests:** Vitest + Testing Library
- **Drag/Resize:** `react-dnd` + `react-rnd`

## Scripts
- `dev`: `npm run dev`
- `build`: `npm run build`
- `lint`: `npm run lint`
- `test`: `npm run test`
- `preview`: `npm run preview`

## Entrypoints
- **App:** `src/main.tsx`
- **Root Component:** `src/App.tsx`
- **Page:** `src/pages/Portfolio.tsx`

## Architecture
- **Store:** `src/store/appStore.ts` composes desktop/ui-shell/window slices and persists shell state to `localStorage` (key: `janglos-shell-state`).
- **Windows:** `src/store/slices/windowSlice.ts` owns canonical window lifecycle: `open` / `focus` / `minimize` / `maximize` / `restore` / `close` + cascade/tile layouts.
- **Placement:** `src/utils/windowPlacement.ts` provides deterministic placement + viewport/taskbar clamping.
- **Start menu:** `src/config/startMenuModel.ts` defines hierarchical, data-driven Win95 menu model and Run aliases.
- **Desktop:** `src/components/Desktop.tsx` + `src/hooks/useDesktopController.tsx` coordinate icon interactions and window launches.
- **Taskbar:** `src/components/StartBar.tsx` + `startBar/*` handle Start menu, task buttons, and shell commands.

## Critical Paths
- Open windows through store `openWindow` action; do not add ad-hoc launch logic in UI components.
- Keep single-instance behavior by content title unless explicitly changing product behavior.
- Preserve Win95 interaction model (pressed buttons, keyboard navigation, taskbar semantics).
- Use data-driven Start menu model instead of hardcoded JSX branching.
- Any new layout/placement logic must clamp to viewport and taskbar-safe bounds.
- If changing persisted state shape, bump persist version and add safe migration defaults.

## Quality
### Existing Tests
- `tests/windowSlice.test.ts`
- `tests/useDesktopController.test.tsx`

### Expectations
- Add/adjust tests for window lifecycle, z-index, placement, and launch flows when behavior changes.
- Maintain strict typing in interaction paths; avoid introducing `any`.
- Prefer deterministic behavior over cursor/time-based heuristics.

## Agent Guidelines
### Skills
- Use brainstorming skill before creative feature/behavior work.
- Use named skills from `AGENTS.md` when task clearly matches them.

### Coding
- Favor small, composable changes in existing slice/config structure.
- Do not break established Win95 visual language unless explicitly requested.
- Preserve accessibility for controls (semantic buttons, keyboard support).

### Safety
- Do not revert unrelated local changes.
- Avoid destructive git/file operations unless explicitly requested.

## Reference Files
- `README.md`
- `package.json`
- `src/store/appStore.ts`
- `src/store/slices/windowSlice.ts`
- `src/config/startMenuModel.ts`
- `src/components/StartBar.tsx`
- `src/hooks/useDesktopController.tsx`
- `src/utils/windowPlacement.ts`
- `windows95_feature_audit.json`
