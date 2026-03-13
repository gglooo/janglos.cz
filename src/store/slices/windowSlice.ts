import type { StateCreator } from "zustand";
import type { ContentType } from "../../types/ContentType";
import {
    clampWindowBounds,
    computeWindowPlacement,
    DEFAULT_TASKBAR_HEIGHT,
    type WindowLaunchSource,
    type WindowPlacementBounds,
} from "../../utils/windowPlacement";

export interface WindowData {
    id: number;
    title: ContentType;
    bounds: WindowPlacementBounds;
    state: WindowState;
}

export interface OpenWindowInput {
    title: ContentType;
    source: WindowLaunchSource;
    requestedPosition?: { x: number; y: number };
}

export type WindowState = "normal" | "minimized" | "maximized";

export interface WindowSlice {
    openWindows: WindowData[];
    openWindow: (input: OpenWindowInput) => void;
    closeWindow: (id: number) => void;
    updateWindowBounds: (windowId: number, bounds: WindowPlacementBounds) => void;
    minimizeWindow: (windowId: number) => void;
    maximizeWindow: (windowId: number) => void;
    restoreWindow: (windowId: number) => void;
    minimizeAllWindows: () => void;
    cascadeWindows: () => void;
    tileWindowsHorizontally: () => void;
    tileWindowsVertically: () => void;

    nextWindowId: number;
    highestZIndex: number;
    windowZIndexes: Record<number, number>;
    windowBoundsById: Record<number, WindowPlacementBounds>;
    restoreBoundsById: Record<number, WindowPlacementBounds>;
    lastKnownBoundsByTitle: Partial<Record<ContentType, WindowPlacementBounds>>;
    bringToFront: (windowId: number) => void;
}

export type WindowSliceCreator<T extends WindowSlice> = StateCreator<
    T,
    [],
    [],
    WindowSlice
>;

type WindowLayoutMode = "cascade" | "tile-horizontal" | "tile-vertical";

const LAYOUT_MIN_WIDTH = 260;
const LAYOUT_MIN_HEIGHT = 160;
const LAYOUT_CASCADE_OFFSET = 26;

const getViewportBounds = () => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1280,
    height: typeof window !== "undefined" ? window.innerHeight : 720,
});

const getEligibleWindows = (state: WindowSlice) =>
    state.openWindows
        .filter((windowData) => windowData.state !== "minimized")
        .sort((left, right) => {
            const leftZ = state.windowZIndexes[left.id] ?? 0;
            const rightZ = state.windowZIndexes[right.id] ?? 0;
            return leftZ - rightZ;
        });

const computeCascadeBounds = (
    index: number,
    windowCount: number,
    viewport: { width: number; height: number },
): WindowPlacementBounds => {
    const availableHeight = Math.max(120, viewport.height - DEFAULT_TASKBAR_HEIGHT);
    const width = Math.max(
        LAYOUT_MIN_WIDTH,
        Math.round(Math.min(viewport.width, viewport.width * 0.72)),
    );
    const height = Math.max(
        LAYOUT_MIN_HEIGHT,
        Math.round(Math.min(availableHeight, availableHeight * 0.72)),
    );

    const maxXSteps = Math.max(
        1,
        Math.floor((Math.max(0, viewport.width - width) + 1) / LAYOUT_CASCADE_OFFSET),
    );
    const maxYSteps = Math.max(
        1,
        Math.floor((Math.max(0, availableHeight - height) + 1) / LAYOUT_CASCADE_OFFSET),
    );
    const cycle = Math.max(1, Math.min(windowCount, maxXSteps, maxYSteps));
    const offsetStep = index % cycle;

    return {
        x: offsetStep * LAYOUT_CASCADE_OFFSET,
        y: offsetStep * LAYOUT_CASCADE_OFFSET,
        width,
        height,
    };
};

