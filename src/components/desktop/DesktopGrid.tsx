import type { MouseEventHandler, PointerEventHandler } from "react";
import emptyBinImage from "../../assets/empty_bin.png";
import fullBinImage from "../../assets/full_bin.png";
import { DesktopIcon } from "../DesktopIcon";
import { IconPlace } from "../IconPlace";
import type {
    DesktopItemDefinition,
    DesktopSlotAssignments,
} from "./desktopTypes";
import {
    BIN_ASSIGNMENT_ID,
    BIN_SLOT_ID,
    resolveAssignmentItemId,
    resolveWindowTitle,
} from "./desktopUtils";

interface DesktopGridProps {
    desktopSlotOrder: string[];
    assignments: DesktopSlotAssignments;
    registry: Record<string, DesktopItemDefinition>;
    trashCount: number;
    onMove: (fromSlotId: string, toSlotId: string) => void;
    onDrop: (payload: {
        itemId?: string;
        selectedItemIds?: string[];
        sourceSlotId: string;
        targetSlotId: string;
    }) => void;
    onTrashClick: VoidFunction;
    onIconClick: (itemId: string) => MouseEventHandler<HTMLDivElement>;
    onIconContextMenu: (itemId: string) => MouseEventHandler<HTMLDivElement>;
    onTrashContextMenu: MouseEventHandler<HTMLDivElement>;
    onIconPointerDown: (itemId: string) => PointerEventHandler<HTMLDivElement>;
    selectedItemIds: string[];
}

export const DesktopGrid = ({
    desktopSlotOrder,
    assignments,
    registry,
    trashCount,
    onMove,
    onDrop,
    onTrashClick,
    onIconClick,
    onIconContextMenu,
    onTrashContextMenu,
    onIconPointerDown,
    selectedItemIds,
}: DesktopGridProps) => (
    <>
        {desktopSlotOrder.map((slotId) => {
            const assignedItemId = resolveAssignmentItemId(assignments[slotId]);

            if (
                slotId === BIN_SLOT_ID ||
                assignedItemId === BIN_ASSIGNMENT_ID
            ) {
                return (
                    <IconPlace
                        key={slotId}
                        index={slotId}
                        move={onMove}
                        onDrop={onDrop}
                    >
                        <DesktopIcon
                            icon={
                                trashCount === 0 ? emptyBinImage : fullBinImage
                            }
                            name={"Trash"}
                            type={"trash"}
                            onClick={onTrashClick}
                            onContextMenu={onTrashContextMenu}
                            index={slotId}
                            key={`${slotId}-trash`}
                        />
                    </IconPlace>
                );
            }

            if (!assignedItemId) {
                return (
                    <IconPlace
                        key={slotId}
                        index={slotId}
                        move={onMove}
                        onDrop={onDrop}
                    />
                );
            }

            const item = registry[assignedItemId];
            if (!item) {
                return (
                    <IconPlace
                        key={slotId}
                        index={slotId}
                        move={onMove}
                        onDrop={onDrop}
                    />
                );
            }

            const title = resolveWindowTitle(item);
            if (!item.icon || !title) {
                return (
                    <IconPlace
                        key={slotId}
                        index={slotId}
                        move={onMove}
                        onDrop={onDrop}
                    />
                );
            }

            return (
                <IconPlace
                    key={slotId}
                    index={slotId}
                    move={onMove}
                    onDrop={onDrop}
                >
                    <DesktopIcon
                        icon={item.icon}
                        name={title}
                        hideLabel={item.hideLabel}
                        type={item.type ?? "normal"}
                        itemId={assignedItemId}
                        slotId={slotId}
                        isSelected={selectedItemIds.includes(assignedItemId)}
                        selectedItemIdsForDrag={
                            selectedItemIds.includes(assignedItemId)
                                ? selectedItemIds
                                : [assignedItemId]
                        }
                        onPointerDown={onIconPointerDown(assignedItemId)}
                        onDoubleClick={onIconClick(assignedItemId)}
                        onContextMenu={onIconContextMenu(assignedItemId)}
                        index={slotId}
                        key={assignedItemId}
                    />
                </IconPlace>
            );
        })}
    </>
);
