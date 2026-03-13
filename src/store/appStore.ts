import { create } from "zustand";
import {
    createDesktopSlice,
    type DesktopSlice,
} from "./slices/desktopSlice";
import {
    createUiShellSlice,
    type UiShellSlice,
} from "./slices/uiShellSlice";
import {
    createWindowSlice,
    type WindowData,
    type WindowSlice,
} from "./slices/windowSlice";

export type AppState = WindowSlice & UiShellSlice & DesktopSlice;
export type { WindowData };

export const useAppStore = create<AppState>((...args) => ({
    ...createWindowSlice<AppState>()(...args),
    ...createUiShellSlice<AppState>()(...args),
    ...createDesktopSlice<AppState>()(...args),
}));
