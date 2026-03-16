import type { StateCreator } from "zustand";

export interface ShellDialogState {
    title: string;
    message: string;
}

export interface UiShellSlice {
    isStartMenuVisible: boolean;
    isPoweredOn: boolean;
    bootSequenceCompleted: boolean;
    shellDialog: ShellDialogState | null;
    setStartMenuVisible: (visible: boolean) => void;
    toggleStartMenu: () => void;
    markBootSequenceCompleted: () => void;
    powerOffShell: () => void;
    showShellDialog: (payload: ShellDialogState) => void;
    hideShellDialog: () => void;
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
    shellDialog: null,
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
            shellDialog: null,
        } as Partial<T>),
    showShellDialog: (payload) =>
        set({
            shellDialog: {
                title: payload.title,
                message: payload.message,
            },
        } as Partial<T>),
    hideShellDialog: () =>
        set({
            shellDialog: null,
        } as Partial<T>),
});
