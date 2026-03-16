import React from "react";
import { Rnd } from "react-rnd";
import { desktopIcons } from "../config/desktopIcons";
import { useIsMobile } from "../hooks/useIsMobile";
import { useAppStore } from "../store/appStore";
import {
    WindowCloseIcon,
    WindowMaximizeIcon,
    WindowMinimizeIcon,
    WindowRestoreIcon,
} from "./WindowControlIcons";
import { ContentType, ContentTypes } from "../types/ContentType";
import {
    getWindowSizeConstraints,
    isForcedFullscreenTitle,
    type WindowPlacementBounds,
} from "../utils/windowPlacement";

interface WindowProps {
    children?: React.ReactNode;
    id: number;
    title: ContentType;
    onClose: () => void;
    bounds: WindowPlacementBounds;
    zIndex: number;
    isActive: boolean;
    onMouseDown: () => void;
}

const windowTabTypes = ContentTypes.filter(
    (contentType) =>
        contentType !== "Run" &&
        contentType !== "Task Manager" &&
        !isForcedFullscreenTitle(contentType),
);

export const Window = ({
    children,
    id,
    title,
    onClose,
    bounds,
    zIndex,
    isActive,
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
    const isForcedFullscreen = isForcedFullscreenTitle(title);
    const isMaximized = windowState === "maximized";
    const effectiveMaximized = isMaximized || isForcedFullscreen;
    const shouldRenderTabs =
        !isForcedFullscreen &&
        title !== "Run" &&
        title !== "Trash" &&
        title !== "Task Manager";

    React.useEffect(() => {
        if (isForcedFullscreen && windowState !== "maximized") {
            maximizeWindow(id);
        }
    }, [id, isForcedFullscreen, maximizeWindow, windowState]);

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
            <div
                className={`window-drag-handle w-full border-b border-b-black text-left flex items-center pb-1 ${
                    isActive ? "bg-blue" : "bg-grey"
                }`}
            >
                <h1
                    className={`text-xl mr-4 ml-2 select-none ${
                        isActive ? "text-white" : "text-black"
                    }`}
                >
                    {title}
                </h1>
                <button
                    type="button"
                    onClick={() => minimizeWindow(id)}
                    className="border-t-white border-l-white border-2 ml-auto bg-window mr-1 mt-1 w-7 h-7 text-center flex justify-center items-center hover:bg-grey hover:cursor-pointer"
                    aria-label={`Minimize ${title} window`}
                >
                    <WindowMinimizeIcon />
                </button>
                {!isForcedFullscreen ? (
                    <button
                        type="button"
                        onClick={() =>
                            isMaximized ? restoreWindow(id) : maximizeWindow(id)
                        }
                        className="border-t-white border-l-white border-2 bg-window mr-1 mt-1 w-7 h-7 text-center flex justify-center items-center hover:bg-grey hover:cursor-pointer"
                        aria-label={`${isMaximized ? "Restore" : "Maximize"} ${title} window`}
                    >
                        {isMaximized ? <WindowRestoreIcon /> : <WindowMaximizeIcon />}
                    </button>
                ) : null}
                <button
                    type="button"
                    onClick={onClose}
                    className="border-t-white border-l-white border-2 bg-window mr-2 mt-1 w-7 h-7 text-center flex justify-center items-center hover:bg-grey hover:cursor-pointer"
                    aria-label={`Close ${title} window`}
                >
                    <WindowCloseIcon />
                </button>
            </div>
            <div
                className={`flex flex-col font-main w-full h-full cursor-default overflow-hidden sm:overflow-auto lg:overflow-hidden md:overflow-hidden ${
                    isForcedFullscreen ? "bg-black p-0" : "bg-window p-2"
                }`}
            >
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
                <div
                    className={`flex-1 ${
                        isForcedFullscreen
                            ? "overflow-hidden pb-0"
                            : "overflow-auto pb-10"
                    }`}
                >
                    {children}
                </div>
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
            disableDragging={effectiveMaximized}
            dragHandleClassName="window-drag-handle"
            enableResizing={!effectiveMaximized}
            className={`lg:absolute lg:ml-auto lg:mr-auto font-main border-t-white border-l-white
                border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col
                row-span-4 overflow-hidden desktop-window-shell`}
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
            border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col desktop-window-shell
            row-span-4 row-start-2 overflow-hidden`}
            style={{ zIndex }}
            onClick={onMouseDown}
        >
            {content}
        </div>
    );
};

export default Window;
