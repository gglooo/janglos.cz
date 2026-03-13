import { useAppStore } from "../../store/appStore";
import type { ContentType } from "../../types/ContentType";
import type { DesktopItemId, DesktopSlotId } from "../../types/desktop";
import type {
    WindowLaunchSource,
    WindowPlacementBounds,
} from "../../utils/windowPlacement";
import type {
    DesktopItemRegistry,
    DesktopSlotAssignments,
} from "./desktopTypes";

export interface DesktopStoreCompat {
    openWindows: {
        id: number;
        title: ContentType;
        bounds: WindowPlacementBounds;
    }[];
    closeWindow: (id: number) => void;
    windowZIndexes: Record<number, number>;
    bringToFront: (windowId: number) => void;
    openWindow: (payload: {
        title: ContentType;
        source: WindowLaunchSource;
        requestedPosition?: { x: number; y: number };
    }) => void;
    updateWindowBounds: (windowId: number, bounds: WindowPlacementBounds) => void;
    setStartMenuVisible: (visible: boolean) => void;
    desktopItemRegistry?: DesktopItemRegistry;
    desktopSlotOrder?: string[];
    desktopSlots?: string[];
    desktopSlotAssignments?: DesktopSlotAssignments;
    slotAssignments?: DesktopSlotAssignments;
    trashItemIds?: string[];
    trashedItemIds?: string[];
    initializeDesktopLayout?: () => void;
    moveDesktopItem?: (fromSlotId: DesktopSlotId, toSlotId: DesktopSlotId) => void;
    sendDesktopItemToTrash?: (itemId: DesktopItemId) => void;
    restoreTrashItems?: () => DesktopItemId[];
    launchDesktopItem?: (...args: unknown[]) => void;
}

export const useDesktopStore = <T,>(selector: (state: DesktopStoreCompat) => T) =>
    useAppStore((state) => selector(state as unknown as DesktopStoreCompat));
