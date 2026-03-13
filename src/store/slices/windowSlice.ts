import type { StateCreator } from "zustand";
import type { ContentType } from "../../types/ContentType";

export interface WindowData {
    id: number;
    title: ContentType;
    initialPosition: { x: number; y: number };
}

export interface WindowSlice {
    openWindows: WindowData[];
    addWindow: (window: WindowData) => void;
    closeWindow: (id: number) => void;

    highestZIndex: number;
    windowZIndexes: Record<number, number>;
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
    addWindow: (window) =>
        set(
            (state) =>
                ({ openWindows: [...state.openWindows, window] }) as Partial<T>
        ),
    closeWindow: (id) =>
        set(
            (state) =>
                ({
                    openWindows: state.openWindows.filter((w) => w.id !== id),
                }) as Partial<T>
        ),

    highestZIndex: 10,
    windowZIndexes: {},
    bringToFront: (windowId) =>
        set((state) => {
            const newZ = state.highestZIndex + 10;
            return {
                highestZIndex: newZ,
                windowZIndexes: { ...state.windowZIndexes, [windowId]: newZ },
            } as Partial<T>;
        }),
});
