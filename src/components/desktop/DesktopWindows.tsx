import type { ContentType } from "../../types/ContentType";
import type { WindowPlacementBounds } from "../../utils/windowPlacement";
import Window from "../Window";
import { renderWindowContent } from "./windowContent";

interface DesktopWindowData {
    id: number;
    title: ContentType;
    bounds: WindowPlacementBounds;
    state?: "normal" | "minimized" | "maximized";
}

interface DesktopWindowsProps {
    openWindows: DesktopWindowData[];
    closeWindow: (id: number) => void;
    windowZIndexes: Record<number, number>;
    bringToFront: (windowId: number) => void;
}

export const DesktopWindows = ({
    openWindows,
    closeWindow,
    windowZIndexes,
    bringToFront,
}: DesktopWindowsProps) => {
    const visibleWindows = openWindows.filter(
        (windowData) => windowData.state !== "minimized",
    );
    const activeWindowId = visibleWindows.reduce<number | null>(
        (topId, windowData) => {
            if (topId === null) {
                return windowData.id;
            }

            const currentZ = windowZIndexes[windowData.id] ?? 10;
            const topZ = windowZIndexes[topId] ?? 10;
            return currentZ >= topZ ? windowData.id : topId;
        },
        null,
    );

    return (
        <>
            {visibleWindows.map((windowData) => (
                <Window
                    key={windowData.id}
                    id={windowData.id}
                    title={windowData.title}
                    onClose={() => closeWindow(windowData.id)}
                    bounds={windowData.bounds}
                    zIndex={windowZIndexes[windowData.id] ?? 10}
                    isActive={windowData.id === activeWindowId}
                    onMouseDown={() => bringToFront(windowData.id)}
                >
                    {renderWindowContent({
                        title: windowData.title,
                        onClose: () => closeWindow(windowData.id),
                    })}
                </Window>
            ))}
        </>
    );
};
