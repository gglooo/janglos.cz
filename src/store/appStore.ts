import { create } from "zustand";
import type { ReactElement } from "react";
import { ContentType } from "../types/ContentType";

type DesktopElement = ReactElement<{
    index: string;
    children?: unknown;
}>;

export interface WindowData {
    id: number;
    title: ContentType;
    initialPosition: { x: number; y: number };
}

interface AppState {
    openWindows: WindowData[];
    addWindow: (window: WindowData) => void;
    closeWindow: (id: number) => void;

    highestZIndex: number;
    windowZIndexes: Record<number, number>;
    bringToFront: (windowId: number) => void;

    isStartMenuVisible: boolean;
    setStartMenuVisible: (visible: boolean) => void;
    toggleStartMenu: () => void;

    trashContent: DesktopElement[];
    addToTrash: (element: DesktopElement) => void;
    clearTrash: () => DesktopElement[];
}

export const useAppStore = create<AppState>((set, get) => ({
    openWindows: [],
    addWindow: (window) =>
        set((state) => ({ openWindows: [...state.openWindows, window] })),
    closeWindow: (id) =>
        set((state) => ({
            openWindows: state.openWindows.filter((w) => w.id !== id),
        })),

    highestZIndex: 10,
    windowZIndexes: {},
    bringToFront: (windowId) =>
        set((state) => {
            const newZ = state.highestZIndex + 10;
            return {
                highestZIndex: newZ,
                windowZIndexes: { ...state.windowZIndexes, [windowId]: newZ },
            };
        }),

    isStartMenuVisible: false,
    setStartMenuVisible: (visible) => set({ isStartMenuVisible: visible }),
    toggleStartMenu: () =>
        set((state) => ({ isStartMenuVisible: !state.isStartMenuVisible })),

    trashContent: [],
    addToTrash: (element) =>
        set((state) => ({ trashContent: [...state.trashContent, element] })),
    clearTrash: () => {
        const content = get().trashContent;
        set({ trashContent: [] });
        return content;
    },
}));
