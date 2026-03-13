import About from "../About";
import Projects from "../Projects";
import Weather from "../Weather";
import Window from "../Window";
import type { ContentType } from "../../types/ContentType";
import type { WeatherResponse } from "../../types/WeatherResponse";
import type { WindowPlacementBounds } from "../../utils/windowPlacement";

interface DesktopWindowData {
    id: number;
    title: ContentType;
    bounds: WindowPlacementBounds;
}

interface DesktopWindowsProps {
    openWindows: DesktopWindowData[];
    closeWindow: (id: number) => void;
    windowZIndexes: Record<number, number>;
    bringToFront: (windowId: number) => void;
    weather: WeatherResponse;
}

const renderWindowContent = (title: ContentType, weather: WeatherResponse) => {
    switch (title) {
        case "About\u00A0me":
            return <About />;
        case "Projects":
            return <Projects />;
        case "Weather":
            return <Weather data={weather} />;
        default:
            return null;
    }
};

export const DesktopWindows = ({
    openWindows,
    closeWindow,
    windowZIndexes,
    bringToFront,
    weather,
}: DesktopWindowsProps) => (
    <>
        {openWindows.map((windowData) => (
            <Window
                key={windowData.id}
                id={windowData.id}
                title={windowData.title}
                onClose={() => closeWindow(windowData.id)}
                bounds={windowData.bounds}
                zIndex={windowZIndexes[windowData.id] ?? 10}
                onMouseDown={() => bringToFront(windowData.id)}
            >
                {renderWindowContent(windowData.title, weather)}
            </Window>
        ))}
    </>
);
