import { desktopRegistrySeed } from "../../config/desktopIcons";
import { ContentTypes, type ContentType } from "../../types/ContentType";
import {
    DESKTOP_TRASH_ENTRY_ID,
    DESKTOP_TRASH_SLOT_ID,
} from "../../types/desktop";
import type {
    DesktopAssignment,
    DesktopItemDefinition,
    DesktopItemRegistry,
    DesktopSlotAssignments,
} from "./desktopTypes";

export const BIN_SLOT_ID = DESKTOP_TRASH_SLOT_ID;
export const BIN_ASSIGNMENT_ID = DESKTOP_TRASH_ENTRY_ID;
const DEFAULT_DESKTOP_CELLS = 8 * 16;

const defaultDesktopRegistry: Record<string, DesktopItemDefinition> =
    Object.values(desktopRegistrySeed.itemRegistry).reduce<
        Record<string, DesktopItemDefinition>
    >((acc, item) => {
        const launch = item.launch;
        const onClick =
            launch.type === "external-link"
                ? () => window.open(launch.href, launch.target ?? "_blank")
                : undefined;

        acc[item.id] = {
            id: item.id,
            icon: item.icon,
            name: item.name,
            title: item.name,
            type: item.iconType,
            hidden: item.hidden,
            onClick,
            launch:
                launch.type === "window"
                    ? {
                          kind: "window",
                          contentId: launch.content,
                          windowTitle: launch.content,
                      }
                    : {
                          kind: "external-link",
                          href: launch.href,
                      },
        };
        return acc;
    }, {});

export const defaultDesktopSlotOrder = Array.from(
    { length: DEFAULT_DESKTOP_CELLS },
    (_, index) => (index === 0 ? BIN_SLOT_ID : `desktop-slot-${index}`),
);

export const normalizeDesktopRegistry = (
    registry: DesktopItemRegistry | undefined,
): Record<string, DesktopItemDefinition> => {
    if (!registry) {
        return defaultDesktopRegistry;
    }
    return registry;
};

export const resolveAssignmentItemId = (assignment: DesktopAssignment) => {
    if (typeof assignment === "string") {
        return assignment;
    }

    if (!assignment) {
        return null;
    }

    if (assignment.kind === "bin") {
        return BIN_ASSIGNMENT_ID;
    }

    return (
        assignment.itemId ?? assignment.desktopItemId ?? assignment.id ?? null
    );
};

const asContentType = (value: unknown): ContentType | null => {
    if (typeof value !== "string") {
        return null;
    }

    return ContentTypes.includes(value as ContentType)
        ? (value as ContentType)
        : null;
};

export const createFallbackAssignments = (
    registry: Record<string, DesktopItemDefinition>,
    slotOrder: string[],
    trashedItemIds: string[],
) => {
    const assignments: DesktopSlotAssignments = {
        [BIN_SLOT_ID]: BIN_ASSIGNMENT_ID,
    };

    const visibleItemIds = Object.keys(registry).filter(
        (itemId) => !trashedItemIds.includes(itemId),
    );

    let itemIndex = 0;
    for (const slotId of slotOrder) {
        if (slotId === BIN_SLOT_ID) {
            assignments[slotId] = BIN_ASSIGNMENT_ID;
            continue;
        }

        assignments[slotId] = visibleItemIds[itemIndex] ?? null;
        itemIndex += 1;
    }

    return assignments;
};

export const resolveLaunchUrl = (item: DesktopItemDefinition) => {
    if (typeof item.launch === "object" && item.launch !== null) {
        if (typeof item.launch.url === "string") {
            return item.launch.url;
        }

        if (typeof item.launch.href === "string") {
            return item.launch.href;
        }
    }

    return (
        item.externalUrl ?? item.externalHref ?? item.url ?? item.href ?? null
    );
};

export const resolveWindowTitle = (item: DesktopItemDefinition) =>
    asContentType(
        (typeof item.launch === "object" && item.launch !== null
            ? (item.launch.windowTitle ??
              item.launch.title ??
              item.launch.contentId)
            : null) ??
            item.windowTitle ??
            item.contentId ??
            item.title ??
            item.name,
    );
