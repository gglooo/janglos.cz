import React, { useEffect, useState } from "react";
import { DesktopIcon } from "./DesktopIcon";
import { useDrop } from "react-dnd";
import Window from "./Window";
import Education from "./Education";
import About from "./About";
import Projects from "./Projects";
import { ContentType } from "../types/ContentType";
import Weather from "./Weather";
import { WeatherResponse } from "../types/WeatherResponse";

export const Desktop = () => {
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [isTrashEmpty, setIsTrashEmpty] = useState(true);
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: "normal",
            drop: () => console.log("asd"),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        []
    );
    const [windows, setWindows] = useState<
        {
            id: number;
            title: ContentType;
            initialPosition: { x: number; y: number };
        }[]
    >([]);

    useEffect(() => {
        fetch(
            "https://api.weatherapi.com/v1/current.json?q=Brno&key=" +
                import.meta.env.VITE_WEATHER_API_KEY
        )
            .then((response) => response.json())
            .then((data) => setWeather(data));
    }, []);

    if (!weather) {
        return;
    }

    const windowComponents = {
        Education: Education,
        "About\u00A0me": About,
        Projects: Projects,
        Weather: () => Weather(weather!),
    };

    const createWindow = (
        title: ContentType,
        initialPosition: { x: number; y: number }
    ) => {
        const newWindow = {
            id: 1,
            title,
            initialPosition,
        };
        setWindows([...windows, newWindow]);
    };

    const closeWindow = (id: number) => {
        setWindows(windows.filter((window) => window.id !== id));
    };

    const desktopIcons: { icon: string; name: ContentType }[] = [
        {
            icon: "education.png",
            name: "Education",
        },
        {
            icon: "globe.png",
            name: "About\u00A0me",
        },
        {
            icon: "projects.png",
            name: "Projects",
        },
        {
            icon: "weather.png",
            name: "Weather",
        },
    ];

    return (
        <div
            className="bg-desktop h-full w-full grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 grid-rows-6 pt-2"
            ref={drop}
        >
            <img
                src="src/assets/wallpaper.png"
                alt="wallpaper"
                className="absolute m-auto mt-52 left-0 right-0 w-60 md:w-80 lg:w-96 select-none pointer-events-none z-0"
            />
            <DesktopIcon
                icon={
                    "src/assets/" +
                    (isTrashEmpty ? "empty" : "full") +
                    "_bin.png"
                }
                name="Trash"
                type="trash"
                onClick={() => console.log()}
            />
            {desktopIcons.map((icon) => (
                <DesktopIcon
                    icon={"src/assets/" + icon.icon}
                    name={icon.name}
                    type="normal"
                    onClick={(event) => {
                        createWindow(icon.name, {
                            x: event.clientX,
                            y: event.clientY,
                        });
                    }}
                />
            ))}
            {windows.map((window) => (
                <Window
                    key={window.id}
                    title={window.title}
                    onClose={() => closeWindow(window.id)}
                    initialPosition={window.initialPosition}
                >
                    {windowComponents[window.title]()}
                </Window>
            ))}
        </div>
    );
};

const placeIcon = (icon: JSX.Element) => {
    icon.props.className =
        "absolute m-auto mt-52 left-0 right-0 w-60 md:w-80 lg:w-96";
    return;
};

export default Desktop;
