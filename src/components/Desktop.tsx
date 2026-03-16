import {
    useCallback,
    useEffect,
    useRef,
    type MouseEvent,
    type PointerEvent,
} from "react";
import Wallpaper from "../assets/wallpaper.png";
import { useDesktopMultiDragDrop } from "../hooks/desktop-selection/useDesktopMultiDragDrop";
import { useDesktopSelectionHitTest } from "../hooks/desktop-selection/useDesktopSelectionHitTest";
import { useDesktopSelectionMarquee } from "../hooks/desktop-selection/useDesktopSelectionMarquee";
import { useDesktopSelectionState } from "../hooks/desktop-selection/useDesktopSelectionState";
import { useDesktopController } from "../hooks/useDesktopController";
import { DesktopContextMenu } from "./desktop/context-menu/DesktopContextMenu";
import { DesktopIconContextMenu } from "./desktop/context-menu/DesktopIconContextMenu";
import type { DesktopIconContextAction } from "./desktop/context-menu/iconMenuTypes";
import { useDesktopContextMenu } from "./desktop/context-menu/useDesktopContextMenu";
import { useDesktopIconContextMenu } from "./desktop/context-menu/useDesktopIconContextMenu";
import { DesktopGrid } from "./desktop/DesktopGrid";
import { DesktopWindows } from "./desktop/DesktopWindows";
import { DesktopMultiDragPreview } from "./desktop/selection/DesktopMultiDragPreview";
import { DesktopSelectionMarquee } from "./desktop/selection/DesktopSelectionMarquee";

const MARQUEE_DRAG_THRESHOLD_PX = 3;

