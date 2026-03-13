import React from "react";
import { Rnd } from "react-rnd";
import { desktopIcons } from "../config/desktopIcons";
import { useIsMobile } from "../hooks/useIsMobile";
import { useAppStore } from "../store/appStore";
import { ContentType, ContentTypes } from "../types/ContentType";
import {
    getWindowSizeConstraints,
    type WindowPlacementBounds,
} from "../utils/windowPlacement";

interface WindowProps {
    children?: React.ReactNode;
    id: number;
    title: ContentType;
    onClose: () => void;
    bounds: WindowPlacementBounds;
    zIndex: number;
    onMouseDown: () => void;
}

const windowTabTypes = ContentTypes.filter(
    (contentType) => contentType !== "Run",
);

export const Window = ({
    children,
    id,
    title,
    onClose,
    bounds,
    zIndex,
    onMouseDown,
}: WindowProps) => {
    const isMobile = useIsMobile();
    const openWindow = useAppStore((s) => s.openWindow);
    const updateWindowBounds = useAppStore((s) => s.updateWindowBounds);
    const minimizeWindow = useAppStore((s) => s.minimizeWindow);
    const maximizeWindow = useAppStore((s) => s.maximizeWindow);
    const restoreWindow = useAppStore((s) => s.restoreWindow);
    const windowState = useAppStore(
        (s) =>
            s.openWindows.find((windowItem) => windowItem.id === id)?.state ??
            "normal",
    );
    const isMaximized = windowState === "maximized";
    const shouldRenderTabs = title !== "Run";

    const handleTabClick = (tab: ContentType) => {
        if (title === tab) return;

        const iconConfig = desktopIcons.find((i) => i.name === tab);
        if (iconConfig?.onClick) {
            iconConfig.onClick();
            return;
        }

        onClose();
        openWindow({ title: tab, source: "tab-switch" });
    };

    const content = (
        <>
            <div className="bg-blue w-full border-b border-b-black text-left flex items-center pb-1">
                <h1 className="text-xl text-white mr-4 ml-2 select-none">
                    {title}
                </h1>
                <button
                    type="button"
                    onClick={() => minimizeWindow(id)}
                    className="border-t-white border-l-white border-2 ml-auto bg-window mr-1 mt-1 w-7 h-7 text-center flex justify-center items-center hover:bg-grey hover:cursor-pointer"
                    aria-label={`Minimize ${title} window`}
                >
                    <span className="leading-none text-lg">_</span>
                </button>
                <button
                    type="button"
                    onClick={() =>
                        isMaximized ? restoreWindow(id) : maximizeWindow(id)
                    }
                    className="border-t-white border-l-white border-2 bg-window mr-1 mt-1 w-7 h-7 text-center flex justify-center items-center hover:bg-grey hover:cursor-pointer"
                    aria-label={`${isMaximized ? "Restore" : "Maximize"} ${title} window`}
                >
                    <span className="leading-none text-base">
                        {isMaximized ? "[]" : "[ ]"}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="border-t-white border-l-white border-2 bg-window mr-2 mt-1 w-7 h-7 text-center flex justify-center items-center hover:bg-grey hover:cursor-pointer"
                    aria-label={`Close ${title} window`}
                >
                    <span>X</span>
                </button>
            </div>
            <div className="flex flex-col bg-window font-main p-2 w-full h-full cursor-default overflow-hidden sm:overflow-auto lg:overflow-hidden md:overflow-hidden">
                {shouldRenderTabs ? (
                    <div className="flex gap-4 border border-r-white border-b-white p-1 pt-0 pb-0 mb-3 text-xl select-none">
                        {windowTabTypes.map((tab) => (
                            <h2
                                key={tab}
                                className={
                                    (title === tab ? "underline" : "") +
                                    " first-letter:underline text-md select-none cursor-pointer overflow-hidden whitespace-nowrap max-w-xs truncate"
                                }
                                onClick={() => handleTabClick(tab)}
                            >
                                {tab}
                            </h2>
                        ))}
                    </div>
                ) : null}
                <div className="overflow-auto pb-10 flex-1">{children}</div>
            </div>
        </>
    );

    const viewportWidth =
        typeof window !== "undefined" ? window.innerWidth : bounds.width;
    const constraints = getWindowSizeConstraints(title, viewportWidth);

    return !isMobile ? (
        <Rnd
            default={{
                width: bounds.width,
                height: bounds.height,
                x: bounds.x,
                y: bounds.y,
            }}
            minHeight={constraints.minHeight}
            minWidth={constraints.minWidth}
            position={{ x: bounds.x, y: bounds.y }}
            size={{ width: bounds.width, height: bounds.height }}
            disableDragging={isMaximized}
            enableResizing={!isMaximized}
            className={`lg:absolute lg:ml-auto lg:mr-auto font-main border-t-white border-l-white
                border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col
                row-span-4 overflow-hidden`}
            onMouseDown={onMouseDown}
            onDragStop={(_, data) => {
                updateWindowBounds(id, {
                    x: data.x,
                    y: data.y,
                    width: data.node.offsetWidth,
                    height: data.node.offsetHeight,
                });
            }}
            onResizeStop={(_, __, ref, ___, position) => {
                updateWindowBounds(id, {
                    x: position.x,
                    y: position.y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                });
            }}
            style={{ position: "absolute", zIndex }}
        >
            {content}
        </Rnd>
    ) : (
        <div
            className={`fixed left-2 right-2 top-2 bottom-10 z-10 font-main border-t-white border-l-white
            border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col
            row-span-4 row-start-2 overflow-hidden`}
            style={{ zIndex }}
            onClick={onMouseDown}
        >
            {content}
        </div>
    );
};

export default Window;
