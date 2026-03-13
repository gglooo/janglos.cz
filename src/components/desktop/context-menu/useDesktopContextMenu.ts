import { useCallback, useState, type MouseEvent } from "react";
import { useAppStore } from "../../../store/appStore";
import type { DesktopContextAction } from "./DesktopContextMenu";

interface ContextMenuPosition {
    x: number;
    y: number;
}

export const useDesktopContextMenu = () => {
    const openWindow = useAppStore((s) => s.openWindow);
    const minimizeAllWindows = useAppStore((s) => s.minimizeAllWindows);
    const cascadeWindows = useAppStore((s) => s.cascadeWindows);
    const tileWindowsHorizontally = useAppStore((s) => s.tileWindowsHorizontally);
    const tileWindowsVertically = useAppStore((s) => s.tileWindowsVertically);

    const [position, setPosition] = useState<ContextMenuPosition | null>(null);

    const close = useCallback(() => {
        setPosition(null);
    }, []);

    const open = useCallback((event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        const menuWidth = 200;
        const menuHeight = 172;
        const maxX = Math.max(0, window.innerWidth - menuWidth);
        const maxY = Math.max(0, window.innerHeight - menuHeight);

        setPosition({
            x: Math.min(event.clientX, maxX),
            y: Math.min(event.clientY, maxY),
        });
    }, []);

    const runAction = useCallback(
        (action: DesktopContextAction) => {
            if (action === "run") {
                openWindow({ title: "Run", source: "desktop" });
            } else if (action === "show-desktop") {
                minimizeAllWindows();
            } else if (action === "cascade") {
                cascadeWindows();
            } else if (action === "tile-horizontal") {
                tileWindowsHorizontally();
            } else {
                tileWindowsVertically();
            }

            close();
        },
        [
            cascadeWindows,
            close,
            minimizeAllWindows,
            openWindow,
            tileWindowsHorizontally,
            tileWindowsVertically,
        ],
    );

    return {
        position,
        close,
        open,
        runAction,
    };
};
