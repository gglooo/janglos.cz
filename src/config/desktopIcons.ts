import type { ContentType } from "../types/ContentType";
import type { IconType } from "../types/IconType";
import {
    DESKTOP_SLOT_COUNT,
    DESKTOP_TRASH_ENTRY_ID,
    DESKTOP_TRASH_SLOT_ID,
    type DesktopItemDefinition,
    type DesktopItemId,
    type DesktopLaunchDefinition,
    type DesktopRegistrySeed,
    type DesktopSlotAssignment,
    type DesktopSlotId,
} from "../types/desktop";

import GlobeIcon from "../assets/globe.png";
import ProjectsIcon from "../assets/projects.png";
import WeatherIcon from "../assets/weather.png";
import GitHubIcon from "../assets/github.png";
import LinkedInIcon from "../assets/linkedin.png";

export interface DesktopIconConfig {
    icon: string;
    name: ContentType;
    type?: IconType;
    onClick?: VoidFunction;
    hidden?: boolean;
}

const desktopItemRegistry: Record<DesktopItemId, DesktopItemDefinition> = {
    "about-me": {
        id: "about-me",
        icon: GlobeIcon,
        name: "About\u00A0me",
        iconType: "normal",
        kind: "window",
        launch: {
            type: "window",
            content: "About\u00A0me",
        },
    },
    projects: {
        id: "projects",
        icon: ProjectsIcon,
        name: "Projects",
        iconType: "normal",
        kind: "window",
        launch: {
            type: "window",
            content: "Projects",
        },
    },
    weather: {
        id: "weather",
        icon: WeatherIcon,
        name: "Weather",
        iconType: "normal",
        kind: "window",
        launch: {
            type: "window",
            content: "Weather",
        },
    },
    github: {
        id: "github",
        icon: GitHubIcon,
        name: "GitHub",
        iconType: "link",
        kind: "link",
        hidden: true,
        launch: {
            type: "external-link",
            href: "https://github.com/gglooo",
            target: "_blank",
        },
    },
    linkedin: {
        id: "linkedin",
        icon: LinkedInIcon,
        name: "LinkedIn",
        iconType: "link",
        kind: "link",
        hidden: true,
        launch: {
            type: "external-link",
            href: "https://www.linkedin.com/in/jan-glos-21007b202/",
            target: "_blank",
        },
    },
};

const desktopItemIds = Object.keys(desktopItemRegistry) as DesktopItemId[];

const desktopSlotOrder: DesktopSlotId[] = [
    DESKTOP_TRASH_SLOT_ID,
    ...Array.from({ length: DESKTOP_SLOT_COUNT - 1 }, (_, index) => {
        return `desktop-slot-${index + 1}` as const;
    }),
];

const desktopSlotAssignments = desktopSlotOrder.reduce<
    Record<DesktopSlotId, DesktopSlotAssignment>
>((assignments, slotId, index) => {
    if (slotId === DESKTOP_TRASH_SLOT_ID) {
        assignments[slotId] = DESKTOP_TRASH_ENTRY_ID;
        return assignments;
    }

    assignments[slotId] = desktopItemIds[index - 1] ?? null;
    return assignments;
}, {} as Record<DesktopSlotId, DesktopSlotAssignment>);

export const desktopRegistrySeed: DesktopRegistrySeed = {
    itemIds: desktopItemIds,
    itemRegistry: desktopItemRegistry,
    slotOrder: desktopSlotOrder,
    slotAssignments: desktopSlotAssignments,
    trashSlotId: DESKTOP_TRASH_SLOT_ID,
};

export const getDesktopItemById = (itemId: DesktopItemId) =>
    desktopRegistrySeed.itemRegistry[itemId];

export const getDesktopItemByName = (name: ContentType) =>
    desktopRegistrySeed.itemIds
        .map((itemId) => desktopRegistrySeed.itemRegistry[itemId])
        .find((item) => item.name === name);

export const getDesktopItemIdByName = (name: ContentType) =>
    getDesktopItemByName(name)?.id;

export const getLaunchHandler = (launch: DesktopLaunchDefinition) => {
    if (launch.type === "external-link") {
        return () => window.open(launch.href, launch.target ?? "_blank");
    }

    return undefined;
};

export const desktopIcons: DesktopIconConfig[] = desktopRegistrySeed.itemIds.map(
    (itemId) => {
        const item = desktopRegistrySeed.itemRegistry[itemId];

        return {
            icon: item.icon,
            name: item.name,
            type: item.iconType,
            onClick: getLaunchHandler(item.launch),
            hidden: item.hidden,
        };
    }
);
