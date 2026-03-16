import type { MouseEventHandler, PointerEventHandler } from "react";
import { useDrag } from "react-dnd";
import { useIsMobile } from "../hooks/useIsMobile";
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
    hideLabel?: boolean;
    type?: IconType;
    index?: string;
    itemId?: DesktopItemId;
    slotId?: DesktopSlotId;
    metadata?: DesktopItemMetadata;
    isSelected?: boolean;
    selectedItemIdsForDrag?: DesktopItemId[];
    onPointerDown?: PointerEventHandler<HTMLDivElement>;
    onClick?: MouseEventHandler<HTMLDivElement>;
    onDoubleClick?: MouseEventHandler<HTMLDivElement>;
}

export const DesktopIcon = ({
    icon,
    name,
    hideLabel,
    type,
    index,
    itemId,
    slotId,
    metadata,
    isSelected = false,
    selectedItemIdsForDrag,
    onPointerDown,
    onClick,
    onDoubleClick,
}: DesktopIconProps) => {
    const isMobile = useIsMobile();
    const resolvedType = metadata?.type ?? type ?? "normal";
    const resolvedIcon = metadata?.icon ?? icon;
    const resolvedName = metadata?.name ?? name;
    const shouldHideLabel = metadata?.hideLabel ?? hideLabel ?? false;
    const sourceSlotId = slotId ?? index;
    const handleClick: MouseEventHandler<HTMLDivElement> | undefined = isMobile
        ? (event) => {
              onClick?.(event);
              onDoubleClick?.(event);
          }
        : onClick;
    const handleDoubleClick = isMobile ? undefined : onDoubleClick;

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: resolvedType,
            item: {
                index: sourceSlotId?.toString() ?? "",
                itemId,
                sourceSlotId,
                selectedItemIds: selectedItemIdsForDrag,
            } satisfies DesktopDragItem,
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [itemId, resolvedType, selectedItemIdsForDrag, sourceSlotId],
    );

    return (
        <div
            className={
                "flex flex-col items-center font-main justify-center cursor-pointer gap-2" +
                (isDragging ? " invisible" : "")
            }
            data-desktop-icon-root="true"
            data-desktop-item-id={itemId}
            data-desktop-slot-id={sourceSlotId}
            onDoubleClick={handleDoubleClick}
            onClick={handleClick}
            onPointerDown={onPointerDown}
            ref={(node) => {
                drag(node);
            }}
        >
            <img
                src={resolvedIcon}
                alt={resolvedName ?? "desktop icon"}
                className={
                    "w-10 h-10 hover:opacity-50 " +
                    (isSelected ? "outline outline-1 outline-white" : "")
                }
            />
            {!shouldHideLabel ? (
                <p
                    className={
                        "text-white text-[14px] sm:text-[14px] md:text-[14px] lg:text-[14px] font-normal leading-tight " +
                        (isSelected ? "bg-[#0A246A] px-1" : "")
                    }
                >
                    {resolvedName}
                </p>
            ) : null}
        </div>
    );
};
