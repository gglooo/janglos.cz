import { is } from "date-fns/locale";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { ContentType, ContentTypes } from "../types/ContentType";
import { highestZIndexAtom } from "../atoms/HighestZIndex";
import { useRecoilState } from "recoil";

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
    const isMobile = window.innerWidth <= 768;
    const [highestZIndex, setHighestZIndex] = useRecoilState(highestZIndexAtom);
    const [zIndex, setZIndex] = useState(highestZIndex);

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
            <div className="flex flex-col bg-window font-main p-2 w-full h-full cursor-default overflow-auto">
                <div className="flex gap-4 border border-r-white border-b-white p-1 pt-0 pb-0 mb-3 text-xl select-none">
                    {(() => {
                        return ContentTypes.map((tab) => (
                            <h2
                                key={tab}
                                className={
                                    (title == tab ? "underline" : "") +
                                    " first-letter:underline text-md"
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
            minWidth: 389,
            x: initialPosition.x,
            y: initialPosition.y,
        },
    };

    return !isMobile ? (
        <Rnd
            {...defaultSettings[
                title as Exclude<ContentType, "GitHub" | "LinkedIn">
            ]}
            className={`lg:absolute lg:ml-auto lg:mr-auto font-main border-t-white border-l-white border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col row-span-4 overflow-hidden`}
            onMouseDown={() => {
                setHighestZIndex((highest) => {
                    setZIndex(highest + 10);
                    return highest + 10;
                });
            }}
            style={{ position: "absolute", zIndex }}
        >
            {content}
        </Rnd>
    ) : (
        <div
            className={`fixed max-h-[80%] z-10 font-main border-t-white border-l-white border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col row-span-4  row-start-2 overflow-hidden`}
        >
            {content}
        </div>
    );
};

export default Window;
