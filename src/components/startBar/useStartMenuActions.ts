import { useCallback } from "react";
import { useAppStore } from "../../store/appStore";
import type { StartMenuAction } from "../../types/startMenu";

export const useStartMenuActions = (closeMenu: () => void) => {
    const openWindow = useAppStore((s) => s.openWindow);
    const shutdownAndReset = useAppStore((s) => s.shutdownAndReset);

    const executeAction = useCallback(
        (action: StartMenuAction) => {
            if (action.type === "open-window") {
                openWindow({ title: action.title, source: "start-menu" });
                closeMenu();
                return;
            }

            if (action.type === "open-external") {
                window.open(action.href, action.target ?? "_blank");
                closeMenu();
                return;
            }

            if (action.commandId === "run") {
                openWindow({ title: "Run", source: "start-menu" });
                closeMenu();
                return;
            }

            if (action.commandId === "shutdown") {
                shutdownAndReset();
                closeMenu();
                return;
            }

            closeMenu();
        },
        [closeMenu, openWindow, shutdownAndReset],
    );

    return { executeAction };
};
