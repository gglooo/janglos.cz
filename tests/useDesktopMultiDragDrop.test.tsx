// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BIN_ASSIGNMENT_ID } from "../src/components/desktop/desktopUtils";
import { useDesktopMultiDragDrop } from "../src/hooks/desktop-selection/useDesktopMultiDragDrop";

describe("useDesktopMultiDragDrop", () => {
    it("moves every selected icon when dropping selection on trash", () => {
        const moveDesktopItem = vi.fn();
        const moveDesktopItemsToSlots = vi.fn();

        const { result } = renderHook(() =>
            useDesktopMultiDragDrop({
                assignments: {
                    "desktop-trash": BIN_ASSIGNMENT_ID,
                    "desktop-slot-1": "about-me",
                    "desktop-slot-2": "projects",
                    "desktop-slot-3": null,
                },
                desktopSlotOrder: [
                    "desktop-trash",
                    "desktop-slot-1",
                    "desktop-slot-2",
                    "desktop-slot-3",
                ],
                selectedItemIds: ["about-me", "projects"],
                moveDesktopItem,
                moveDesktopItemsToSlots,
            }),
        );

        act(() => {
            result.current.onDrop({
                sourceSlotId: "desktop-slot-1",
                targetSlotId: "desktop-trash",
                itemId: "about-me",
                selectedItemIds: ["about-me", "projects"],
            });
        });

        expect(moveDesktopItem).toHaveBeenCalledTimes(2);
        expect(moveDesktopItem).toHaveBeenNthCalledWith(
            1,
            "desktop-slot-1",
            "desktop-trash",
        );
        expect(moveDesktopItem).toHaveBeenNthCalledWith(
            2,
            "desktop-slot-2",
            "desktop-trash",
        );
        expect(moveDesktopItemsToSlots).not.toHaveBeenCalled();
    });
});
