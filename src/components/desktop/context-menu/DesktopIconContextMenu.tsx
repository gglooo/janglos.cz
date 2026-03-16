import type { CSSProperties } from "react";
import type { DesktopIconContextAction } from "./iconMenuTypes";

interface DesktopIconContextMenuProps {
    position: { x: number; y: number };
    onAction: (action: DesktopIconContextAction) => void;
}

const menuButtonClassName =
    "w-full text-left px-3 py-[2px] hover:bg-blue hover:text-white";

export const DesktopIconContextMenu = ({
    position,
    onAction,
}: DesktopIconContextMenuProps) => {
    const style: CSSProperties = {
        left: position.x,
        top: position.y,
    };

    return (
        <div
            className="fixed z-1150 min-w-40 border-2 border-t-white border-l-white border-r-black border-b-black bg-window p-0.5 font-main text-lg"
            style={style}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            role="menu"
            aria-label="Desktop icon context menu"
        >
            <button
                type="button"
                className={menuButtonClassName}
                onClick={() => onAction("open")}
            >
                Open
            </button>
            <button
                type="button"
                className={menuButtonClassName}
                onClick={() => onAction("delete")}
            >
                Delete
            </button>
        </div>
    );
};
