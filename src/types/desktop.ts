import type { ContentType } from "./ContentType";
import type { IconType } from "./IconType";

export const DESKTOP_TRASH_SLOT_ID = "trash-slot" as const;
export const DESKTOP_TRASH_ENTRY_ID = "trash-entry" as const;
export const DESKTOP_SLOT_COUNT = 8 * 16;

export type DesktopItemId =
    | "about-me"
    | "projects"
    | "weather"
    | "github"
    | "linkedin";

export type DesktopSlotId = typeof DESKTOP_TRASH_SLOT_ID | `desktop-slot-${number}`;
export type DesktopReservedEntryId = typeof DESKTOP_TRASH_ENTRY_ID;
export type DesktopSlotAssignment = DesktopItemId | DesktopReservedEntryId | null;
export type DesktopItemKind = "window" | "link";

export interface DesktopWindowLaunch {
    type: "window";
    content: ContentType;
}

export interface DesktopExternalLinkLaunch {
    type: "external-link";
    href: string;
    target?: "_blank" | "_self";
}

export type DesktopLaunchDefinition =
    | DesktopWindowLaunch
    | DesktopExternalLinkLaunch;

export interface DesktopItemDefinition {
    id: DesktopItemId;
    icon: string;
    name: ContentType;
    iconType: Exclude<IconType, "trash">;
    kind: DesktopItemKind;
    hidden?: boolean;
    launch: DesktopLaunchDefinition;
}

export interface DesktopRegistrySeed {
    itemIds: DesktopItemId[];
    itemRegistry: Record<DesktopItemId, DesktopItemDefinition>;
    slotOrder: DesktopSlotId[];
    slotAssignments: Record<DesktopSlotId, DesktopSlotAssignment>;
    trashSlotId: typeof DESKTOP_TRASH_SLOT_ID;
}

export interface DesktopLayoutState {
    desktopSlotOrder: DesktopSlotId[];
    desktopSlotAssignments: Record<DesktopSlotId, DesktopSlotAssignment>;
    trashItemIds: DesktopItemId[];
}
