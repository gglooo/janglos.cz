import Window from "../Window";
import type { ContentType } from "../../types/ContentType";
import type { WeatherResponse } from "../../types/WeatherResponse";
import type { WindowPlacementBounds } from "../../utils/windowPlacement";
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
    weather: WeatherResponse;
}

export const DesktopWindows = ({
    openWindows,
    closeWindow,
    windowZIndexes,
    bringToFront,
    weather,
}: DesktopWindowsProps) => (
    <>
        {openWindows
            .filter((windowData) => windowData.state !== "minimized")
            .map((windowData) => (
                <Window
                    key={windowData.id}
                    id={windowData.id}
                    title={windowData.title}
                    onClose={() => closeWindow(windowData.id)}
                    bounds={windowData.bounds}
                    zIndex={windowZIndexes[windowData.id] ?? 10}
                    onMouseDown={() => bringToFront(windowData.id)}
                >
                    {renderWindowContent({
                        title: windowData.title,
                        weather,
                        onClose: () => closeWindow(windowData.id),
                    })}
                </Window>
            ))}
    </>
);
