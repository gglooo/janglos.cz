import type {
    StartMenuAction,
    StartMenuItem,
    StartMenuRunAlias,
} from "../types/startMenu";

export const startMenuRunAliasActions: Record<
    StartMenuRunAlias,
    StartMenuAction
> = {
    about: { type: "open-window", title: "About\u00A0me" },
    projects: { type: "open-window", title: "Projects" },
    weather: { type: "open-window", title: "Weather" },
    ascii: { type: "open-window", title: "ASCII Art" },
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
    "task-manager": { type: "open-window", title: "Task Manager" },
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
        id: "programs-portfolio-ascii",
        kind: "action",
        label: "ASCII Art",
        underlineIndex: 0,
        action: startMenuRunAliasActions.ascii,
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
            {
                id: "programs-quick-ascii",
                kind: "action",
                label: "ASCII Art",
                underlineIndex: 0,
                action: startMenuRunAliasActions.ascii,
            },
        ],
    },
    {
        id: "root-help",
        kind: "action",
        label: "Help",
        underlineIndex: 0,
        action: startMenuRunAliasActions.about,
    },
    {
        id: "root-run",
        kind: "action",
        label: "Run...",
        underlineIndex: 0,
        action: { type: "command", commandId: "run" },
    },
    {
        id: "root-task-manager",
        kind: "action",
        label: "Task Manager...",
        underlineIndex: 5,
        action: startMenuRunAliasActions["task-manager"],
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
