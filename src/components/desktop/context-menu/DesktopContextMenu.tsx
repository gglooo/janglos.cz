import type { CSSProperties } from "react";

export type DesktopContextAction =
    | "run"
    | "show-desktop"
    | "cascade"
    | "tile-horizontal"
    | "tile-vertical";

interface DesktopContextMenuProps {
    position: { x: number; y: number };
    hasOpenWindows: boolean;
    onAction: (action: DesktopContextAction) => void;
}

const menuButtonClassName =
    "w-full text-left px-3 py-[2px] hover:bg-blue hover:text-white disabled:text-grey disabled:hover:bg-transparent";

export const DesktopContextMenu = ({
    position,
    hasOpenWindows,
    onAction,
}: DesktopContextMenuProps) => {
    const style: CSSProperties = {
        left: position.x,
        top: position.y,
    };

    return (
        <div
            className="fixed z-1150 min-w-50 border-2 border-t-white border-l-white border-r-black border-b-black bg-window p-0.5 font-main text-lg"
            style={style}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            role="menu"
            aria-label="Desktop context menu"
        >
            <button
                type="button"
                className={menuButtonClassName}
                onClick={() => onAction("run")}
            >
                Run...
            </button>
            <button
                type="button"
                className={menuButtonClassName}
                onClick={() => onAction("show-desktop")}
                disabled={!hasOpenWindows}
            >
                Show desktop
            </button>
            <div className="mx-1 my-0.5 border-t border-grey" />
            <button
                type="button"
                className={menuButtonClassName}
                onClick={() => onAction("cascade")}
                disabled={!hasOpenWindows}
            >
                Cascade
            </button>
            <button
                type="button"
                className={menuButtonClassName}
                onClick={() => onAction("tile-horizontal")}
                disabled={!hasOpenWindows}
            >
                Tile Horizontally
            </button>
            <button
                type="button"
                className={menuButtonClassName}
                onClick={() => onAction("tile-vertical")}
                disabled={!hasOpenWindows}
            >
                Tile Vertically
            </button>
        </div>
    );
};
