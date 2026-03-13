import {
    desktopRegistrySeed,
    getDesktopItemById,
} from "../config/desktopIcons";
import type {
    DesktopItemDefinition,
    DesktopItemId,
    DesktopLayoutState,
    DesktopSlotAssignment,
    DesktopSlotId,
} from "../types/desktop";
import { DESKTOP_TRASH_ENTRY_ID } from "../types/desktop";

export interface DesktopSlotViewModel {
    slotId: DesktopSlotId;
    assignment: DesktopSlotAssignment;
    item: DesktopItemDefinition | null;
    isTrashSlot: boolean;
}

export const selectDesktopItemRegistry = () => desktopRegistrySeed.itemRegistry;

export const selectDesktopSlotOrder = <T extends DesktopLayoutState>(state: T) =>
    state.desktopSlotOrder;

export const selectDesktopSlotAssignment = <T extends DesktopLayoutState>(
    state: T,
    slotId: DesktopSlotId
) => state.desktopSlotAssignments[slotId] ?? null;

export const selectDesktopSlotItems = <T extends DesktopLayoutState>(
    state: T
): DesktopSlotViewModel[] =>
    state.desktopSlotOrder.map((slotId) => {
        const assignment = selectDesktopSlotAssignment(state, slotId);
        const item =
            assignment && assignment !== DESKTOP_TRASH_ENTRY_ID
                ? getDesktopItemById(assignment as DesktopItemId)
                : null;

        return {
            slotId,
            assignment,
            item,
            isTrashSlot: slotId === desktopRegistrySeed.trashSlotId,
        };
    });

export const selectTrashItemIds = <T extends DesktopLayoutState>(state: T) =>
    state.trashItemIds;

export const selectTrashItems = <T extends DesktopLayoutState>(state: T) =>
    state.trashItemIds
        .map((itemId) => getDesktopItemById(itemId))
        .filter((item): item is DesktopItemDefinition => item !== undefined);

export const selectIsTrashEmpty = <T extends DesktopLayoutState>(state: T) =>
    state.trashItemIds.length === 0;

export const selectVisibleDesktopItems = () =>
    desktopRegistrySeed.itemIds
        .map((itemId) => getDesktopItemById(itemId))
        .filter(
            (item): item is DesktopItemDefinition =>
                item !== undefined && item.hidden !== true
        );
