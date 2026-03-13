import About from "../About";
import Projects from "../Projects";
import { RunWindow } from "../RunWindow";
import Weather from "../Weather";
import type { ContentType } from "../../types/ContentType";
import type { WeatherResponse } from "../../types/WeatherResponse";

interface WindowContentParams {
    title: ContentType;
    weather: WeatherResponse;
    onClose: () => void;
}

export const renderWindowContent = ({
    title,
    weather,
    onClose,
}: WindowContentParams) => {
    switch (title) {
        case "About\u00A0me":
            return <About />;
        case "Projects":
            return <Projects />;
        case "Weather":
            return <Weather data={weather} />;
        case "Run":
            return <RunWindow onClose={onClose} />;
        default:
            return null;
    }
};
