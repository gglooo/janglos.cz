import { DesktopIcon } from "../DesktopIcon";
import { IconPlace } from "../IconPlace";
import emptyBinImage from "../../assets/empty_bin.png";
import fullBinImage from "../../assets/full_bin.png";
import type { MouseEventHandler } from "react";
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
    onTrashClick: VoidFunction;
    onIconClick: (itemId: string) => MouseEventHandler<HTMLDivElement>;
}

export const DesktopGrid = ({
    desktopSlotOrder,
    assignments,
    registry,
    trashCount,
    onMove,
    onTrashClick,
    onIconClick,
}: DesktopGridProps) => (
    <>
        {desktopSlotOrder.map((slotId) => {
            const assignedItemId = resolveAssignmentItemId(assignments[slotId]);

            if (slotId === BIN_SLOT_ID || assignedItemId === BIN_ASSIGNMENT_ID) {
                return (
                    <IconPlace key={slotId} index={slotId} move={onMove}>
                        <DesktopIcon
                            icon={trashCount === 0 ? emptyBinImage : fullBinImage}
                            name={"Trash"}
                            type={"trash"}
                            onClick={onTrashClick}
                            index={slotId}
                            key={`${slotId}-trash`}
                        />
                    </IconPlace>
                );
            }

            if (!assignedItemId) {
                return <IconPlace key={slotId} index={slotId} move={onMove} />;
            }

            const item = registry[assignedItemId];
            if (!item) {
                return <IconPlace key={slotId} index={slotId} move={onMove} />;
            }

            const title = resolveWindowTitle(item);
            if (!item.icon || !title) {
                return <IconPlace key={slotId} index={slotId} move={onMove} />;
            }

            return (
                <IconPlace key={slotId} index={slotId} move={onMove}>
                    <DesktopIcon
                        icon={item.icon}
                        name={title}
                        type={item.type ?? "normal"}
                        onClick={onIconClick(assignedItemId)}
                        index={slotId}
                        key={assignedItemId}
                    />
                </IconPlace>
            );
        })}
    </>
);
