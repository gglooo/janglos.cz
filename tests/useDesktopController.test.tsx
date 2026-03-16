// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DesktopStoreCompat } from "../src/components/desktop/desktopStore";
import type { DesktopItemRegistry } from "../src/components/desktop/desktopTypes";
import { useDesktopController } from "../src/hooks/useDesktopController";

const mockUseDesktopStore = vi.fn();

vi.mock("../src/components/desktop/desktopStore", () => ({
    useDesktopStore: (selector: (state: DesktopStoreCompat) => unknown) =>
        mockUseDesktopStore(selector),
}));

const registry: DesktopItemRegistry = {
    projects: {
        id: "projects",
        name: "Projects",
        launch: {
            kind: "window",
            contentId: "Projects",
            windowTitle: "Projects",
        },
    },
};

const createState = (): DesktopStoreCompat => ({
    openWindows: [],
    closeWindow: vi.fn(),
    windowZIndexes: {},
    bringToFront: vi.fn(),
    openWindow: vi.fn(),
    updateWindowBounds: vi.fn(),
    minimizeWindow: vi.fn(),
    maximizeWindow: vi.fn(),
    restoreWindow: vi.fn(),
    setStartMenuVisible: vi.fn(),
    desktopItemRegistry: registry,
    desktopSlotOrder: ["desktop-trash", "desktop-slot-1"],
    desktopSlotAssignments: {
        "desktop-trash": { kind: "bin" },
        "desktop-slot-1": "projects",
    },
    trashItemIds: [],
    moveDesktopItem: vi.fn(),
    sendDesktopItemToTrash: vi.fn(),
    restoreTrashItem: vi.fn(),
    restoreTrashItemToSlot: vi.fn(),
    restoreTrashItems: vi.fn(),
    minimizeAllWindows: function (): void {
        throw new Error("Function not implemented.");
    },
    cascadeWindows: function (): void {
        throw new Error("Function not implemented.");
    },
    tileWindowsHorizontally: function (): void {
        throw new Error("Function not implemented.");
    },
    tileWindowsVertically: function (): void {
        throw new Error("Function not implemented.");
    },
});

describe("useDesktopController shell interactions", () => {
    let state: DesktopStoreCompat;

    beforeEach(() => {
        state = createState();
        mockUseDesktopStore.mockImplementation(
            (selector: (storeState: DesktopStoreCompat) => unknown) =>
                selector(state),
        );
    });

    it("opens a window from desktop icon click using desktop launch source", () => {
        const { result } = renderHook(() => useDesktopController());

        act(() => {
            result.current.handleIconClick("projects")();
        });

        expect(state.openWindow).toHaveBeenCalledTimes(1);
        expect(state.openWindow).toHaveBeenCalledWith({
            title: "Projects",
            source: "desktop",
        });
    });

    it("prefers launchDesktopItem handler when available", () => {
        const launchDesktopItem = vi.fn();
        state.launchDesktopItem = launchDesktopItem;

        const { result } = renderHook(() => useDesktopController());

        act(() => {
            result.current.handleIconClick("projects")();
        });

        expect(launchDesktopItem).toHaveBeenCalledTimes(1);
        expect(launchDesktopItem).toHaveBeenCalledWith({
            itemId: "projects",
            source: "desktop",
        });
        expect(state.openWindow).not.toHaveBeenCalled();
    });

    it("opens trash window when trash is clicked", () => {
        const { result } = renderHook(() => useDesktopController());

        act(() => {
            result.current.handleTrashClick();
        });

        expect(state.openWindow).toHaveBeenCalledTimes(1);
        expect(state.openWindow).toHaveBeenCalledWith({
            title: "Trash",
            source: "desktop",
        });
    });

    it("restores a trash item when dropped from trash list to desktop slot", () => {
        const { result } = renderHook(() => useDesktopController());

        act(() => {
            result.current.handleMove("trash-item:projects", "desktop-slot-1");
        });

        expect(state.restoreTrashItemToSlot).toHaveBeenCalledTimes(1);
        expect(state.restoreTrashItemToSlot).toHaveBeenCalledWith(
            "projects",
            "desktop-slot-1",
        );
    });
});
