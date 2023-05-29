import { is } from "date-fns/locale";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { ContentType, ContentTypes } from "../types/ContentType";
import About from "./About";
import Education from "./Education";
import Projects from "./Projects";
import Weather from "./Weather";

interface WindowProps {
    children?: React.ReactNode;
    title: ContentType;
    onClose: () => void;
    initialPosition: { x: number; y: number };
}

export const Window = ({
    children,
    title,
    onClose,
    initialPosition,
}: WindowProps) => {
    const [zIndex, setZIndex] = useState(10);
    const isMobile = window.innerWidth <= 768;

    const content = (
        <>
            <div className="bg-blue w-full border-b border-b-black text-left flex items-center">
                <h1 className="text-xl text-white mr-4 ml-2 select-none">
                    {title}
                </h1>
                <a
                    onClick={onClose}
                    className="border-t-white border-l-white border-2 ml-auto bg-window mr-2 mt-1 pr-2 pl-2 mb-1 text-center flex justify-center items-center hover:bg-grey hover:cursor-pointer"
                >
                    <span>X</span>
                </a>
            </div>
            <div className="flex flex-col bg-window font-main p-2 w-full h-full cursor-default">
                <div className="flex gap-5 border border-r-white border-b-white p-1 pt-0 pb-0 mb-3 text-xl select-none">
                    {(() => {
                        return ContentTypes.map((tab) => (
                            <h2
                                className={
                                    (title == tab ? "underline" : "") +
                                    " first-letter:underline"
                                }
                            >
                                {tab}
                            </h2>
                        ));
                    })()}
                </div>
                <div className="overflow-auto pb-10">{children}</div>
            </div>
        </>
    );

    const defaultSettings = {
        "About\u00A0me": {
            default: {
                width: 1100,
                height: 700,
                x: initialPosition.x,
                y: initialPosition.y,
            },
            minHeight: 80,
            minWidth: 700,
            x: initialPosition.x,
            y: initialPosition.y,
        },
        Education: {
            default: {
                width: 1100,
                height: 700,
                x: initialPosition.x,
                y: initialPosition.y,
            },
            minHeight: 80,
            minWidth: 700,
            x: initialPosition.x,
            y: initialPosition.y,
        },
        Projects: {
            default: {
                width: 1100,
                height: 700,
                x: initialPosition.x,
                y: initialPosition.y,
            },
            minHeight: 80,
            minWidth: 700,
        },
        Weather: {
            default: {
                width: 400,
                height: 300,
                x: initialPosition.x,
                y: initialPosition.y,
            },
            minHeight: 80,
            minWidth: 350,
            x: initialPosition.x,
            y: initialPosition.y,
        },
    };

    return !isMobile ? (
        <Rnd
            {...defaultSettings[title]}
            className={`lg:absolute z-${zIndex} lg:ml-auto lg:mr-auto font-main border-t-white border-l-white border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col row-span-4 overflow-hidden`}
        >
            {content}
        </Rnd>
    ) : (
        <div
            className={`lg:absolute z-${zIndex} lg:ml-auto lg:mr-auto font-main border-t-white border-l-white border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col row-span-4 overflow-hidden row-start-2`}
        >
            {content}
        </div>
    );
};

export default Window;
