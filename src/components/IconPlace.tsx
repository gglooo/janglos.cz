import { useDrop } from "react-dnd";
import type { ReactNode } from "react";
import type {
    DesktopDragItem,
    DesktopItemId,
    DesktopSlotId,
} from "../types/DesktopRegistry";

interface IconPlaceDropPayload {
    itemId?: DesktopItemId;
    sourceSlotId: DesktopSlotId;
    targetSlotId: DesktopSlotId;
}

interface IconPlaceProps {
    index?: string;
    slotId?: DesktopSlotId;
    children?: ReactNode;
    move?: (from: string, to: string) => void;
    onDrop?: (payload: IconPlaceDropPayload) => void;
    onDrag?: () => void;
}

export const IconPlace = ({
    children,
    index,
    slotId,
    move,
    onDrop,
    onDrag,
}: IconPlaceProps) => {
    const resolvedSlotId = slotId ?? index;

    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: ["normal", "trash", "link"],
            canDrop: () => {
                return true;
            },
            drop: (item: DesktopDragItem) => {
                const sourceSlotId = item.sourceSlotId ?? item.index;
                if (!resolvedSlotId || !sourceSlotId) {
                    return;
                }

                onDrop?.({
                    itemId: item.itemId,
                    sourceSlotId,
                    targetSlotId: resolvedSlotId,
                });
                move?.(sourceSlotId, resolvedSlotId);
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop(),
            }),
        }),
        [move, onDrop, resolvedSlotId]
    );

    return (
        <div
            className="flex relative justify-center items-center z-10 select-none"
            ref={(node) => {
                drop(node);
            }}
        >
            {children}
        </div>
    );
};
