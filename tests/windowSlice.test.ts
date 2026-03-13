import { describe, expect, it } from "vitest";
import { createStore } from "zustand/vanilla";
import { createWindowSlice, type WindowSlice } from "../src/store/slices/windowSlice";

type WindowTestStore = WindowSlice;

const ABOUT = "About\u00A0me" as const;
const PROJECTS = "Projects" as const;

const createWindowStore = () =>
    createStore<WindowTestStore>()((...args) => ({
        ...createWindowSlice<WindowTestStore>()(...args),
    }));

describe("windowSlice shell interactions", () => {
    it("keeps a single instance and focuses existing window on relaunch", () => {
        const store = createWindowStore();

        store.getState().openWindow({ title: ABOUT, source: "desktop" });
        const firstWindowId = store.getState().openWindows[0]?.id;
        if (firstWindowId === undefined) {
            throw new Error("Expected first window to exist");
        }

        store.getState().minimizeWindow(firstWindowId);
        store.getState().openWindow({ title: ABOUT, source: "start-menu" });

        const state = store.getState();
        expect(state.openWindows).toHaveLength(1);
        expect(state.openWindows[0]?.id).toBe(firstWindowId);
        expect(state.openWindows[0]?.state).toBe("normal");
        expect(state.nextWindowId).toBe(2);
        expect(state.highestZIndex).toBe(30);
        expect(state.windowZIndexes[firstWindowId]).toBe(30);
    });

    it("updates z-index when launching and bringing windows to front", () => {
        const store = createWindowStore();

        store.getState().openWindow({ title: ABOUT, source: "desktop" });
        store.getState().openWindow({ title: PROJECTS, source: "desktop" });

        const firstWindowId = store.getState().openWindows[0]?.id;
        const secondWindowId = store.getState().openWindows[1]?.id;
        if (firstWindowId === undefined || secondWindowId === undefined) {
            throw new Error("Expected two windows to exist");
        }

        let state = store.getState();
        expect(state.windowZIndexes[firstWindowId]).toBe(20);
        expect(state.windowZIndexes[secondWindowId]).toBe(30);

        store.getState().bringToFront(firstWindowId);
        state = store.getState();

        expect(state.highestZIndex).toBe(40);
        expect(state.windowZIndexes[firstWindowId]).toBe(40);
        expect(state.windowZIndexes[secondWindowId]).toBe(30);

        store.getState().bringToFront(secondWindowId);
        state = store.getState();

        expect(state.highestZIndex).toBe(50);
        expect(state.windowZIndexes[firstWindowId]).toBe(40);
        expect(state.windowZIndexes[secondWindowId]).toBe(50);
    });
});
