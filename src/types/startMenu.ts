import type { ContentType } from "./ContentType";

export type StartMenuCommandId =
    | "documents"
    | "settings-control-panel"
    | "settings-taskbar"
    | "find-files"
    | "find-computer"
    | "help"
    | "run"
    | "shutdown";

export interface StartMenuOpenWindowAction {
    type: "open-window";
    title: ContentType;
}

export interface StartMenuOpenExternalAction {
    type: "open-external";
    href: string;
    target?: "_blank" | "_self";
}

export interface StartMenuCommandAction {
    type: "command";
    commandId: StartMenuCommandId;
}

export type StartMenuAction =
    | StartMenuOpenWindowAction
    | StartMenuOpenExternalAction
    | StartMenuCommandAction;

interface StartMenuBaseItem {
    id: string;
    label: string;
    disabled?: boolean;
    underlineIndex?: number;
}

export interface StartMenuActionItem extends StartMenuBaseItem {
    kind: "action";
    action: StartMenuAction;
}

export interface StartMenuSubmenuItem extends StartMenuBaseItem {
    kind: "submenu";
    submenuIndicator: "right-arrow";
    items: StartMenuItem[];
}

export interface StartMenuSeparatorItem {
    id: string;
    kind: "separator";
}

export type StartMenuItem =
    | StartMenuActionItem
    | StartMenuSubmenuItem
    | StartMenuSeparatorItem;