export const Desktop = () => {
    const desktopRef = useRef<HTMLDivElement>(null);
    const pointerDownPositionRef = useRef<{ x: number; y: number } | null>(
        null,
    );
    const suppressNextDesktopClickRef = useRef(false);

    const {
        assignments,
        bringToFront,
        closeWindow,
        desktopSlotOrder,
        handleDesktopTargetAction,
        handleIconClick,
        handleMove,
        handleTrashClick,
        moveDesktopItemsToSlots,
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
    const {
        menuState: iconContextMenuState,
        close: closeIconContextMenu,
        openForTarget: openIconContextMenuForTarget,
    } = useDesktopIconContextMenu();
    const { getIntersectingItemIds } = useDesktopSelectionHitTest();
    const {
        clearSelection,
        isSelected,
        selectOnly,
        selectedItemIds,
        setSelection,
    } = useDesktopSelectionState();
    const { onDrop } = useDesktopMultiDragDrop({
        assignments,
        desktopSlotOrder,
        selectedItemIds,
        moveDesktopItem: handleMove,
        moveDesktopItemsToSlots,
    });
    const { marqueeActive, onPointerDown, onPointerMove, selectionRect } =
        useDesktopSelectionMarquee({
            desktopRef,
            resolveSelection: (rect) => {
                if (!desktopRef.current) {
                    return [];
                }

                return getIntersectingItemIds(desktopRef.current, rect);
            },
            onSelectionChange: setSelection,
        });

    useEffect(() => {
        const resetPointerTracking = () => {
            pointerDownPositionRef.current = null;
        };

        window.addEventListener("pointerup", resetPointerTracking);
        window.addEventListener("pointercancel", resetPointerTracking);

        return () => {
            window.removeEventListener("pointerup", resetPointerTracking);
            window.removeEventListener("pointercancel", resetPointerTracking);
        };
    }, []);

    const hasOpenWindows = openWindows.some(
        (windowData) => windowData.state !== "minimized",
    );

    const handleDesktopClick = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            setStartMenuVisible(false);
            closeContextMenu();
            closeIconContextMenu();
            if (suppressNextDesktopClickRef.current) {
                suppressNextDesktopClickRef.current = false;
                return;
            }

            const target = event.target as HTMLElement;
            if (!target.closest("[data-desktop-icon-root='true']")) {
                clearSelection();
            }
        },
        [
            clearSelection,
            closeContextMenu,
            closeIconContextMenu,
            setStartMenuVisible,
        ],
    );

    const handleDesktopContextMenu = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            setStartMenuVisible(false);
            closeIconContextMenu();
            openContextMenu(event);
        },
        [closeIconContextMenu, openContextMenu, setStartMenuVisible],
    );

    const handleDesktopItemContextMenu = useCallback(
        (itemId: string) => (event: MouseEvent<HTMLDivElement>) => {
            setStartMenuVisible(false);
            closeContextMenu();
            selectOnly(itemId);
            openIconContextMenuForTarget(event, { kind: "item", itemId });
        },
        [
            closeContextMenu,
            openIconContextMenuForTarget,
            selectOnly,
            setStartMenuVisible,
        ],
    );

    const handleTrashContextMenu = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            setStartMenuVisible(false);
            closeContextMenu();
            clearSelection();
            openIconContextMenuForTarget(event, { kind: "trash" });
        },
        [
            clearSelection,
            closeContextMenu,
            openIconContextMenuForTarget,
            setStartMenuVisible,
        ],
    );

    const handleIconContextAction = useCallback(
        (action: DesktopIconContextAction) => {
            const target = iconContextMenuState?.target;
            if (!target) {
                return;
            }

            if (action === "open") {
                handleDesktopTargetAction(target, "open");
            } else {
                handleDesktopTargetAction(target, "delete");
            }

            closeIconContextMenu();
        },
        [closeIconContextMenu, handleDesktopTargetAction, iconContextMenuState],
    );

    const handleIconPointerDown = useCallback(
        (itemId: string) => () => {
            if (!isSelected(itemId)) {
                selectOnly(itemId);
            }
        },
        [isSelected, selectOnly],
    );

    const handleDesktopPointerDown = useCallback(
        (event: PointerEvent<HTMLDivElement>) => {
            onPointerDown(event);

            if (event.button !== 0) {
                pointerDownPositionRef.current = null;
                return;
            }

            const target = event.target as HTMLElement;
            const canStartMarquee =
                !target.closest("[data-desktop-icon-root='true']") &&
                !target.closest(".desktop-window-shell");

            if (!canStartMarquee) {
                pointerDownPositionRef.current = null;
                return;
            }

            suppressNextDesktopClickRef.current = false;
            pointerDownPositionRef.current = {
                x: event.clientX,
                y: event.clientY,
            };
        },
        [onPointerDown],
    );

    const handleDesktopPointerMove = useCallback(
        (event: PointerEvent<HTMLDivElement>) => {
            onPointerMove(event);

            const start = pointerDownPositionRef.current;
            if (!start) {
                return;
            }

            const deltaX = Math.abs(event.clientX - start.x);
            const deltaY = Math.abs(event.clientY - start.y);
            if (
                deltaX >= MARQUEE_DRAG_THRESHOLD_PX ||
                deltaY >= MARQUEE_DRAG_THRESHOLD_PX
            ) {
                suppressNextDesktopClickRef.current = true;
            }
        },
        [onPointerMove],
    );

    return (
        <div
            ref={desktopRef}
            className="bg-desktop sm:pl-1 h-full w-full grid grid-cols-4
        sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 pt-2 pb-10 box-border grid-rows-6
        md:grid-rows-6 lg:grid-rows-8 lg:grid-flow-col sm:grid-flow-row relative"
            onClick={handleDesktopClick}
            onPointerDown={handleDesktopPointerDown}
            onPointerMove={handleDesktopPointerMove}
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
                onDrop={onDrop}
                onTrashClick={handleTrashClick}
                onIconClick={handleIconClick}
                onIconContextMenu={handleDesktopItemContextMenu}
                onTrashContextMenu={handleTrashContextMenu}
                onIconPointerDown={handleIconPointerDown}
                selectedItemIds={selectedItemIds}
            />
            <DesktopSelectionMarquee
                rect={marqueeActive ? selectionRect : null}
            />
            <DesktopMultiDragPreview
                assignments={assignments}
                desktopSlotOrder={desktopSlotOrder}
                registry={registry}
            />
            <DesktopWindows
                openWindows={openWindows}
                closeWindow={closeWindow}
                windowZIndexes={windowZIndexes}
                bringToFront={bringToFront}
            />
            {contextMenuPosition ? (
                <DesktopContextMenu
                    position={contextMenuPosition}
                    hasOpenWindows={hasOpenWindows}
                    onAction={runAction}
                />
            ) : null}
            {iconContextMenuState ? (
                <DesktopIconContextMenu
                    position={iconContextMenuState.position}
                    onAction={handleIconContextAction}
                />
            ) : null}
        </div>
    );
};

export default Desktop;
