import React, { useState } from "react";
import { DesktopIcon } from "./DesktopIcon";
import { useDrop } from "react-dnd";
import Window from "./Window";

export const Desktop = () => {
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
            title: string;
            initialPosition: { x: number; y: number };
        }[]
    >([]);

    const createWindow = (
        title: string,
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

    return (
        <div
            className="bg-desktop h-full w-full grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 grid-rows-6 pt-2"
            ref={drop}
        >
            <img
                src="src/assets/wallpaper.png"
                alt="wallpaper"
                className="absolute m-auto mt-52 left-0 right-0 w-60 md:w-80 lg:w-96 select-none pointer-events-none"
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
            <DesktopIcon
                icon="src/assets/education.png"
                name="Education"
                type="normal"
                onClick={(event) => {
                    createWindow("Education", {
                        x: event.clientX,
                        y: event.clientY,
                    });
                }}
            />
            <DesktopIcon
                icon="src/assets/globe.png"
                name="About me"
                type="normal"
                onClick={(event) => {
                    createWindow("About me", {
                        x: event.clientX,
                        y: event.clientY,
                    });
                }}
            />
            <DesktopIcon
                icon="src/assets/projects.png"
                name="Projects"
                type="normal"
                onClick={(event) => {
                    createWindow("Projects", {
                        x: event.clientX,
                        y: event.clientY,
                    });
                }}
            />
            {windows.map((window) => (
                <Window
                    key={window.id}
                    title={window.title}
                    onClose={() => closeWindow(window.id)}
                    initialPosition={window.initialPosition}
                ></Window>
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
