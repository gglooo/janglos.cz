import { useCallback, useState, type MouseEvent } from "react";
import type { DesktopIconContextTarget } from "./iconMenuTypes";

interface ContextMenuPosition {
    x: number;
    y: number;
}

interface IconContextMenuState {
    position: ContextMenuPosition;
    target: DesktopIconContextTarget;
}

const MENU_WIDTH = 160;
const MENU_HEIGHT = 62;

const resolveClampedPosition = (event: MouseEvent<HTMLDivElement>) => {
    const maxX = Math.max(0, window.innerWidth - MENU_WIDTH);
    const maxY = Math.max(0, window.innerHeight - MENU_HEIGHT);

    return {
        x: Math.min(event.clientX, maxX),
        y: Math.min(event.clientY, maxY),
    };
};

export const useDesktopIconContextMenu = () => {
    const [menuState, setMenuState] = useState<IconContextMenuState | null>(null);

    const close = useCallback(() => {
        setMenuState(null);
    }, []);

    const openForTarget = useCallback(
        (event: MouseEvent<HTMLDivElement>, target: DesktopIconContextTarget) => {
            event.preventDefault();
            event.stopPropagation();
            setMenuState({
                position: resolveClampedPosition(event),
                target,
            });
        },
        [],
    );

    return {
        menuState,
        close,
        openForTarget,
    };
};
