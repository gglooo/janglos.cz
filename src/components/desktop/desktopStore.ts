import { useAppStore } from "../../store/appStore";
import type { ContentType } from "../../types/ContentType";
import type { DesktopItemId, DesktopSlotId } from "../../types/desktop";
import type {
    DesktopItemRegistry,
    DesktopSlotAssignments,
} from "./desktopTypes";

export interface DesktopStoreCompat {
    openWindows: {
        id: number;
        title: ContentType;
        initialPosition: { x: number; y: number };
    }[];
    closeWindow: (id: number) => void;
    windowZIndexes: Record<number, number>;
    bringToFront: (windowId: number) => void;
    addWindow: (window: {
        id: number;
        title: ContentType;
        initialPosition: { x: number; y: number };
    }) => void;
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
