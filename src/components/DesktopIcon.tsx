import type { MouseEventHandler } from "react";
import { useDrag } from "react-dnd";
import type {
    DesktopDragItem,
    DesktopItemId,
    DesktopItemMetadata,
    DesktopSlotId,
} from "../types/DesktopRegistry";
import type { IconType } from "../types/IconType";

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

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: resolvedType,
            item: {
                index: sourceSlotId?.toString() ?? "",
                itemId,
                sourceSlotId,
            } satisfies DesktopDragItem,
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [itemId, resolvedType, sourceSlotId],
    );

    return (
        <div
            className={
                "flex flex-col items-center font-main justify-center cursor-pointer hover:opacity-50 gap-2" +
                (isDragging ? " invisible" : "")
            }
            onClick={onClick}
            ref={(node) => {
                drag(node);
            }}
        >
            <img
                src={resolvedIcon}
                alt={resolvedName}
                className={"w-10 h-10"}
            />
            <p className="text-white text-[14px] sm:text-[14px] md:text-[14px] lg:text-[14px] font-normal leading-tight">
                {resolvedName}
            </p>
        </div>
    );
};
