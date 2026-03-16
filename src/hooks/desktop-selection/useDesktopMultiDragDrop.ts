import { useCallback } from "react";
import {
    BIN_ASSIGNMENT_ID,
    BIN_SLOT_ID,
} from "../../components/desktop/desktopUtils";
import type { DesktopSlotAssignments } from "../../components/desktop/desktopTypes";
import {
    planDesktopMultiMove,
    type DesktopMultiDragPlanEntry,
} from "./multiDragPlanner";

interface DesktopMultiDropPayload {
    sourceSlotId: string;
    targetSlotId: string;
    itemId?: string;
    selectedItemIds?: string[];
}

interface UseDesktopMultiDragDropInput {
    assignments: DesktopSlotAssignments;
    desktopSlotOrder: string[];
    selectedItemIds: string[];
    moveDesktopItemsToSlots?: (entries: DesktopMultiDragPlanEntry[]) => boolean;
    moveDesktopItem: (fromSlotId: string, toSlotId: string) => void;
}

const createSlotByItemMap = (assignments: DesktopSlotAssignments) => {
    const slotByItemId = new Map<string, string>();

    Object.entries(assignments).forEach(([slotId, assignment]) => {
        if (typeof assignment === "string") {
            slotByItemId.set(assignment, slotId);
            return;
        }

        if (!assignment || typeof assignment !== "object") {
            return;
        }

        const itemId =
            assignment.itemId ?? assignment.desktopItemId ?? assignment.id ?? null;
        if (typeof itemId === "string") {
            slotByItemId.set(itemId, slotId);
        }
    });

    return slotByItemId;
};

const isBinTarget = (targetSlotId: string, assignment: unknown) => {
    if (targetSlotId === BIN_SLOT_ID || assignment === BIN_ASSIGNMENT_ID) {
        return true;
    }

    if (!assignment || typeof assignment !== "object") {
        return false;
    }

    const kind = "kind" in assignment ? assignment.kind : null;
    return typeof kind === "string" && kind.toLowerCase().includes("bin");
};

export const useDesktopMultiDragDrop = ({
    assignments,
    desktopSlotOrder,
    selectedItemIds,
    moveDesktopItemsToSlots,
    moveDesktopItem,
}: UseDesktopMultiDragDropInput) => {
    const onDrop = useCallback(
        (payload: DesktopMultiDropPayload) => {
            const draggedGroup = payload.selectedItemIds?.length
                ? payload.selectedItemIds
                : payload.itemId
                  ? [payload.itemId]
                  : [];

            const effectiveDraggedIds = draggedGroup.length
                ? draggedGroup
                : selectedItemIds;

            if (effectiveDraggedIds.length <= 1) {
                moveDesktopItem(payload.sourceSlotId, payload.targetSlotId);
                return;
            }

            const targetAssignment = assignments[payload.targetSlotId];
            if (isBinTarget(payload.targetSlotId, targetAssignment)) {
                const slotByItemId = createSlotByItemMap(assignments);
                for (const itemId of new Set(effectiveDraggedIds)) {
                    const sourceSlotId = slotByItemId.get(itemId);
                    if (!sourceSlotId || sourceSlotId === payload.targetSlotId) {
                        continue;
                    }

                    moveDesktopItem(sourceSlotId, payload.targetSlotId);
                }
                return;
            }

            const plan = planDesktopMultiMove({
                assignments,
                desktopSlotOrder,
                draggedItemIds: effectiveDraggedIds,
                sourceSlotId: payload.sourceSlotId,
                targetSlotId: payload.targetSlotId,
            });

            if (!plan || plan.length === 0) {
                return;
            }

            moveDesktopItemsToSlots?.(plan);
        },
        [
            assignments,
            desktopSlotOrder,
            moveDesktopItem,
            moveDesktopItemsToSlots,
            selectedItemIds,
        ],
    );

    return {
        onDrop,
    };
};
