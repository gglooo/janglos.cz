import type { StateCreator } from "zustand";

export interface UiShellSlice {
    isStartMenuVisible: boolean;
    isPoweredOn: boolean;
    bootSequenceCompleted: boolean;
    setStartMenuVisible: (visible: boolean) => void;
    toggleStartMenu: () => void;
    markBootSequenceCompleted: () => void;
    powerOffShell: () => void;
}

export type UiShellSliceCreator<T extends UiShellSlice> = StateCreator<
    T,
    [],
    [],
    UiShellSlice
>;

export const createUiShellSlice = <
    T extends UiShellSlice,
>(): UiShellSliceCreator<T> => (set) => ({
    isStartMenuVisible: false,
    isPoweredOn: false,
    bootSequenceCompleted: false,
    setStartMenuVisible: (visible) =>
        set({ isStartMenuVisible: visible } as Partial<T>),
    toggleStartMenu: () =>
        set(
            (state) =>
                ({
                    isStartMenuVisible: !state.isStartMenuVisible,
                }) as Partial<T>
        ),
    markBootSequenceCompleted: () =>
        set({
            isPoweredOn: true,
            bootSequenceCompleted: true,
        } as Partial<T>),
    powerOffShell: () =>
        set({
            isStartMenuVisible: false,
            isPoweredOn: false,
            bootSequenceCompleted: false,
        } as Partial<T>),
});
