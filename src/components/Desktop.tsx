import Wallpaper from "../assets/wallpaper.png";
import { DesktopGrid } from "./desktop/DesktopGrid";
import { DesktopWindows } from "./desktop/DesktopWindows";
import { useWeather } from "../hooks/useWeather";
import { useDesktopController } from "../hooks/useDesktopController";

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

    if (!weather.data) {
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
        </div>
    );
};

export default Desktop;
