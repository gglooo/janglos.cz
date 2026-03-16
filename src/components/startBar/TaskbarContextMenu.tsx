import type { CSSProperties } from "react";

interface TaskbarContextMenuProps {
    position: { x: number; y: number };
    hasLayoutTarget: boolean;
    onCascade: () => void;
    onTileHorizontal: () => void;
    onTileVertical: () => void;
}

const menuButtonClassName =
    "w-full text-left px-3 py-[2px] hover:bg-blue hover:text-white disabled:text-grey disabled:hover:bg-transparent";

export const TaskbarContextMenu = ({
    position,
    hasLayoutTarget,
    onCascade,
    onTileHorizontal,
    onTileVertical,
}: TaskbarContextMenuProps) => {
    const style: CSSProperties = {
        left: position.x,
        top: position.y,
    };

    return (
        <div
            className="fixed z-[1060] min-w-[212px] border-2 border-t-white border-l-white border-r-black border-b-black bg-window p-[2px] font-main text-lg"
            style={style}
            onMouseDown={(event) => event.stopPropagation()}
            role="menu"
            aria-label="Taskbar window manager menu"
        >
            <button
                type="button"
                className={menuButtonClassName}
                onClick={onCascade}
                disabled={!hasLayoutTarget}
            >
                Cascade
            </button>
            <button
                type="button"
                className={menuButtonClassName}
                onClick={onTileHorizontal}
                disabled={!hasLayoutTarget}
            >
                Tile Horizontally
            </button>
            <button
                type="button"
                className={menuButtonClassName}
                onClick={onTileVertical}
                disabled={!hasLayoutTarget}
            >
                Tile Vertically
            </button>
        </div>
    );
};
