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
    moveDesktopItemsToSlots: (
        entries: { itemId: DesktopItemId; slotId: DesktopSlotId }[],
    ) => boolean;
    sendDesktopItemToTrash: (itemId: DesktopItemId) => void;
    restoreTrashItem: (itemId: DesktopItemId) => boolean;
    restoreTrashItemToSlot: (
        itemId: DesktopItemId,
        slotId: DesktopSlotId,
    ) => boolean;
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

const findAvailableSlot = (
    slotOrder: DesktopSlotId[],
    assignments: Record<DesktopSlotId, DesktopSlotAssignment>,
) =>
    slotOrder.find((slotId) => {
        return (
            slotId !== desktopRegistrySeed.trashSlotId &&
            assignments[slotId] === null
        );
    }) ?? null;

const resolveAssignmentItemId = (assignment: DesktopSlotAssignment) => {
    if (typeof assignment === "string") {
        return assignment;
    }

    return null;
};

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
    moveDesktopItemsToSlots: (entries) => {
        if (entries.length === 0) {
            return false;
        }

        const { desktopSlotAssignments } = get();
        const uniqueItemIds = new Set<DesktopItemId>();
        const uniqueTargetSlotIds = new Set<DesktopSlotId>();
        const sourceSlotByItemId = new Map<DesktopItemId, DesktopSlotId>();

        for (const entry of entries) {
            if (
                entry.slotId === desktopRegistrySeed.trashSlotId ||
                !(entry.slotId in desktopSlotAssignments)
            ) {
                return false;
            }

            if (uniqueItemIds.has(entry.itemId) || uniqueTargetSlotIds.has(entry.slotId)) {
                return false;
            }

            uniqueItemIds.add(entry.itemId);
            uniqueTargetSlotIds.add(entry.slotId);
        }

        for (const [slotId, assignment] of Object.entries(desktopSlotAssignments)) {
            const itemId = resolveAssignmentItemId(assignment as DesktopSlotAssignment);
            if (!itemId || itemId === DESKTOP_TRASH_ENTRY_ID) {
                continue;
            }

            if (uniqueItemIds.has(itemId as DesktopItemId)) {
                sourceSlotByItemId.set(itemId as DesktopItemId, slotId as DesktopSlotId);
            }
        }

        for (const entry of entries) {
            if (!sourceSlotByItemId.has(entry.itemId)) {
                return false;
            }
        }

        for (const entry of entries) {
            const assignment = desktopSlotAssignments[entry.slotId];
            const targetItemId = resolveAssignmentItemId(assignment);
            if (!targetItemId || targetItemId === DESKTOP_TRASH_ENTRY_ID) {
                continue;
            }

            if (!uniqueItemIds.has(targetItemId as DesktopItemId)) {
                return false;
            }
        }

        const nextAssignments = { ...desktopSlotAssignments };
        entries.forEach((entry) => {
            const sourceSlotId = sourceSlotByItemId.get(entry.itemId);
            if (!sourceSlotId) {
                return;
            }

            nextAssignments[sourceSlotId] = null;
        });

        entries.forEach((entry) => {
            nextAssignments[entry.slotId] = entry.itemId;
        });

        set({
            desktopSlotAssignments: nextAssignments,
        } as Partial<T>);

        return true;
    },
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
    restoreTrashItem: (itemId) => {
        const { desktopSlotOrder, desktopSlotAssignments, trashItemIds } = get();
        if (!trashItemIds.includes(itemId)) {
            return false;
        }

        const availableSlotId = findAvailableSlot(
            desktopSlotOrder,
            desktopSlotAssignments,
        );
        if (!availableSlotId) {
            return false;
        }

        set({
            desktopSlotAssignments: {
                ...desktopSlotAssignments,
                [availableSlotId]: itemId,
            },
            trashItemIds: trashItemIds.filter((trashedItemId) => {
                return trashedItemId !== itemId;
            }),
        } as Partial<T>);

        return true;
    },
    restoreTrashItemToSlot: (itemId, slotId) => {
        const { desktopSlotAssignments, trashItemIds } = get();
        if (!trashItemIds.includes(itemId)) {
            return false;
        }
        if (
            slotId === desktopRegistrySeed.trashSlotId ||
            desktopSlotAssignments[slotId] !== null
        ) {
            return false;
        }

        set({
            desktopSlotAssignments: {
                ...desktopSlotAssignments,
                [slotId]: itemId,
            },
            trashItemIds: trashItemIds.filter((trashedItemId) => {
                return trashedItemId !== itemId;
            }),
        } as Partial<T>);

        return true;
    },
    restoreTrashItems: () => {
        const { desktopSlotOrder, desktopSlotAssignments, trashItemIds } = get();
        if (trashItemIds.length === 0) {
            return [];
        }

        const nextAssignments = { ...desktopSlotAssignments };
        const restoredItemIds: DesktopItemId[] = [];
        const remainingTrashItemIds: DesktopItemId[] = [];

        for (const itemId of trashItemIds) {
            const availableSlotId = findAvailableSlot(
                desktopSlotOrder,
                nextAssignments,
            );

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
