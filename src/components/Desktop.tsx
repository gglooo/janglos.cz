import { useEffect, useState } from "react";
import { DesktopIcon } from "./DesktopIcon";
import Window from "./Window";
import About from "./About";
import Projects from "./Projects";
import { ContentType } from "../types/ContentType";
import Weather from "./Weather";
import { WeatherResponse } from "../types/WeatherResponse";
import { IconPlace } from "./IconPlace";
import { IconType } from "../types/IconType";
import Bin from "./Bin";
import { useAppStore } from "../store/appStore";

import GlobeIcon from "../assets/globe.png";
import ProjectsIcon from "../assets/projects.png";
import WeatherIcon from "../assets/weather.png";
import GitHubIcon from "../assets/github.png";
import LinkedInIcon from "../assets/linkedin.png";
import Wallpaper from "../assets/wallpaper.png";

export const Desktop = () => {
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const openWindows = useAppStore((s) => s.openWindows);
    const addWindow = useAppStore((s) => s.addWindow);
    const closeWindow = useAppStore((s) => s.closeWindow);
    const windowZIndexes = useAppStore((s) => s.windowZIndexes);
    const bringToFront = useAppStore((s) => s.bringToFront);
    const addToTrash = useAppStore((s) => s.addToTrash);
    const clearTrash = useAppStore((s) => s.clearTrash);
    const setStartMenuVisible = useAppStore((s) => s.setStartMenuVisible);

    const swap = (from: string, to: string) => {
        setDesktop((desktop) => {
            const indices = desktop.map((elem) => elem.props.index);

            const fromElementIndex = indices.findIndex((i) => i === from);
            const toElementIndex = indices.findIndex((i) => i === to);

            const newDesktop = [...desktop];

            // handle bin, bin will always be id 0
            if (to === "0" && from !== "0") {
                addToTrash(newDesktop[fromElementIndex]);

                const uuid = crypto.randomUUID();
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
            `https://api.weatherapi.com/v1/current.json?q=Brno&key=${import.meta.env.VITE_WEATHER_API_KEY}`
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
        Weather: () => <Weather data={weather!} />,
        LinkedIn: () => <></>,
        GitHub: () => <></>,
    };

    const onTrashClick = () => {
        const trashContent = clearTrash();
        setDesktop((desktop) => placeFromBin(trashContent, desktop));
    };

    let icons = [
        <Bin swap={swap} key={"0"} index={"0"} onClick={onTrashClick} />,
    ];
    icons = icons.concat(
        desktopIcons.map((icon) => {
            const id = crypto.randomUUID();
            return (
                <IconPlace key={id} index={id} move={swap}>
                    <DesktopIcon
                        icon={icon.icon}
                        name={icon.name}
                        type={icon.type ?? "normal"}
                        onClick={
                            icon.onClick ??
                            ((event) => {
                                addWindow({
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
        const id = crypto.randomUUID();
        icons.push(<IconPlace key={id} index={id} move={swap}></IconPlace>);
    }

    const [desktop, setDesktop] = useState(icons);

    const newWindows = openWindows.map((w) => (
        <Window
            key={w.id}
            title={w.title}
            onClose={() => closeWindow(w.id)}
            initialPosition={w.initialPosition}
            zIndex={windowZIndexes[w.id] ?? 10}
            onMouseDown={() => bringToFront(w.id)}
        >
            {windowComponents[w.title]()}
        </Window>
    ));

    if (!weather) {
        return <div className="bg-desktop"></div>;
    }

    return (
        <div
            className="bg-desktop sm:pl-1 h-full w-full grid grid-cols-4
        sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 pt-2 grid-rows-6
        md:grid-rows-6 lg:grid-rows-8 lg:grid-flow-col sm:grid-flow-row"
            onClick={() => setStartMenuVisible(false)}
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