const computeTiledBounds = (
    index: number,
    windowCount: number,
    viewport: { width: number; height: number },
    mode: "tile-horizontal" | "tile-vertical",
): WindowPlacementBounds => {
    const availableWidth = Math.max(LAYOUT_MIN_WIDTH, viewport.width);
    const availableHeight = Math.max(
        LAYOUT_MIN_HEIGHT,
        viewport.height - DEFAULT_TASKBAR_HEIGHT,
    );

    const maxColumnsByMinWidth = Math.max(
        1,
        Math.floor(availableWidth / LAYOUT_MIN_WIDTH),
    );
    const maxRowsByMinHeight = Math.max(
        1,
        Math.floor(availableHeight / LAYOUT_MIN_HEIGHT),
    );

    const columns =
        mode === "tile-vertical"
            ? Math.min(windowCount, maxColumnsByMinWidth)
            : Math.ceil(windowCount / Math.min(windowCount, maxRowsByMinHeight));
    const rows =
        mode === "tile-horizontal"
            ? Math.min(windowCount, maxRowsByMinHeight)
            : Math.ceil(windowCount / Math.min(windowCount, maxColumnsByMinWidth));

    const baseWidth = Math.max(LAYOUT_MIN_WIDTH, Math.floor(availableWidth / columns));
    const baseHeight = Math.max(
        LAYOUT_MIN_HEIGHT,
        Math.floor(availableHeight / rows),
    );

    const row =
        mode === "tile-horizontal"
            ? Math.floor(index / columns)
            : index % rows;
    const column =
        mode === "tile-horizontal"
            ? index % columns
            : Math.floor(index / rows);

    const x = column * baseWidth;
    const y = row * baseHeight;
    const width =
        column === columns - 1 ? availableWidth - x : Math.min(baseWidth, availableWidth);
    const height =
        row === rows - 1 ? availableHeight - y : Math.min(baseHeight, availableHeight);

    return {
        x,
        y,
        width,
        height,
    };
};

const computeLayoutBounds = (
    index: number,
    windowCount: number,
    viewport: { width: number; height: number },
    mode: WindowLayoutMode,
) => {
    if (mode === "cascade") {
        return computeCascadeBounds(index, windowCount, viewport);
    }

    return computeTiledBounds(index, windowCount, viewport, mode);
};

const applyWindowLayout = <T extends WindowSlice>(
    state: T,
    mode: WindowLayoutMode,
) => {
    const eligibleWindows = getEligibleWindows(state);
    if (eligibleWindows.length === 0) {
        return state as Partial<T>;
    }

    const viewport = getViewportBounds();
    const targetBoundsById = new Map<number, WindowPlacementBounds>();

    eligibleWindows.forEach((windowData, index) => {
        const nextBounds = clampWindowBounds(
            computeLayoutBounds(index, eligibleWindows.length, viewport, mode),
            viewport,
            DEFAULT_TASKBAR_HEIGHT,
        );
        targetBoundsById.set(windowData.id, nextBounds);
    });

    const nextOpenWindows = state.openWindows.map((windowData) => {
        const targetBounds = targetBoundsById.get(windowData.id);
        if (!targetBounds) {
            return windowData;
        }

        return {
            ...windowData,
            state: "normal" as const,
            bounds: targetBounds,
        };
    });

    const nextWindowBoundsById = { ...state.windowBoundsById };
    const nextLastKnownBoundsByTitle = { ...state.lastKnownBoundsByTitle };
    const nextRestoreBoundsById = { ...state.restoreBoundsById };
    const nextWindowZIndexes = { ...state.windowZIndexes };

    const baseZ = state.highestZIndex + 10;
    eligibleWindows.forEach((windowData, index) => {
        const targetBounds = targetBoundsById.get(windowData.id);
        if (!targetBounds) {
            return;
        }

        nextWindowBoundsById[windowData.id] = targetBounds;
        nextLastKnownBoundsByTitle[windowData.title] = targetBounds;
        nextWindowZIndexes[windowData.id] = baseZ + index * 10;
        delete nextRestoreBoundsById[windowData.id];
    });

    return {
        openWindows: nextOpenWindows,
        windowBoundsById: nextWindowBoundsById,
        lastKnownBoundsByTitle: nextLastKnownBoundsByTitle,
        windowZIndexes: nextWindowZIndexes,
        restoreBoundsById: nextRestoreBoundsById,
        highestZIndex: baseZ + (eligibleWindows.length - 1) * 10,
    } as Partial<T>;
};

export const createWindowSlice = <
    T extends WindowSlice,
