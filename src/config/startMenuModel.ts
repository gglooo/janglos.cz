import type {
    StartMenuAction,
    StartMenuItem,
    StartMenuRunAlias,
} from "../types/startMenu";

export const startMenuRunAliasActions: Record<StartMenuRunAlias, StartMenuAction> = {
    about: { type: "open-window", title: "About\u00A0me" },
    projects: { type: "open-window", title: "Projects" },
    weather: { type: "open-window", title: "Weather" },
    github: {
        type: "open-external",
        href: "https://github.com/gglooo",
        target: "_blank",
    },
    linkedin: {
        type: "open-external",
        href: "https://www.linkedin.com/in/jan-glos-21007b202/",
        target: "_blank",
    },
};

const portfolioProgramItems: StartMenuItem[] = [
    {
        id: "programs-portfolio-about",
        kind: "action",
        label: "About me",
        underlineIndex: 0,
        action: startMenuRunAliasActions.about,
    },
    {
        id: "programs-portfolio-projects",
        kind: "action",
        label: "Projects",
        underlineIndex: 0,
        action: startMenuRunAliasActions.projects,
    },
    {
        id: "programs-portfolio-weather",
        kind: "action",
        label: "Weather",
        underlineIndex: 0,
        action: startMenuRunAliasActions.weather,
    },
    {
        id: "programs-portfolio-sep-links",
        kind: "separator",
    },
    {
        id: "programs-portfolio-github",
        kind: "action",
        label: "GitHub",
        underlineIndex: 0,
        action: startMenuRunAliasActions.github,
    },
    {
        id: "programs-portfolio-linkedin",
        kind: "action",
        label: "LinkedIn",
        underlineIndex: 0,
        action: startMenuRunAliasActions.linkedin,
    },
];

export const startMenuModel: StartMenuItem[] = [
    {
        id: "root-programs",
        kind: "submenu",
        label: "Programs",
        underlineIndex: 0,
        submenuIndicator: "right-arrow",
        items: [
            {
                id: "programs-portfolio",
                kind: "submenu",
                label: "Portfolio",
                underlineIndex: 0,
                submenuIndicator: "right-arrow",
                items: portfolioProgramItems,
            },
            {
                id: "programs-sep-portfolio",
                kind: "separator",
            },
            {
                id: "programs-quick-about",
                kind: "action",
                label: "About me",
                underlineIndex: 0,
                action: startMenuRunAliasActions.about,
            },
            {
                id: "programs-quick-projects",
                kind: "action",
                label: "Projects",
                underlineIndex: 0,
                action: startMenuRunAliasActions.projects,
            },
            {
                id: "programs-quick-weather",
                kind: "action",
                label: "Weather",
                underlineIndex: 0,
                action: startMenuRunAliasActions.weather,
            },
        ],
    },
    {
        id: "root-documents",
        kind: "submenu",
        label: "Documents",
        underlineIndex: 0,
        submenuIndicator: "right-arrow",
        items: [
            {
                id: "documents-open",
                kind: "action",
                label: "My Documents",
                underlineIndex: 3,
                action: { type: "command", commandId: "documents" },
            },
        ],
    },
    {
        id: "root-settings",
        kind: "submenu",
        label: "Settings",
        underlineIndex: 0,
        submenuIndicator: "right-arrow",
        items: [
            {
                id: "settings-control-panel",
                kind: "action",
                label: "Control Panel",
                underlineIndex: 0,
                action: {
                    type: "command",
                    commandId: "settings-control-panel",
                },
            },
            {
                id: "settings-taskbar",
                kind: "action",
                label: "Taskbar",
                underlineIndex: 0,
                action: {
                    type: "command",
                    commandId: "settings-taskbar",
                },
            },
        ],
    },
    {
        id: "root-find",
        kind: "submenu",
        label: "Find",
        underlineIndex: 0,
        submenuIndicator: "right-arrow",
        items: [
            {
                id: "find-files",
                kind: "action",
                label: "Files or Folders",
                underlineIndex: 0,
                action: { type: "command", commandId: "find-files" },
            },
            {
                id: "find-computer",
                kind: "action",
                label: "Computer",
                underlineIndex: 0,
                action: { type: "command", commandId: "find-computer" },
            },
        ],
    },
    {
        id: "root-help",
        kind: "action",
        label: "Help",
        underlineIndex: 0,
        action: { type: "command", commandId: "help" },
    },
    {
        id: "root-run",
        kind: "action",
        label: "Run...",
        underlineIndex: 0,
        action: { type: "command", commandId: "run" },
    },
    {
        id: "root-separator-before-shutdown",
        kind: "separator",
    },
    {
        id: "root-shutdown",
        kind: "action",
        label: "Shut Down...",
        underlineIndex: 5,
        action: { type: "command", commandId: "shutdown" },
    },
];

export const startMenuProgramsPortfolioItems = portfolioProgramItems;
