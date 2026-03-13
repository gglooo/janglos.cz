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
}

export interface OpenWindowInput {
    title: ContentType;
    source: WindowLaunchSource;
    requestedPosition?: { x: number; y: number };
}

export interface WindowSlice {
    openWindows: WindowData[];
    openWindow: (input: OpenWindowInput) => void;
    closeWindow: (id: number) => void;
    updateWindowBounds: (windowId: number, bounds: WindowPlacementBounds) => void;

    nextWindowId: number;
    highestZIndex: number;
    windowZIndexes: Record<number, number>;
    windowBoundsById: Record<number, WindowPlacementBounds>;
    lastKnownBoundsByTitle: Partial<Record<ContentType, WindowPlacementBounds>>;
    bringToFront: (windowId: number) => void;
}

export type WindowSliceCreator<T extends WindowSlice> = StateCreator<
    T,
    [],
    [],
    WindowSlice
>;

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
                return {
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
                openWindows: [...state.openWindows, { id, title, bounds: nextBounds }],
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
            const nextLastKnownBoundsByTitle = { ...state.lastKnownBoundsByTitle };

            if (removedWindow && nextBoundsById[id]) {
                nextLastKnownBoundsByTitle[removedWindow.title] = nextBoundsById[id];
            }

            delete nextZIndexes[id];
            delete nextBoundsById[id];

            return {
                openWindows: remainingWindows,
                windowZIndexes: nextZIndexes,
                windowBoundsById: nextBoundsById,
                lastKnownBoundsByTitle: nextLastKnownBoundsByTitle,
            } as Partial<T>;
        }),
    updateWindowBounds: (windowId, bounds) =>
        set((state) => {
            const windowData = state.openWindows.find((w) => w.id === windowId);
            if (!windowData) {
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

    nextWindowId: 1,
    highestZIndex: 10,
    windowZIndexes: {},
    windowBoundsById: {},
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
