import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type MouseEvent,
} from "react";
import { useDrag } from "react-dnd";
import { desktopRegistrySeed } from "../config/desktopIcons";
import { useMultiSelect } from "../hooks/useMultiSelect";
import { useAppStore } from "../store/appStore";
import type { DesktopItemId } from "../types/desktop";

interface BinRowProps {
    itemId: DesktopItemId;
    itemName: string;
    icon: string;
    selected: boolean;
    onClick: (
        itemId: DesktopItemId,
        event: MouseEvent<HTMLTableRowElement>,
    ) => void;
    onContextMenu: (
        event: MouseEvent<HTMLTableRowElement>,
        itemId: DesktopItemId,
    ) => void;
}

const TRASH_DRAG_SOURCE_PREFIX = "trash-item:";
interface BinRowData {
    itemId: DesktopItemId;
    icon: string;
    name: string;
}

const BinRow = ({
    itemId,
    itemName,
    icon,
    selected,
    onClick,
    onContextMenu,
}: BinRowProps) => {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: "normal",
            item: {
                itemId,
                index: `${TRASH_DRAG_SOURCE_PREFIX}${itemId}`,
                sourceSlotId: `${TRASH_DRAG_SOURCE_PREFIX}${itemId}`,
            },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [itemId],
    );

    return (
        <tr
            ref={(node) => {
                drag(node);
            }}
            className={
                "select-none cursor-grab " +
                (selected ? "bg-blue text-white" : "hover:bg-[#d8d8d8]")
            }
            onClick={(event) => onClick(itemId, event)}
            onContextMenu={(event) => onContextMenu(event, itemId)}
            aria-selected={selected}
            style={{ opacity: isDragging ? 0.45 : 1 }}
        >
            <td className="px-2 py-1">
                <div className="flex items-center gap-2">
                    <img src={icon} alt="" className="h-4 w-4" />
                    <span>{itemName}</span>
                </div>
            </td>
            <td className="px-2 py-1">Desktop</td>
            <td className="px-2 py-1">Desktop Item</td>
            <td className="px-2 py-1">-</td>
        </tr>
    );
};

export const RecycleBinWindow = () => {
    const trashItemIds = useAppStore((s) => s.trashItemIds);
    const restoreTrashItem = useAppStore((s) => s.restoreTrashItem);

    const [statusMessage, setStatusMessage] = useState("");
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        itemId: DesktopItemId;
    } | null>(null);

    useEffect(() => {
        const closeMenus = () => setContextMenu(null);
        window.addEventListener("mousedown", closeMenus);
        window.addEventListener("scroll", closeMenus, true);
        window.addEventListener("resize", closeMenus);
        return () => {
            window.removeEventListener("mousedown", closeMenus);
            window.removeEventListener("scroll", closeMenus, true);
            window.removeEventListener("resize", closeMenus);
        };
    }, []);

    const rows = useMemo<BinRowData[]>(() => {
        return trashItemIds.reduce<BinRowData[]>((acc, itemId) => {
            const item = desktopRegistrySeed.itemRegistry[itemId];
            if (!item) {
                return acc;
            }

            acc.push({
                itemId,
                icon: item.icon,
                name: item.name,
            });
            return acc;
        }, []);
    }, [trashItemIds]);
    const selectableItemIds = useMemo(
        () => rows.map((row) => row.itemId),
        [rows],
    );
    const {
        clearSelection,
        handleItemClick,
        handleKeyDown,
        isSelected,
        selectOnly,
        selectedIds,
    } = useMultiSelect<DesktopItemId>({
        itemIds: selectableItemIds,
    });

    const runRestore = useCallback(
        (itemId: DesktopItemId) => {
            const restored = restoreTrashItem(itemId);
            setContextMenu(null);
            if (!restored) {
                return false;
            }

            return true;
        },
        [restoreTrashItem],
    );

    const handleRestoreSelected = () => {
        if (selectedIds.length === 0) {
            return;
        }

        let restoredCount = 0;
        for (const itemId of selectedIds) {
            const restored = runRestore(itemId);
            if (restored) {
                restoredCount += 1;
            }
        }

        if (restoredCount === 0) {
            setStatusMessage("No free desktop slot available.");
            return;
        }

        const notRestoredCount = selectedIds.length - restoredCount;
        if (notRestoredCount === 0) {
            setStatusMessage(
                `Restored ${restoredCount} item${restoredCount === 1 ? "" : "s"}.`,
            );
        } else {
            setStatusMessage(
                `Restored ${restoredCount} item${restoredCount === 1 ? "" : "s"}, ${notRestoredCount} could not be restored.`,
            );
        }
        clearSelection();
    };

    const handleRowContextMenu = (
        event: MouseEvent<HTMLTableRowElement>,
        itemId: DesktopItemId,
    ) => {
        event.preventDefault();
        selectOnly(itemId);

        const menuWidth = 156;
        const menuHeight = 40;
        const maxX = Math.max(0, window.innerWidth - menuWidth);
        const maxY = Math.max(0, window.innerHeight - menuHeight);

        setContextMenu({
            x: Math.min(event.clientX, maxX),
            y: Math.min(event.clientY, maxY),
            itemId,
        });
    };

    return (
        <div
            ref={containerRef}
            className="relative flex h-full flex-col text-base"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseDown={() => {
                containerRef.current?.focus();
            }}
        >
            <div className="mb-2 flex items-center justify-between border border-r-white border-b-white p-1">
                <span className="text-sm">
                    {rows.length === 0
                        ? "Trash is empty."
                        : `${rows.length} item${rows.length === 1 ? "" : "s"} in Trash.`}
                </span>
                <button
                    type="button"
                    className="h-7 min-w-21 border border-l-white border-t-white border-r-2 border-b-2 bg-window px-2 disabled:text-grey"
                    onClick={handleRestoreSelected}
                    disabled={selectedIds.length === 0}
                >
                    Restore
                </button>
            </div>

            <div className="flex-1 overflow-auto border border-l-black border-t-black border-r-white border-b-white bg-white">
                <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 bg-window">
                        <tr className="border-b border-black text-left">
                            <th className="px-2 py-1 font-normal">Name</th>
                            <th className="px-2 py-1 font-normal">
                                Original Location
                            </th>
                            <th className="px-2 py-1 font-normal">Type</th>
                            <th className="px-2 py-1 font-normal">Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td className="px-2 py-2 text-grey" colSpan={4}>
                                    No items to display.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <BinRow
                                    key={row.itemId}
                                    itemId={row.itemId}
                                    itemName={row.name}
                                    icon={row.icon}
                                    selected={isSelected(row.itemId)}
                                    onClick={handleItemClick}
                                    onContextMenu={handleRowContextMenu}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {statusMessage ? (
                <div className="mt-2 border border-r-white border-b-white p-1 text-sm">
                    {statusMessage}
                </div>
            ) : null}

            {contextMenu ? (
                <div
                    className="fixed z-1200 min-w-39 border-2 border-t-white border-l-white border-r-black border-b-black bg-window p-0.5"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    role="menu"
                    aria-label="Trash item menu"
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    <button
                        type="button"
                        className="w-full px-2 py-0.5 text-left hover:bg-blue hover:text-white"
                        onClick={() => runRestore(contextMenu.itemId)}
                    >
                        Restore
                    </button>
                </div>
            ) : null}
        </div>
    );
};
