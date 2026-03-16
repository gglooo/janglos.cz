import type { ContentType } from "../../types/ContentType";
import type { IconType } from "../../types/IconType";

export type DesktopAssignment =
    | string
    | null
    | {
          itemId?: string | null;
          desktopItemId?: string | null;
          id?: string | null;
          kind?: string;
      };

export type DesktopSlotAssignments = Record<string, DesktopAssignment>;

export interface DesktopItemDefinition {
    id: string;
    icon?: string;
    name?: ContentType | string;
    title?: ContentType | string;
    type?: IconType;
    hideLabel?: boolean;
    hidden?: boolean;
    onClick?: VoidFunction;
    url?: string;
    href?: string;
    externalUrl?: string;
    externalHref?: string;
    contentId?: ContentType | string;
    windowTitle?: ContentType | string;
    launch?:
        | string
        | {
              kind?: string;
              url?: string;
              href?: string;
              contentId?: ContentType | string;
              title?: ContentType | string;
              windowTitle?: ContentType | string;
          };
}

export type DesktopItemRegistry = Record<string, DesktopItemDefinition>;
