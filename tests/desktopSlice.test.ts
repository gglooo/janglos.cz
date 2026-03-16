import { describe, expect, it } from "vitest";
import { createStore } from "zustand/vanilla";
import { desktopRegistrySeed } from "../src/config/desktopIcons";
import {
    createDesktopSlice,
    type DesktopSlice,
} from "../src/store/slices/desktopSlice";

type DesktopTestStore = DesktopSlice;

const createDesktopStore = () =>
    createStore<DesktopTestStore>()((...args) => ({
        ...createDesktopSlice<DesktopTestStore>()(...args),
    }));

describe("desktopSlice trash interactions", () => {
    it("restores a selected trash item to the first free slot", () => {
        const store = createDesktopStore();
        store.getState().sendDesktopItemToTrash("projects");

        const restored = store.getState().restoreTrashItem("projects");
        const state = store.getState();

        expect(restored).toBe(true);
        expect(state.trashItemIds).not.toContain("projects");

        const restoredSlotId = state.desktopSlotOrder.find((slotId) => {
            return state.desktopSlotAssignments[slotId] === "projects";
        });
        expect(restoredSlotId).toBeTruthy();
    });

    it("restores a trash item into a specific empty slot", () => {
        const store = createDesktopStore();
        store.getState().sendDesktopItemToTrash("weather");

        const targetSlotId = stateFirstEmptySlot(store.getState());
        if (!targetSlotId) {
            throw new Error("Expected an available desktop slot in seed data");
        }

        const restored = store
            .getState()
            .restoreTrashItemToSlot("weather", targetSlotId);
        const state = store.getState();

        expect(restored).toBe(true);
        expect(state.desktopSlotAssignments[targetSlotId]).toBe("weather");
        expect(state.trashItemIds).not.toContain("weather");
    });

    it("does not restore into occupied or trash slot", () => {
        const store = createDesktopStore();
        store.getState().sendDesktopItemToTrash("about-me");

        const occupiedSlotId = desktopRegistrySeed.slotOrder.find((slotId) => {
            return (
                slotId !== desktopRegistrySeed.trashSlotId &&
                store.getState().desktopSlotAssignments[slotId] !== null
            );
        });
        if (!occupiedSlotId) {
            throw new Error("Expected at least one occupied desktop slot");
        }

        const restoreIntoOccupied = store
            .getState()
            .restoreTrashItemToSlot("about-me", occupiedSlotId);
        const restoreIntoTrash = store
            .getState()
            .restoreTrashItemToSlot(
                "about-me",
                desktopRegistrySeed.trashSlotId,
            );

        expect(restoreIntoOccupied).toBe(false);
        expect(restoreIntoTrash).toBe(false);
        expect(store.getState().trashItemIds).toContain("about-me");
    });
});

describe("desktopSlice multi-move interactions", () => {
    it("moves multiple items into free target slots in one operation", () => {
        const store = createDesktopStore();
        const initialState = store.getState();
        const [targetAboutSlot, targetProjectsSlot] =
            initialState.desktopSlotOrder
                .filter((slotId) => {
                    return (
                        slotId !== desktopRegistrySeed.trashSlotId &&
                        initialState.desktopSlotAssignments[slotId] === null
                    );
                })
                .slice(0, 2);
        if (!targetAboutSlot || !targetProjectsSlot) {
            throw new Error("Expected at least two free desktop slots");
        }

        const moved = store.getState().moveDesktopItemsToSlots([
            { itemId: "about-me", slotId: targetAboutSlot },
            { itemId: "projects", slotId: targetProjectsSlot },
        ]);
        const state = store.getState();

        expect(moved).toBe(true);
        expect(state.desktopSlotAssignments[targetAboutSlot]).toBe("about-me");
        expect(state.desktopSlotAssignments[targetProjectsSlot]).toBe(
            "projects",
        );
    });

    it("blocks multi-move when destination includes non-selected item", () => {
        const store = createDesktopStore();
        const state = store.getState();

        const weatherSlot = findSlotForItem(state, "weather");
        const projectsSlot = findSlotForItem(state, "projects");
        if (!weatherSlot) {
            throw new Error("Expected weather item to exist on desktop");
        }
        if (!projectsSlot) {
            throw new Error("Expected projects item to exist on desktop");
        }

        const moved = store.getState().moveDesktopItemsToSlots([
            { itemId: "about-me", slotId: weatherSlot },
            { itemId: "projects", slotId: projectsSlot },
        ]);

        expect(moved).toBe(false);
    });
});

const stateFirstEmptySlot = (state: DesktopSlice) =>
    state.desktopSlotOrder.find((slotId) => {
        return (
            slotId !== desktopRegistrySeed.trashSlotId &&
            state.desktopSlotAssignments[slotId] === null
        );
    });

const findSlotForItem = (state: DesktopSlice, itemId: string) =>
    state.desktopSlotOrder.find((slotId) => {
        return state.desktopSlotAssignments[slotId] === itemId;
    });
