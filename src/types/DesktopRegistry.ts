import type { IconType } from "./IconType";

export type DesktopItemId = string;
export type DesktopSlotId = string;

export interface DesktopItemMetadata {
    icon: string;
    name: string;
    type: IconType;
}

export interface DesktopDragItem {
    index: string;
    itemId?: DesktopItemId;
    sourceSlotId?: DesktopSlotId;
}
