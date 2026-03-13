import { useCallback, useMemo } from "react";
import { useAppStore } from "../../store/appStore";
import type { TaskbarWindow } from "./types";

export const useTaskbarWindows = () => {
    const openWindows = useAppStore((s) => s.openWindows);
    const bringToFront = useAppStore((s) => s.bringToFront);
    const windowZIndexes = useAppStore((s) => s.windowZIndexes);
    const minimizeWindow = useAppStore((s) => s.minimizeWindow);
    const restoreWindow = useAppStore((s) => s.restoreWindow);

    const taskbarWindows = openWindows as unknown as TaskbarWindow[];

    const activeWindowId = useMemo(() => {
        const visibleWindows = taskbarWindows.filter(
            (windowData) => (windowData.state ?? "normal") !== "minimized",
        );

        if (visibleWindows.length === 0) {
            return null;
        }

        return visibleWindows.reduce((topWindowId, windowData) => {
            const topZ = windowZIndexes[topWindowId] ?? 0;
            const currentZ = windowZIndexes[windowData.id] ?? 0;
            return currentZ > topZ ? windowData.id : topWindowId;
        }, visibleWindows[0]!.id);
    }, [taskbarWindows, windowZIndexes]);

    const handleTaskbarItemClick = useCallback(
        (windowData: TaskbarWindow) => {
            if ((windowData.state ?? "normal") === "minimized") {
                restoreWindow(windowData.id);
                return;
            }

            if (activeWindowId === windowData.id) {
                minimizeWindow(windowData.id);
                return;
            }

            bringToFront(windowData.id);
        },
        [activeWindowId, bringToFront, minimizeWindow, restoreWindow],
    );

    const layoutTargetCount = taskbarWindows.filter(
        (windowData) => (windowData.state ?? "normal") !== "minimized",
    ).length;

    return {
        activeWindowId,
        handleTaskbarItemClick,
        layoutTargetCount,
        taskbarWindows,
    };
};
