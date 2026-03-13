import { useDesktopStore } from "../components/desktop/desktopStore";
import {
    BIN_ASSIGNMENT_ID,
    BIN_SLOT_ID,
    createFallbackAssignments,
    defaultDesktopSlotOrder,
    normalizeDesktopRegistry,
    resolveAssignmentItemId,
    resolveLaunchUrl,
    resolveWindowTitle,
} from "../components/desktop/desktopUtils";
import type { DesktopItemId, DesktopSlotId } from "../types/desktop";

export const useDesktopController = () => {
    const openWindows = useDesktopStore((s) => s.openWindows);
    const closeWindow = useDesktopStore((s) => s.closeWindow);
    const openWindow = useDesktopStore((s) => s.openWindow);

    const windowZIndexes = useDesktopStore((s) => s.windowZIndexes);
    const bringToFront = useDesktopStore((s) => s.bringToFront);

    const setStartMenuVisible = useDesktopStore((s) => s.setStartMenuVisible);

    const desktopItemRegistry = useDesktopStore((s) => s.desktopItemRegistry);
    const desktopSlotOrder =
        useDesktopStore((s) => s.desktopSlotOrder ?? s.desktopSlots) ??
        defaultDesktopSlotOrder;
    const desktopSlotAssignments =
        useDesktopStore((s) => s.desktopSlotAssignments ?? s.slotAssignments) ??
        null;
    const trashItemIds = useDesktopStore(
        (s) => s.trashItemIds ?? s.trashedItemIds,
    );
    const moveDesktopItem = useDesktopStore((s) => s.moveDesktopItem);
    const sendDesktopItemToTrash = useDesktopStore(
        (s) => s.sendDesktopItemToTrash,
    );
    const restoreTrashItems = useDesktopStore((s) => s.restoreTrashItems);
    const launchDesktopItem = useDesktopStore((s) => s.launchDesktopItem);

    const registry = normalizeDesktopRegistry(desktopItemRegistry);
    const effectiveTrashItemIds = trashItemIds ?? [];
    const assignments =
        desktopSlotAssignments ??
        createFallbackAssignments(
            registry,
            desktopSlotOrder,
            effectiveTrashItemIds,
        );
    const trashCount = effectiveTrashItemIds.length;

    const handleIconClick = (itemId: string) => () => {
        const item = registry[itemId];
        if (!item) {
            return;
        }

        if (launchDesktopItem) {
            launchDesktopItem({ itemId, source: "desktop" });
            return;
        }

        const launchUrl = resolveLaunchUrl(item);
        if (launchUrl) {
            window.open(launchUrl);
            return;
        }

        if (item.onClick) {
            item.onClick();
            return;
        }

        const title = resolveWindowTitle(item);
        if (!title) {
            return;
        }

        openWindow({ title, source: "desktop" });
    };

    const handleMove = (fromSlotId: string, toSlotId: string) => {
        if (fromSlotId === toSlotId) {
            return;
        }

        const fromItemId = resolveAssignmentItemId(assignments[fromSlotId]);
        if (!fromItemId || fromItemId === BIN_ASSIGNMENT_ID) {
            return;
        }

        if (toSlotId === BIN_SLOT_ID) {
            sendDesktopItemToTrash?.(fromItemId as DesktopItemId);
            return;
        }

        moveDesktopItem?.(
            fromSlotId as DesktopSlotId,
            toSlotId as DesktopSlotId,
        );
    };

    const handleTrashClick = () => {
        restoreTrashItems?.();
    };

    return {
        assignments,
        bringToFront,
        closeWindow,
        desktopSlotOrder,
        handleIconClick,
        handleMove,
        handleTrashClick,
        openWindows,
        registry,
        setStartMenuVisible,
        trashCount,
        windowZIndexes,
    };
};
