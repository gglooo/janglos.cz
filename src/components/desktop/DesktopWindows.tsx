import About from "../About";
import Projects from "../Projects";
import Weather from "../Weather";
import Window from "../Window";
import type { ContentType } from "../../types/ContentType";
import type { WeatherResponse } from "../../types/WeatherResponse";

interface DesktopWindowData {
    id: number;
    title: ContentType;
    initialPosition: { x: number; y: number };
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
                title={windowData.title}
                onClose={() => closeWindow(windowData.id)}
                initialPosition={windowData.initialPosition}
                zIndex={windowZIndexes[windowData.id] ?? 10}
                onMouseDown={() => bringToFront(windowData.id)}
            >
                {renderWindowContent(windowData.title, weather)}
            </Window>
        ))}
    </>
);
