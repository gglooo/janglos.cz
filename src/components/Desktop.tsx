import React, { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { DesktopIcon } from "./DesktopIcon";
import Window from "./Window";
import About from "./About";
import Projects from "./Projects";
import { ContentType } from "../types/ContentType";
import Weather from "./Weather";
import { WeatherResponse } from "../types/WeatherResponse";
import { IconPlace } from "./IconPlace";
import { IconType } from "../models/IconType";
import Bin from "./Bin";
import { trashContentAtom } from "../atoms/TrashContentAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { openWindowsAtom } from "../atoms/OpenWindows";
import { v4 as uuidv4 } from "uuid";
import { iStartMenuVisible } from "../atoms/StartMenuVisible";

import GlobeIcon from "../assets/globe.png";
import ProjectsIcon from "../assets/projects.png";
import WeatherIcon from "../assets/weather.png";
import GitHubIcon from "../assets/github.png";
import LinkedInIcon from "../assets/linkedin.png";
import Wallpaper from "../assets/wallpaper.png";
import { openWindowComponents } from "../atoms/OpenWindowComponents";
import { highestZIndexAtom } from "../atoms/HighestZIndex";

console.log(GlobeIcon);

export const Desktop = () => {
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [windows, setWindows] = useRecoilState(openWindowsAtom);
    const setWindowComponents = useSetRecoilState(openWindowComponents);
    const setTrashContent = useSetRecoilState(trashContentAtom);
    const setIsMenuVisible = useSetRecoilState(iStartMenuVisible);
    const [highestZIndex, setHighestZIndex] = useRecoilState(highestZIndexAtom);
    const [windowZIndexes, setWindowZIndexes] = useState<{
        [key: number]: number;
    }>({});

    const updateWindowZIndex = (windowId: number) =>
        setHighestZIndex((highest) => {
            setWindowZIndexes((prevZIndexes) => ({
                ...prevZIndexes,
                [windowId]: highest + 10,
            }));
            return highest + 10;
        });

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
                "4429d0cf53674ceb927153811232905"
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error: status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setWeather(data))
            .catch((error) => console.log(error));
    }, []);

    const windowComponents = {
        "About\u00A0me": About,
        Projects: Projects,
        Weather: () => Weather(weather!),
        LinkedIn: () => <></>,
        GitHub: () => <></>,
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
                        icon={icon.icon}
                        name={icon.name}
                        type={icon.type ?? "normal"}
                        onClick={
                            icon.onClick ??
                            ((event) => {
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
                            })
                        }
                        index={id}
                        key={id}
                    />
                </IconPlace>
            );
        })
    );

    const maxCells = 8 * 16;

    for (let i = icons.length; i < maxCells; i++) {
        const id = uuidv4();
        icons.push(<IconPlace key={id} index={id} move={swap}></IconPlace>);
    }

    const [desktop, setDesktop] = useState(icons);

    const newWindows = windows.map((window) => (
        <Window
            key={window.id}
            title={window.title}
            onClose={() => closeWindow(window.id)}
            initialPosition={window.initialPosition}
            zIndex={windowZIndexes[window.id] ?? 10}
            onMouseDown={() => updateWindowZIndex(window.id)}
        >
            {windowComponents[window.title]()}
        </Window>
    ));

    useEffect(() => {
        setWindowComponents(newWindows);
    }, [windows]);

    if (!weather) {
        return <div className="bg-desktop"></div>;
    }

    return (
        <div
            className="bg-desktop sm:pl-1 h-full w-full grid grid-cols-4
        sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 pt-2 grid-rows-6
        md:grid-rows-6 lg:grid-rows-8 lg:grid-flow-col sm:grid-flow-row"
            onClick={() => setIsMenuVisible(false)}
        >
            <img
                src={Wallpaper}
                alt="wallpaper"
                className="fixed m-auto top-1/3 left-0 right-0 w-60 md:w-80 lg:w-96 select-none pointer-events-none z-0"
            />
            {desktop}
            {newWindows}
        </div>
    );
};

export const desktopIcons: {
    icon: string;
    name: ContentType;
    type?: IconType;
    onClick?: VoidFunction;
}[] = [
    {
        icon: GlobeIcon,
        name: "About\u00A0me",
    },
    {
        icon: ProjectsIcon,
        name: "Projects",
    },
    {
        icon: WeatherIcon,
        name: "Weather",
    },
    {
        icon: GitHubIcon,
        name: "GitHub",
        type: "link",
        onClick: () => window.open("https://github.com/gglooo"),
    },
    {
        icon: LinkedInIcon,
        name: "LinkedIn",
        type: "link",
        onClick: () =>
            window.open("https://www.linkedin.com/in/jan-glos-21007b202/"),
    },
];

const placeFromBin = (trashContent: JSX.Element[], desktop: JSX.Element[]) => {
    const newDesktop = [];
    let trashIndex = 0;

    for (let i = 0; i < desktop.length; i++) {
        if (
            desktop[i].props.children === undefined &&
            trashContent.length > trashIndex &&
            desktop[i].props.index !== "0" // dont overwrite the bin
        ) {
            newDesktop.push(trashContent[trashIndex++]);
        } else {
            newDesktop.push(desktop[i]);
        }
    }

    return newDesktop;
};

export default Desktop;
