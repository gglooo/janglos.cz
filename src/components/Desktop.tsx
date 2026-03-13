import Wallpaper from "../assets/wallpaper.png";
import { useCallback, type MouseEvent } from "react";
import { useDesktopController } from "../hooks/useDesktopController";
import { useWeather } from "../hooks/useWeather";
import { DesktopContextMenu } from "./desktop/context-menu/DesktopContextMenu";
import { useDesktopContextMenu } from "./desktop/context-menu/useDesktopContextMenu";
import { DesktopGrid } from "./desktop/DesktopGrid";
import { DesktopWindows } from "./desktop/DesktopWindows";

export const Desktop = () => {
    const weather = useWeather();
    const {
        assignments,
        bringToFront,
        closeWindow,
        desktopSlotOrder,
        handleIconClick,
        handleMove,
        handleTrashClick,
        openWindows,
        registry,
        setStartMenuVisible,
        trashCount,
        windowZIndexes,
    } = useDesktopController();
    const {
        position: contextMenuPosition,
        close: closeContextMenu,
        open: openContextMenu,
        runAction,
    } = useDesktopContextMenu();

    const hasOpenWindows = openWindows.some(
        (windowData) => windowData.state !== "minimized",
    );

    const handleDesktopClick = useCallback(() => {
        setStartMenuVisible(false);
        closeContextMenu();
    }, [closeContextMenu, setStartMenuVisible]);

    const handleDesktopContextMenu = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            setStartMenuVisible(false);
            openContextMenu(event);
        },
        [openContextMenu, setStartMenuVisible],
    );

    if (!weather.data) {
        return <div className="bg-desktop"></div>;
    }

    return (
        <div
            className="bg-desktop sm:pl-1 h-full w-full grid grid-cols-4
        sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 pt-2 grid-rows-6
        md:grid-rows-6 lg:grid-rows-8 lg:grid-flow-col sm:grid-flow-row"
            onClick={handleDesktopClick}
            onContextMenu={handleDesktopContextMenu}
        >
            <img
                src={Wallpaper}
                alt="wallpaper"
                className="fixed m-auto top-1/3 left-0 right-0 w-60 md:w-80 lg:w-96 select-none pointer-events-none z-0"
            />
            <DesktopGrid
                desktopSlotOrder={desktopSlotOrder}
                assignments={assignments}
                registry={registry}
                trashCount={trashCount}
                onMove={handleMove}
                onTrashClick={handleTrashClick}
                onIconClick={handleIconClick}
            />
            <DesktopWindows
                openWindows={openWindows}
                closeWindow={closeWindow}
                windowZIndexes={windowZIndexes}
                bringToFront={bringToFront}
                weather={weather.data}
            />
            {contextMenuPosition ? (
                <DesktopContextMenu
                    position={contextMenuPosition}
                    hasOpenWindows={hasOpenWindows}
                    onAction={runAction}
                />
            ) : null}
        </div>
    );
};

export default Desktop;
