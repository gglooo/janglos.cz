import type { DesktopSlotAssignments } from "../../components/desktop/desktopTypes";

export interface DesktopMultiDragPlanEntry {
    itemId: string;
    slotId: string;
}

interface PlanDesktopMultiMoveInput {
    assignments: DesktopSlotAssignments;
    desktopSlotOrder: string[];
    draggedItemIds: string[];
    sourceSlotId: string;
    targetSlotId: string;
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

export const planDesktopMultiMove = ({
    assignments,
    desktopSlotOrder,
    draggedItemIds,
    sourceSlotId,
    targetSlotId,
}: PlanDesktopMultiMoveInput): DesktopMultiDragPlanEntry[] | null => {
    if (draggedItemIds.length === 0) {
        return null;
    }

    const slotByItemId = createSlotByItemMap(assignments);
    const uniqueDraggedIds = Array.from(new Set(draggedItemIds)).sort((a, b) => {
        const slotA = slotByItemId.get(a);
        const slotB = slotByItemId.get(b);
        if (!slotA || !slotB) {
            return 0;
        }

        return desktopSlotOrder.indexOf(slotA) - desktopSlotOrder.indexOf(slotB);
    });
    const sourceSlotOrderIndexes = new Map<string, number>();

    for (const itemId of uniqueDraggedIds) {
        const slotId = slotByItemId.get(itemId);
        if (!slotId) {
            return null;
        }

        const slotIndex = desktopSlotOrder.indexOf(slotId);
        if (slotIndex < 0) {
            return null;
        }

        sourceSlotOrderIndexes.set(slotId, slotIndex);
    }

    const sourceAnchorIndex = desktopSlotOrder.indexOf(sourceSlotId);
    const targetAnchorIndex = desktopSlotOrder.indexOf(targetSlotId);
    if (sourceAnchorIndex < 0 || targetAnchorIndex < 0) {
        return null;
    }

    const delta = targetAnchorIndex - sourceAnchorIndex;
    const planEntries: DesktopMultiDragPlanEntry[] = [];
    const targetSlotIds = new Set<string>();
    const movedItemIds = new Set(uniqueDraggedIds);

    for (const itemId of uniqueDraggedIds) {
        const currentSlotId = slotByItemId.get(itemId);
        if (!currentSlotId) {
            return null;
        }

        const currentIndex = sourceSlotOrderIndexes.get(currentSlotId);
        if (currentIndex === undefined) {
            return null;
        }

        const nextIndex = currentIndex + delta;
        if (nextIndex < 0 || nextIndex >= desktopSlotOrder.length) {
            return null;
        }

        const slotId = desktopSlotOrder[nextIndex];
        if (!slotId || targetSlotIds.has(slotId)) {
            return null;
        }

        targetSlotIds.add(slotId);
        planEntries.push({ itemId, slotId });
    }

    for (const entry of planEntries) {
        const assignment = assignments[entry.slotId];
        if (!assignment) {
            continue;
        }

        if (typeof assignment === "string") {
            if (!movedItemIds.has(assignment)) {
                return null;
            }

            continue;
        }

        if (typeof assignment === "object") {
            const assignedItemId =
                assignment.itemId ?? assignment.desktopItemId ?? assignment.id ?? null;
            if (typeof assignedItemId === "string" && !movedItemIds.has(assignedItemId)) {
                return null;
            }

            if ((assignment.kind ?? "").toLowerCase().includes("bin")) {
                return null;
            }
        }
    }

    return planEntries;
};
