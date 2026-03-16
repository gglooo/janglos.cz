import { useEffect, useMemo, useState } from "react";
import { useDragLayer } from "react-dnd";
import { createPortal } from "react-dom";
import type { DesktopDragItem } from "../../../types/DesktopRegistry";
import type {
    DesktopItemRegistry,
    DesktopSlotAssignments,
} from "../desktopTypes";
import { resolveAssignmentItemId, resolveWindowTitle } from "../desktopUtils";

interface PreviewItem {
    itemId: string;
    icon: string;
    label: string;
    left: number;
    top: number;
}

interface DesktopMultiDragPreviewProps {
    assignments: DesktopSlotAssignments;
    desktopSlotOrder: string[];
    registry: DesktopItemRegistry;
}

const resolveDraggedItemIds = (dragItem: DesktopDragItem | null): string[] => {
    if (!dragItem) {
        return [];
    }

    if (dragItem.selectedItemIds?.length) {
        return dragItem.selectedItemIds;
    }

    return dragItem.itemId ? [dragItem.itemId] : [];
};

export const DesktopMultiDragPreview = ({
    assignments,
    desktopSlotOrder,
    registry,
}: DesktopMultiDragPreviewProps) => {
    const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
    const [dragSessionKey, setDragSessionKey] = useState<string | null>(null);
    const { dragItem, initialSourceOffset, sourceOffset } = useDragLayer(
        (monitor) => ({
            dragItem: monitor.getItem<DesktopDragItem | null>(),
            initialSourceOffset: monitor.getInitialSourceClientOffset(),
            sourceOffset: monitor.getSourceClientOffset(),
        }),
    );
    const draggedItemIds = useMemo(
        () => resolveDraggedItemIds(dragItem),
        [dragItem],
    );

    useEffect(() => {
        if (draggedItemIds.length === 0) {
            setPreviewItems([]);
            setDragSessionKey(null);
            return;
        }

        const nextSessionKey = draggedItemIds.join("|");
        if (dragSessionKey === nextSessionKey) {
            return;
        }

        const sourceIndexByItemId = new Map<string, number>();
        desktopSlotOrder.forEach((slotId, index) => {
            const itemId = resolveAssignmentItemId(assignments[slotId]);
            if (itemId) {
                sourceIndexByItemId.set(itemId, index);
            }
        });

        const orderedItemIds = [...draggedItemIds].sort((a, b) => {
            return (
                (sourceIndexByItemId.get(a) ?? Number.MAX_SAFE_INTEGER) -
                (sourceIndexByItemId.get(b) ?? Number.MAX_SAFE_INTEGER)
            );
        });

        const captured: PreviewItem[] = orderedItemIds
            .map<PreviewItem | null>((itemId) => {
                const node = document.querySelector<HTMLElement>(
                    `[data-desktop-item-id="${itemId}"]`,
                );
                const item = registry[itemId];
                const label = item ? resolveWindowTitle(item) : null;
                if (!node || !item?.icon || !label) {
                    return null;
                }

                const rect = node.getBoundingClientRect();
                return {
                    itemId,
                    icon: item.icon,
                    label: String(label),
                    left: rect.left,
                    top: rect.top,
                };
            })
            .filter((item): item is PreviewItem => item !== null);

        setPreviewItems(captured);
        setDragSessionKey(nextSessionKey);
    }, [
        assignments,
        desktopSlotOrder,
        dragSessionKey,
        draggedItemIds,
        registry,
    ]);

    if (
        previewItems.length === 0 ||
        !initialSourceOffset ||
        !sourceOffset ||
        typeof document === "undefined"
    ) {
        return null;
    }

    const deltaX = sourceOffset.x - initialSourceOffset.x;
    const deltaY = sourceOffset.y - initialSourceOffset.y;

    return createPortal(
        <div className="pointer-events-none fixed inset-0 z-9999">
            {previewItems.map((item) => (
                <div
                    key={item.itemId}
                    className="flex flex-col items-center font-main justify-center gap-2"
                    style={{
                        position: "fixed",
                        left: `${item.left + deltaX}px`,
                        top: `${item.top + deltaY}px`,
                    }}
                >
                    <img
                        src={item.icon}
                        alt={item.label}
                        className="w-10 h-10 opacity-95"
                    />
                    <p className="text-white text-[14px] font-normal leading-tight bg-[#0A246A] px-1">
                        {item.label}
                    </p>
                </div>
            ))}
        </div>,
        document.body,
    );
};
