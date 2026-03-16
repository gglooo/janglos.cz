import { format } from "date-fns";
import { useCallback, useEffect, useRef } from "react";
import StartIcon from "../assets/start.png";
import { startMenuModel } from "../config/startMenuModel";
import { useDate } from "../hooks/useDate";
import { useAppStore } from "../store/appStore";
import { TaskbarContextMenu } from "./startBar/TaskbarContextMenu";
import { useStartMenuActions } from "./startBar/useStartMenuActions";
import { useTaskbarContextMenu } from "./startBar/useTaskbarContextMenu";
import { useTaskbarWindows } from "./startBar/useTaskbarWindows";
import StartItem from "./StartItem";
import { StartMenuTree } from "./startMenu/StartMenuTree";
import { useStartMenuNavigation } from "./startMenu/useStartMenuNavigation";

export const StartBar = () => {
    const isMenuVisible = useAppStore((s) => s.isStartMenuVisible);
    const setStartMenuVisible = useAppStore((s) => s.setStartMenuVisible);

    const currTime = useDate();
    const formattedTime = format(currTime, "HH:mm");

    const menuRef = useRef<HTMLDivElement | null>(null);

    const closeMenu = useCallback(() => {
        setStartMenuVisible(false);
    }, [setStartMenuVisible]);

    const { executeAction } = useStartMenuActions(closeMenu);

    const { focusPath, setFocusPath, activateNode, handleMenuKeyDown } =
        useStartMenuNavigation({
            rootNodes: startMenuModel,
            isMenuVisible,
            closeMenu,
            executeAction,
        });

    const {
        activeWindowId,
        handleTaskbarItemClick,
        layoutTargetCount,
        taskbarWindows,
    } = useTaskbarWindows();
    const {
        close: closeTaskbarMenu,
        open: openTaskbarMenu,
        position: taskbarMenuPosition,
        runCascade,
        runTileHorizontal,
        runTileVertical,
    } = useTaskbarContextMenu();

    useEffect(() => {
        if (!isMenuVisible) {
            return;
        }

        menuRef.current?.focus();
    }, [isMenuVisible]);

    useEffect(() => {
        if (!isMenuVisible || !taskbarMenuPosition) {
            return;
        }

        closeTaskbarMenu();
    }, [closeTaskbarMenu, isMenuVisible, taskbarMenuPosition]);

    return (
        <div
            className="w-full max-w-full h-10 bg-window text-black flex flex-row items-center gap-2 px-2 absolute bottom-0 z-1000 border-t-2 border-t-white border-l-2 border-l-white border-r-2 border-r-black border-b-2 border-b-black"
            onContextMenu={openTaskbarMenu}
        >
            {isMenuVisible ? (
                <div
                    className="fixed inset-0 z-1000"
                    onMouseDown={closeMenu}
                    aria-hidden="true"
                />
            ) : null}
            {taskbarMenuPosition ? (
                <div
                    className="fixed inset-0 z-1040"
                    onMouseDown={closeTaskbarMenu}
                    aria-hidden="true"
                />
            ) : null}

            <div className="relative shrink-0 z-1100">
                {isMenuVisible ? (
                    <div
                        ref={menuRef}
                        tabIndex={-1}
                        onKeyDown={handleMenuKeyDown}
                        className="absolute left-0 bottom-full mb-1 z-[1100] flex outline-none"
                    >
                        <div className="w-8 bg-blue text-white border-2 border-t-white border-l-white border-r-black border-b-black flex items-end justify-center">
                            <span
                                className="font-main text-xs tracking-wide mb-2"
                                style={{
                                    writingMode: "vertical-rl",
                                    transform: "rotate(180deg)",
                                }}
                            >
                                Windows 95
                            </span>
                        </div>
                        <StartMenuTree
                            nodes={startMenuModel}
                            focusPath={focusPath}
                            setFocusPath={setFocusPath}
                            activateNode={activateNode}
                        />
                    </div>
                ) : null}

                <button
                    type="button"
                    aria-label="Open Start menu"
                    aria-haspopup="menu"
                    aria-expanded={isMenuVisible}
                    onClick={() => setStartMenuVisible(!isMenuVisible)}
                    className="flex items-center shrink-0 cursor-pointer bg-transparent border-0 p-0 m-0 leading-none"
                >
                    <img
                        src={StartIcon}
                        alt=""
                        className={
                            "h-7 w-auto shrink-0 object-contain border-2 " +
                            (isMenuVisible
                                ? "border-t-black border-l-black border-r-white border-b-white"
                                : "border-t-white border-l-white border-r-black border-b-black")
                        }
                    />
                </button>
            </div>

            <div className="overflow-hidden flex flex-row max-w-full min-w-0 select-none cursor-pointer gap-1">
                {taskbarWindows.map((windowData) => (
                    <StartItem
                        key={windowData.id}
                        title={windowData.title}
                        isActive={
                            activeWindowId === windowData.id &&
                            (windowData.state ?? "normal") !== "minimized"
                        }
                        isMinimized={
                            (windowData.state ?? "normal") === "minimized"
                        }
                        onToggle={() => handleTaskbarItemClick(windowData)}
                    />
                ))}
            </div>
            <div className="ml-auto border-b-white border-r-white border border-grey px-2 font-main select-none">
                <h1 className="text-xl">{formattedTime}</h1>
            </div>
            {taskbarMenuPosition ? (
                <TaskbarContextMenu
                    position={taskbarMenuPosition}
                    hasLayoutTarget={layoutTargetCount > 0}
                    onCascade={runCascade}
                    onTileHorizontal={runTileHorizontal}
                    onTileVertical={runTileVertical}
                />
            ) : null}
        </div>
    );
};
