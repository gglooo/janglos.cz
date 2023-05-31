import React, { SyntheticEvent, useEffect, useState } from "react";
import { DesktopIcon } from "./DesktopIcon";
import { useDrop } from "react-dnd";
import Window from "./Window";
import Education from "./Education";
import About from "./About";
import Projects from "./Projects";
import { ContentType } from "../types/ContentType";
import Weather from "./Weather";
import { WeatherResponse } from "../types/WeatherResponse";
import { IconPlace } from "./IconPlace";
import { IconType } from "../models/IconType";
import Bin from "./Bin";
import { trashContentAtom } from "../atoms/TrashContentAtom";
import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";

export const Desktop = () => {
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [windows, setWindows] = useState<
        {
            id: number;
            title: ContentType;
            initialPosition: { x: number; y: number };
        }[]
    >([]);
    const [trashContent, setTrashContent] = useRecoilState(trashContentAtom);

    const swap = (from: string, to: string) => {
        setDesktop((desktop) => {
            const indices = desktop.map((elem) => elem.props.index);

            const fromElementIndex = indices.findIndex((i) => i === from);
            const toElementIndex = indices.findIndex((i) => i === to);

            const newDesktop = [...desktop];

            // handle bin, bin will always be index 0
            if (to == "0" && from != "0") {
                setTrashContent((trashContent) => [
                    ...trashContent,
                    newDesktop[fromElementIndex],
                ]);

                const uuid = uuidv4();
                newDesktop[fromElementIndex] = (
                    <IconPlace key={uuid} index={uuid} move={swap} />
                );
                return newDesktop;
            }

            const temp = newDesktop[fromElementIndex];
            newDesktop[fromElementIndex] = newDesktop[toElementIndex];
            newDesktop[toElementIndex] = temp;

            return newDesktop;
        });
    };

    useEffect(() => {
        fetch(
            "https://api.weatherapi.com/v1/current.json?q=Brno&key=" +
                import.meta.env.VITE_WEATHER_API_KEY
        )
            .then((response) => response.json())
            .then((data) => setWeather(data));
    }, []);

    const windowComponents = {
        Education: Education,
        "About\u00A0me": About,
        Projects: Projects,
        Weather: () => Weather(weather!),
    };

    const createWindow = (newWindow: {
        id: number;
        title: ContentType;
        initialPosition: { x: number; y: number };
    }) => {
        setWindows((windows) => [...windows, newWindow]);
    };

    const closeWindow = (id: number) => {
        setWindows(windows.filter((window) => window.id !== id));
    };

    const onTrashClick = () => {
        setTrashContent((trashContent) => {
            setDesktop((desktop) => placeFromBin(trashContent, desktop));
            return [];
        });
    };

    let icons = [
        <Bin swap={swap} key={"0"} index={"0"} onClick={onTrashClick} />,
    ];
    icons = icons.concat(
        desktopIcons.map((icon, i) => {
            const id = uuidv4();
            return (
                <IconPlace key={id} index={id} move={swap}>
                    <DesktopIcon
                        icon={"src/assets/" + icon.icon}
                        name={icon.name}
                        type={icon.type ?? "normal"}
                        onClick={(event) => {
                            // since these windows are created by the user's click, it should be
                            // safe to use the timestamp as the id/key.
                            createWindow({
                                id: event.timeStamp,
                                title: icon.name,
                                initialPosition: {
                                    x: event.clientX,
                                    y: event.clientY,
                                },
                            });
                        }}
                        index={id}
                        key={id}
                    />
                </IconPlace>
            );
        })
    );

    const maxCells = 6 * 12;

    for (let i = icons.length; i < maxCells; i++) {
        const id = uuidv4();
        icons.push(<IconPlace key={id} index={id} move={swap}></IconPlace>);
    }

    const [desktop, setDesktop] = useState(icons);

    if (!weather) {
        return;
    }

    return (
        <div className="bg-desktop h-full w-full grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 grid-rows-6 pt-2">
            <img
                src="src/assets/wallpaper.png"
                alt="wallpaper"
                className="absolute m-auto mt-52 left-0 right-0 w-60 md:w-80 lg:w-96 select-none pointer-events-none z-0"
            />
            {desktop}
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

const desktopIcons: {
    icon: string;
    name: ContentType;
    type?: IconType;
    onClick?: VoidFunction;
}[] = [
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

const placeIcon = (icon: JSX.Element) => {
    icon.props.className =
        "absolute m-auto mt-52 left-0 right-0 w-60 md:w-80 lg:w-96";
    return;
};

const placeFromBin = (trashContent: JSX.Element[], desktop: JSX.Element[]) => {
    const newDesktop = [];
    let trashIndex = 0;

    console.log(desktop.map((elem) => elem.props.index));

    for (let i = 0; i < desktop.length; i++) {
        if (
            desktop[i].props.children === undefined &&
            trashContent.length > trashIndex &&
            // dont overwrite the bin
            desktop[i].props.index !== "0"
        ) {
            newDesktop.push(trashContent[trashIndex++]);
        } else {
            newDesktop.push(desktop[i]);
        }
    }

    // console.log(newDesktop.map((elem) => elem.props.index));
    return newDesktop;
};

export default Desktop;
