import React from "react";
import { Rnd } from "react-rnd";
import { ContentType, ContentTypes } from "../types/ContentType";
import { useSetRecoilState } from "recoil";
import { openWindowsAtom } from "../atoms/OpenWindows";

interface WindowProps {
    children?: React.ReactNode;
    title: ContentType;
    onClose: () => void;
    initialPosition: { x: number; y: number };
    zIndex: number;
    onMouseDown: () => void;
}

export const Window = ({
    children,
    title,
    onClose,
    initialPosition,
    zIndex,
    onMouseDown,
}: WindowProps) => {
    const isMobile = window.innerWidth <= 768;
    const setOpenWindows = useSetRecoilState(openWindowsAtom);

    const createWindow = (event: React.MouseEvent, title: ContentType) => {
        if (title == "GitHub") {
            window.open("https://github.com/gglooo");
            return;
        }
        if (title == "LinkedIn") {
            window.open("https://www.linkedin.com/in/jan-glos-21007b202/");
            return;
        }

        setOpenWindows((windows) => [
            ...windows,
            {
                id: Date.now(),
                title: title,
                initialPosition: {
                    x: event.clientX - 100,
                    y: event.clientY - 65,
                },
            },
        ]);
    };

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
            <div className="flex flex-col bg-window font-main p-2 w-full h-full cursor-default overflow-hidden sm:overflow-auto lg:overflow-hidden md:overflow-hidden">
                <div className="flex gap-4 border border-r-white border-b-white p-1 pt-0 pb-0 mb-3 text-xl select-none">
                    {(() => {
                        return ContentTypes.map((tab) => (
                            <h2
                                key={tab}
                                className={
                                    (title == tab ? "underline" : "") +
                                    " first-letter:underline text-md select-none cursor-pointer overflow-hidden whitespace-nowrap max-w-xs truncate"
                                }
                                onClick={(event) => {
                                    if (title != tab) {
                                        onClose();
                                        createWindow(event, tab);
                                    }
                                }}
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
                width: 800,
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
            className={`lg:absolute lg:ml-auto lg:mr-auto font-main border-t-white border-l-white
                border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col
                row-span-4 overflow-hidden`}
            onMouseDown={onMouseDown}
            style={{ position: "absolute", zIndex }}
        >
            {content}
        </Rnd>
    ) : (
        <div
            className={`fixed max-h-[90%] w-full z-10 font-main border-t-white border-l-white
            border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col
            row-span-4 row-start-2 overflow-hidden top-1/2 left-1/2
            transform -translate-x-1/2 -translate-y-1/2`}
            onMouseDown={onMouseDown}
        >
            {content}
        </div>
    );
};

export default Window;
