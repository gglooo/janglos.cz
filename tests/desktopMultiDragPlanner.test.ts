import { describe, expect, it } from "vitest";
import { planDesktopMultiMove } from "../src/hooks/desktop-selection/multiDragPlanner";

describe("planDesktopMultiMove", () => {
    it("plans relative multi-item move when target slots are empty", () => {
        const plan = planDesktopMultiMove({
            assignments: {
                "desktop-trash": { kind: "bin" },
                "desktop-slot-1": "about-me",
                "desktop-slot-2": "projects",
                "desktop-slot-3": null,
                "desktop-slot-4": null,
            },
            desktopSlotOrder: [
                "desktop-trash",
                "desktop-slot-1",
                "desktop-slot-2",
                "desktop-slot-3",
                "desktop-slot-4",
            ],
            draggedItemIds: ["about-me", "projects"],
            sourceSlotId: "desktop-slot-1",
            targetSlotId: "desktop-slot-2",
        });

        expect(plan).toEqual([
            { itemId: "about-me", slotId: "desktop-slot-2" },
            { itemId: "projects", slotId: "desktop-slot-3" },
        ]);
    });

    it("blocks move when target collides with non-selected icon", () => {
        const plan = planDesktopMultiMove({
            assignments: {
                "desktop-trash": { kind: "bin" },
                "desktop-slot-1": "about-me",
                "desktop-slot-2": "projects",
                "desktop-slot-3": "weather",
                "desktop-slot-4": null,
            },
            desktopSlotOrder: [
                "desktop-trash",
                "desktop-slot-1",
                "desktop-slot-2",
                "desktop-slot-3",
                "desktop-slot-4",
            ],
            draggedItemIds: ["about-me", "projects"],
            sourceSlotId: "desktop-slot-1",
            targetSlotId: "desktop-slot-2",
        });

        expect(plan).toBeNull();
    });

    it("blocks move when projected target leaves slot order bounds", () => {
        const plan = planDesktopMultiMove({
            assignments: {
                "desktop-trash": { kind: "bin" },
                "desktop-slot-1": null,
                "desktop-slot-2": null,
                "desktop-slot-3": "about-me",
                "desktop-slot-4": "projects",
            },
            desktopSlotOrder: [
                "desktop-trash",
                "desktop-slot-1",
                "desktop-slot-2",
                "desktop-slot-3",
                "desktop-slot-4",
            ],
            draggedItemIds: ["about-me", "projects"],
            sourceSlotId: "desktop-slot-3",
            targetSlotId: "desktop-slot-4",
        });

        expect(plan).toBeNull();
    });

    it("keeps placement deterministic even when dragged ids are unordered", () => {
        const plan = planDesktopMultiMove({
            assignments: {
                "desktop-trash": { kind: "bin" },
                "desktop-slot-1": "about-me",
                "desktop-slot-2": "projects",
                "desktop-slot-3": null,
                "desktop-slot-4": null,
            },
            desktopSlotOrder: [
                "desktop-trash",
                "desktop-slot-1",
                "desktop-slot-2",
                "desktop-slot-3",
                "desktop-slot-4",
            ],
            draggedItemIds: ["projects", "about-me"],
            sourceSlotId: "desktop-slot-1",
            targetSlotId: "desktop-slot-2",
        });

        expect(plan).toEqual([
            { itemId: "about-me", slotId: "desktop-slot-2" },
            { itemId: "projects", slotId: "desktop-slot-3" },
        ]);
    });
});
