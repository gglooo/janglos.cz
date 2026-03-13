import type { MouseEventHandler } from "react";
import { useDrag } from "react-dnd";
import type { IconType } from "../types/IconType";
import type {
    DesktopDragItem,
    DesktopItemId,
    DesktopItemMetadata,
    DesktopSlotId,
} from "../types/DesktopRegistry";

interface DesktopIconProps {
    icon?: string;
    name?: string;
    type?: IconType;
    index?: string;
    itemId?: DesktopItemId;
    slotId?: DesktopSlotId;
    metadata?: DesktopItemMetadata;
    onClick: MouseEventHandler<HTMLDivElement>;
}

export const DesktopIcon = ({
    icon,
    name,
    type,
    index,
    itemId,
    slotId,
    metadata,
    onClick,
}: DesktopIconProps) => {
    const resolvedType = metadata?.type ?? type ?? "normal";
    const resolvedIcon = metadata?.icon ?? icon;
    const resolvedName = metadata?.name ?? name;
    const sourceSlotId = slotId ?? index;

    const [{ isDragging }, drag] = useDrag(() => ({
        type: resolvedType,
        item: {
            index: sourceSlotId?.toString() ?? "",
            itemId,
            sourceSlotId,
        } satisfies DesktopDragItem,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [itemId, resolvedType, sourceSlotId]);

    return (
        <div
            className={
                "flex flex-col items-center font-main justify-center cursor-pointer hover:opacity-50" +
                (isDragging ? " invisible" : "")
            }
            onClick={onClick}
            ref={(node) => {
                drag(node);
            }}
        >
            <img src={resolvedIcon} alt={resolvedName} className={"w-10 h-10"} />
            <p className="text-white text-lg sm:text-lg md:text-lg lg:text-xl">
                {resolvedName}
            </p>
        </div>
    );
};
