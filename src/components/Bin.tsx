import type { MouseEventHandler } from "react";
import emptyBinImage from "../assets/empty_bin.png";
import fullBinImage from "../assets/full_bin.png";
import type {
    DesktopItemId,
    DesktopItemMetadata,
    DesktopSlotId,
} from "../types/DesktopRegistry";
import { DesktopIcon } from "./DesktopIcon";
import { IconPlace } from "./IconPlace";

interface BinProps {
    swap?: (from: string, to: string) => void;
    index?: string;
    slotId?: DesktopSlotId;
    itemId?: DesktopItemId;
    trashItemIds?: DesktopItemId[];
    onClick?: MouseEventHandler<HTMLDivElement>;
    onRestore?: MouseEventHandler<HTMLDivElement>;
    onDrop?: (payload: {
        itemId?: DesktopItemId;
        sourceSlotId: DesktopSlotId;
        targetSlotId: DesktopSlotId;
    }) => void;
}

const BIN_ITEM_ID = "trash";

export const Bin = ({
    swap,
    index,
    slotId,
    itemId = BIN_ITEM_ID,
    trashItemIds,
    onClick,
    onRestore,
    onDrop,
}: BinProps) => {
    const resolvedSlotId = slotId ?? index ?? "0";
    const resolvedTrashItemIds = trashItemIds ?? [];
    const iconPath =
        resolvedTrashItemIds.length === 0 ? emptyBinImage : fullBinImage;
    const metadata: DesktopItemMetadata = {
        icon: iconPath,
        name: "Trash",
        type: "trash",
    };

    return (
        <IconPlace
            key={resolvedSlotId}
            index={resolvedSlotId}
            slotId={resolvedSlotId}
            move={swap}
            onDrop={onDrop}
        >
            <DesktopIcon
                metadata={metadata}
                itemId={itemId}
                slotId={resolvedSlotId}
                index={resolvedSlotId}
                onClick={onRestore ?? onClick ?? (() => undefined)}
                key={itemId}
            />
        </IconPlace>
    );
};

export default Bin;