>(): WindowSliceCreator<T> => (set) => ({
    openWindows: [],
    openWindow: ({ title, source, requestedPosition }) =>
        set((state) => {
            const existingWindow = state.openWindows.find((windowData) => {
                return windowData.title === title;
            });

            if (existingWindow) {
                const newZ = state.highestZIndex + 10;
                const nextOpenWindows = state.openWindows.map((windowData) =>
                    windowData.id === existingWindow.id
                        ? { ...windowData, state: "normal" as const }
                        : windowData,
                );
                return {
                    openWindows: nextOpenWindows,
                    highestZIndex: newZ,
                    windowZIndexes: {
                        ...state.windowZIndexes,
                        [existingWindow.id]: newZ,
                    },
                } as Partial<T>;
            }

            const viewport = {
                width: typeof window !== "undefined" ? window.innerWidth : 1280,
                height: typeof window !== "undefined" ? window.innerHeight : 720,
            };
            const placement = computeWindowPlacement({
                title,
                source,
                openWindows: state.openWindows,
                boundsById: state.windowBoundsById,
                lastKnownBoundsByTitle: state.lastKnownBoundsByTitle,
                viewport,
                taskbarHeight: DEFAULT_TASKBAR_HEIGHT,
                requestedPosition,
            });
            const nextBounds = clampWindowBounds(
                placement,
                viewport,
                DEFAULT_TASKBAR_HEIGHT,
            );

            const id = state.nextWindowId;
            const newZ = state.highestZIndex + 10;

            return {
                nextWindowId: id + 1,
                openWindows: [
                    ...state.openWindows,
                    { id, title, bounds: nextBounds, state: "normal" },
                ],
                highestZIndex: newZ,
                windowZIndexes: { ...state.windowZIndexes, [id]: newZ },
                windowBoundsById: { ...state.windowBoundsById, [id]: nextBounds },
                lastKnownBoundsByTitle: {
                    ...state.lastKnownBoundsByTitle,
                    [title]: nextBounds,
                },
            } as Partial<T>;
        }),
    closeWindow: (id) =>
        set((state) => {
            const remainingWindows = state.openWindows.filter((w) => w.id !== id);
            const removedWindow = state.openWindows.find((w) => w.id === id);
            const nextZIndexes = { ...state.windowZIndexes };
            const nextBoundsById = { ...state.windowBoundsById };
            const nextRestoreBoundsById = { ...state.restoreBoundsById };
            const nextLastKnownBoundsByTitle = { ...state.lastKnownBoundsByTitle };

            if (removedWindow && nextBoundsById[id]) {
                nextLastKnownBoundsByTitle[removedWindow.title] = nextBoundsById[id];
            }

            delete nextZIndexes[id];
            delete nextBoundsById[id];
            delete nextRestoreBoundsById[id];

            return {
                openWindows: remainingWindows,
                windowZIndexes: nextZIndexes,
                windowBoundsById: nextBoundsById,
                restoreBoundsById: nextRestoreBoundsById,
                lastKnownBoundsByTitle: nextLastKnownBoundsByTitle,
            } as Partial<T>;
        }),
    updateWindowBounds: (windowId, bounds) =>
        set((state) => {
            const windowData = state.openWindows.find((w) => w.id === windowId);
            if (!windowData) {
                return state as Partial<T>;
            }
            if (windowData.state === "maximized") {
                return state as Partial<T>;
            }

            const viewport = {
                width: typeof window !== "undefined" ? window.innerWidth : 1280,
                height: typeof window !== "undefined" ? window.innerHeight : 720,
            };
            const nextBounds = clampWindowBounds(
                bounds,
                viewport,
                DEFAULT_TASKBAR_HEIGHT,
            );
            const nextOpenWindows = state.openWindows.map((windowItem) =>
                windowItem.id === windowId
                    ? { ...windowItem, bounds: nextBounds }
                    : windowItem,
            );

            return {
                openWindows: nextOpenWindows,
                windowBoundsById: {
                    ...state.windowBoundsById,
                    [windowId]: nextBounds,
                },
                lastKnownBoundsByTitle: {
                    ...state.lastKnownBoundsByTitle,
                    [windowData.title]: nextBounds,
                },
            } as Partial<T>;
        }),
    minimizeWindow: (windowId) =>
        set((state) => {
            const windowData = state.openWindows.find((w) => w.id === windowId);
            if (!windowData || windowData.state === "minimized") {
                return state as Partial<T>;
            }

            return {
                openWindows: state.openWindows.map((windowItem) =>
                    windowItem.id === windowId
                        ? { ...windowItem, state: "minimized" as const }
                        : windowItem,
                ),
            } as Partial<T>;
        }),
    maximizeWindow: (windowId) =>
        set((state) => {
            const windowData = state.openWindows.find((w) => w.id === windowId);
            if (!windowData || windowData.state === "maximized") {
                return state as Partial<T>;
            }

            const viewport = {
                width: typeof window !== "undefined" ? window.innerWidth : 1280,
                height: typeof window !== "undefined" ? window.innerHeight : 720,
            };
            const maximizedBounds = clampWindowBounds(
                {
                    x: 0,
                    y: 0,
                    width: viewport.width,
                    height: viewport.height - DEFAULT_TASKBAR_HEIGHT,
                },
                viewport,
                DEFAULT_TASKBAR_HEIGHT,
            );
            const currentBounds =
                state.windowBoundsById[windowId] ?? windowData.bounds;
            const newZ = state.highestZIndex + 10;

            return {
                highestZIndex: newZ,
                openWindows: state.openWindows.map((windowItem) =>
                    windowItem.id === windowId
                        ? {
                              ...windowItem,
                              state: "maximized" as const,
                              bounds: maximizedBounds,
                          }
                        : windowItem,
                ),
                windowZIndexes: { ...state.windowZIndexes, [windowId]: newZ },
                windowBoundsById: {
                    ...state.windowBoundsById,
                    [windowId]: maximizedBounds,
                },
                restoreBoundsById: {
                    ...state.restoreBoundsById,
                    [windowId]: currentBounds,
                },
                lastKnownBoundsByTitle: {
                    ...state.lastKnownBoundsByTitle,
                    [windowData.title]: maximizedBounds,
                },
            } as Partial<T>;
        }),
    restoreWindow: (windowId) =>
        set((state) => {
            const windowData = state.openWindows.find((w) => w.id === windowId);
            if (!windowData || windowData.state === "normal") {
                return state as Partial<T>;
            }

            const restoreBounds =
                state.restoreBoundsById[windowId] ??
                state.windowBoundsById[windowId] ??
                windowData.bounds;
            const newZ = state.highestZIndex + 10;
            const nextState = {
                openWindows: state.openWindows.map((windowItem) =>
                    windowItem.id === windowId
                        ? {
                              ...windowItem,
                              state: "normal" as const,
                              bounds:
                                  windowItem.state === "maximized"
                                      ? restoreBounds
                                      : windowItem.bounds,
                          }
                        : windowItem,
                ),
                highestZIndex: newZ,
                windowZIndexes: { ...state.windowZIndexes, [windowId]: newZ },
                windowBoundsById: {
                    ...state.windowBoundsById,
                    [windowId]:
                        windowData.state === "maximized"
                            ? restoreBounds
                            : state.windowBoundsById[windowId] ?? windowData.bounds,
                },
                lastKnownBoundsByTitle: {
                    ...state.lastKnownBoundsByTitle,
                    [windowData.title]:
                        windowData.state === "maximized"
                            ? restoreBounds
                            : state.windowBoundsById[windowId] ?? windowData.bounds,
                },
                restoreBoundsById: { ...state.restoreBoundsById },
            };

            if (windowData.state === "maximized") {
                delete nextState.restoreBoundsById[windowId];
            }

            return nextState as Partial<T>;
        }),
    minimizeAllWindows: () =>
        set((state) => {
            const hasNormalOrMaximizedWindow = state.openWindows.some(
                (windowData) => windowData.state !== "minimized",
            );

            if (!hasNormalOrMaximizedWindow) {
                return state as Partial<T>;
            }

            return {
                openWindows: state.openWindows.map((windowData) => ({
                    ...windowData,
                    state: "minimized" as const,
                })),
            } as Partial<T>;
        }),
    cascadeWindows: () =>
        set((state) => applyWindowLayout(state, "cascade")),
    tileWindowsHorizontally: () =>
        set((state) => applyWindowLayout(state, "tile-horizontal")),
    tileWindowsVertically: () =>
        set((state) => applyWindowLayout(state, "tile-vertical")),

    nextWindowId: 1,
    highestZIndex: 10,
    windowZIndexes: {},
    windowBoundsById: {},
    restoreBoundsById: {},
    lastKnownBoundsByTitle: {},
    bringToFront: (windowId) =>
        set((state) => {
            const newZ = state.highestZIndex + 10;
            return {
                highestZIndex: newZ,
                windowZIndexes: { ...state.windowZIndexes, [windowId]: newZ },
            } as Partial<T>;
        }),
});
