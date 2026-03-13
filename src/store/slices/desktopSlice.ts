import type { StateCreator } from "zustand";
import { desktopRegistrySeed } from "../../config/desktopIcons";
import {
    DESKTOP_TRASH_ENTRY_ID,
    type DesktopItemId,
    type DesktopLayoutState,
    type DesktopSlotAssignment,
    type DesktopSlotId,
} from "../../types/desktop";

export interface DesktopSlice extends DesktopLayoutState {
    initializeDesktopLayout: (layout?: Partial<DesktopLayoutState>) => void;
    moveDesktopItem: (fromSlotId: DesktopSlotId, toSlotId: DesktopSlotId) => void;
    sendDesktopItemToTrash: (itemId: DesktopItemId) => void;
    restoreTrashItems: () => DesktopItemId[];
}

export type DesktopSliceCreator<T extends DesktopSlice> = StateCreator<
    T,
    [],
    [],
    DesktopSlice
>;

const createDefaultDesktopLayout = (): DesktopLayoutState => ({
    desktopSlotOrder: [...desktopRegistrySeed.slotOrder],
    desktopSlotAssignments: { ...desktopRegistrySeed.slotAssignments },
    trashItemIds: [],
});

const findSlotForItem = (
    assignments: Record<DesktopSlotId, DesktopSlotAssignment>,
    itemId: DesktopItemId
) =>
    (Object.entries(assignments).find(([, assignment]) => assignment === itemId)
        ?.[0] ?? null) as DesktopSlotId | null;

export const createDesktopSlice = <
    T extends DesktopSlice,
>(): DesktopSliceCreator<T> => (set, get) => ({
    ...createDefaultDesktopLayout(),
    initializeDesktopLayout: (layout) => {
        const nextLayout = createDefaultDesktopLayout();
        set({
            desktopSlotOrder: layout?.desktopSlotOrder ?? nextLayout.desktopSlotOrder,
            desktopSlotAssignments:
                layout?.desktopSlotAssignments ?? nextLayout.desktopSlotAssignments,
            trashItemIds: layout?.trashItemIds ?? nextLayout.trashItemIds,
        } as Partial<T>);
    },
    moveDesktopItem: (fromSlotId, toSlotId) =>
        set((state) => {
            if (fromSlotId === toSlotId) {
                return state;
            }

            const fromAssignment = state.desktopSlotAssignments[fromSlotId];
            const toAssignment = state.desktopSlotAssignments[toSlotId];

            if (!fromAssignment || fromAssignment === DESKTOP_TRASH_ENTRY_ID) {
                return state;
            }

            if (toSlotId === desktopRegistrySeed.trashSlotId) {
                if (state.trashItemIds.includes(fromAssignment)) {
                    return state;
                }

                return {
                    desktopSlotAssignments: {
                        ...state.desktopSlotAssignments,
                        [fromSlotId]: null,
                    },
                    trashItemIds: [...state.trashItemIds, fromAssignment],
                } as Partial<T>;
            }

            if (toAssignment === DESKTOP_TRASH_ENTRY_ID) {
                return state;
            }

            return {
                desktopSlotAssignments: {
                    ...state.desktopSlotAssignments,
                    [fromSlotId]: toAssignment ?? null,
                    [toSlotId]: fromAssignment,
                },
            } as Partial<T>;
        }),
    sendDesktopItemToTrash: (itemId) =>
        set((state) => {
            if (state.trashItemIds.includes(itemId)) {
                return state;
            }

            const slotId = findSlotForItem(state.desktopSlotAssignments, itemId);
            const nextAssignments =
                slotId === null
                    ? state.desktopSlotAssignments
                    : {
                          ...state.desktopSlotAssignments,
                          [slotId]: null,
                      };
            const trashItemIds = [...state.trashItemIds, itemId];

            return {
                desktopSlotAssignments: nextAssignments,
                trashItemIds,
            } as Partial<T>;
        }),
    restoreTrashItems: () => {
        const { desktopSlotOrder, desktopSlotAssignments, trashItemIds } = get();
        if (trashItemIds.length === 0) {
            return [];
        }

        const nextAssignments = { ...desktopSlotAssignments };
        const restoredItemIds: DesktopItemId[] = [];
        const remainingTrashItemIds: DesktopItemId[] = [];

        for (const itemId of trashItemIds) {
            const availableSlotId = desktopSlotOrder.find((slotId) => {
                return (
                    slotId !== desktopRegistrySeed.trashSlotId &&
                    nextAssignments[slotId] === null
                );
            });

            if (!availableSlotId) {
                remainingTrashItemIds.push(itemId);
                continue;
            }

            nextAssignments[availableSlotId] = itemId;
            restoredItemIds.push(itemId);
        }

        set({
            desktopSlotAssignments: nextAssignments,
            trashItemIds: remainingTrashItemIds,
        } as Partial<T>);

        return restoredItemIds;
    },
});
