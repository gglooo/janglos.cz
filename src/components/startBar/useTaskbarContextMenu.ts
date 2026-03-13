import { useCallback, useState, type MouseEvent } from "react";
import { useAppStore } from "../../store/appStore";

interface ContextMenuPosition {
    x: number;
    y: number;
}

export const useTaskbarContextMenu = () => {
    const cascadeWindows = useAppStore((s) => s.cascadeWindows);
    const tileWindowsHorizontally = useAppStore((s) => s.tileWindowsHorizontally);
    const tileWindowsVertically = useAppStore((s) => s.tileWindowsVertically);
    const setStartMenuVisible = useAppStore((s) => s.setStartMenuVisible);

    const [position, setPosition] = useState<ContextMenuPosition | null>(null);

    const close = useCallback(() => {
        setPosition(null);
    }, []);

    const open = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            const menuWidth = 212;
            const menuHeight = 104;
            const maxX = Math.max(0, window.innerWidth - menuWidth);
            const maxY = Math.max(0, window.innerHeight - menuHeight);

            setPosition({
                x: Math.min(event.clientX, maxX),
                y: Math.min(event.clientY, maxY),
            });

            setStartMenuVisible(false);
        },
        [setStartMenuVisible],
    );

    const runCascade = useCallback(() => {
        cascadeWindows();
        close();
    }, [cascadeWindows, close]);

    const runTileHorizontal = useCallback(() => {
        tileWindowsHorizontally();
        close();
    }, [close, tileWindowsHorizontally]);

    const runTileVertical = useCallback(() => {
        tileWindowsVertically();
        close();
    }, [close, tileWindowsVertically]);

    return {
        close,
        open,
        position,
        runCascade,
        runTileHorizontal,
        runTileVertical,
    };
};
