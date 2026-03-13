import type { StateCreator } from "zustand";

export interface UiShellSlice {
    isStartMenuVisible: boolean;
    setStartMenuVisible: (visible: boolean) => void;
    toggleStartMenu: () => void;
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
    setStartMenuVisible: (visible) =>
        set({ isStartMenuVisible: visible } as Partial<T>),
    toggleStartMenu: () =>
        set(
            (state) =>
                ({
                    isStartMenuVisible: !state.isStartMenuVisible,
                }) as Partial<T>
        ),
});
