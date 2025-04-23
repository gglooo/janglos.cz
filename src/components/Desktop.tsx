import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ContentType } from "../types/ContentType";
import { IconType } from "../types/IconType";
import { WeatherResponse } from "../types/WeatherResponse";
import About from "./About";
import Bin from "./Bin";
import { DesktopIcon } from "./DesktopIcon";
import { IconPlace } from "./IconPlace";
import Projects from "./Projects";
import Weather from "./Weather";
import Window from "./Window";

import GitHubIcon from "../assets/github.png";
import GlobeIcon from "../assets/globe.png";
import LinkedInIcon from "../assets/linkedin.png";
import ProjectsIcon from "../assets/projects.png";
import Wallpaper from "../assets/wallpaper.png";
import WeatherIcon from "../assets/weather.png";
import { useStartMenuContext } from "../context/StartMenuContext";
import { useTrashContext } from "../context/TrashContext";
import { useWindowContext } from "../context/WindowContext";

const sizes = {
    "About\u00A0me": { width: 800, height: 700 },
    Projects: { width: 1100, height: 700 },
    Weather: { width: 400, height: 300 },
    LinkedIn: { width: 800, height: 600 },
    GitHub: { width: 800, height: 600 },
};

export const Desktop = () => {
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const { windows, setWindows } = useWindowContext();
    const { setTrashContent } = useTrashContext();
    const { setIsStartMenuVisible } = useStartMenuContext();

    const swap = (from: string, to: string) => {
        setDesktop((desktop) => {
            const indices = desktop.map((elem) => elem.props.index);

            const fromElementIndex = indices.findIndex((i) => i === from);
            const toElementIndex = indices.findIndex((i) => i === to);

            const newDesktop = [...desktop];

            // handle bin, bin will always be id 0
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
        position: { x: number; y: number };
    }) => {
        setWindows((prevWindows) => [
            ...prevWindows,
            {
                ...newWindow,
                size: getDefaultWindowSize(newWindow.title),
                zIndex: 10,
                isMinimized: false,
                isMaximized: false,
            },
        ]);
    };

    const getDefaultWindowSize = (title: ContentType) => {
        return sizes[title];
    };

    const onTrashClick = (trashContent: JSX.Element[]) => {
        setDesktop((d) => placeFromBin(trashContent, d));
        setTrashContent([]);
    };

    let icons = [<Bin swap={swap} key={"0"} onClick={onTrashClick} />];
    icons = icons.concat(
        desktopIcons.map((icon) => {
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
                                createWindow({
                                    id: event.timeStamp,
                                    title: icon.name,
                                    position: {
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

    if (!weather) {
        return <div className="bg-desktop"></div>;
    }

    return (
        <div
            className="bg-desktop sm:pl-1 h-full w-full grid grid-cols-4
        sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 pt-2 grid-rows-6
        md:grid-rows-6 lg:grid-rows-8 lg:grid-flow-col sm:grid-flow-row"
            onClick={() => setIsStartMenuVisible(false)}
        >
            <img
                src={Wallpaper}
                alt="wallpaper"
                className="fixed m-auto top-1/3 left-0 right-0 w-60 md:w-80 lg:w-96 select-none pointer-events-none z-0"
            />
            {desktop}
            {windows.map((window) => (
                <Window
                    key={window.id}
                    metadata={window}
                    Component={windowComponents[window.title]}
                />
            ))}
        </div>
    );
};

export const desktopIcons: {
    icon: string;
    name: ContentType;
    type?: IconType;
    onClick?: VoidFunction;
    hidden?: boolean;
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
        hidden: true,
    },
    {
        icon: LinkedInIcon,
        name: "LinkedIn",
        type: "link",
        onClick: () =>
            window.open("https://www.linkedin.com/in/jan-glos-21007b202/"),
        hidden: true,
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
