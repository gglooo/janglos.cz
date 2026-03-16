import { create, type StateCreator } from "zustand";
import {
    persist,
    type PersistStorage,
    type StorageValue,
} from "zustand/middleware";
import { desktopRegistrySeed } from "../config/desktopIcons";
import { createDesktopSlice, type DesktopSlice } from "./slices/desktopSlice";
import { createUiShellSlice, type UiShellSlice } from "./slices/uiShellSlice";
import {
    createWindowSlice,
    type WindowData,
    type WindowSlice,
} from "./slices/windowSlice";

export type AppState = WindowSlice & UiShellSlice & DesktopSlice;
export type { WindowData };

type PersistedShellState = Pick<
    AppState,
    | "desktopSlotOrder"
    | "desktopSlotAssignments"
    | "trashItemIds"
    | "openWindows"
    | "nextWindowId"
    | "highestZIndex"
    | "windowZIndexes"
    | "windowBoundsById"
    | "lastKnownBoundsByTitle"
    | "isPoweredOn"
    | "bootSequenceCompleted"
>;

interface PersistedAppState extends PersistedShellState {
    desktopSeedSignature: string;
}

interface AppStoreActions {
    shutdownAndReset: () => void;
}

type StoreState = AppState & AppStoreActions;

const SHELL_PERSIST_KEY = "janglos-shell-state";
const SHELL_PERSIST_VERSION = 1;
const DESKTOP_SEED_SIGNATURE = desktopRegistrySeed.itemIds.join("|");

const createDefaultShellState = (): PersistedShellState => ({
    desktopSlotOrder: [...desktopRegistrySeed.slotOrder],
    desktopSlotAssignments: { ...desktopRegistrySeed.slotAssignments },
    trashItemIds: [],
    openWindows: [],
    nextWindowId: 1,
    highestZIndex: 10,
    windowZIndexes: {},
    windowBoundsById: {},
    lastKnownBoundsByTitle: {},
    isPoweredOn: false,
    bootSequenceCompleted: false,
});

const createDefaultPersistedState = (): PersistedAppState => ({
    ...createDefaultShellState(),
    desktopSeedSignature: DESKTOP_SEED_SIGNATURE,
});

const hasValidDesktopSeedSignature = (persistedState: unknown) => {
    if (!persistedState || typeof persistedState !== "object") {
        return false;
    }

    return (
        (persistedState as { desktopSeedSignature?: unknown })
            .desktopSeedSignature === DESKTOP_SEED_SIGNATURE
    );
};

const safeLocalStorage: PersistStorage<PersistedAppState> = {
    getItem: (name) => {
        if (typeof window === "undefined") {
            return null;
        }

        const rawValue = window.localStorage.getItem(name);
        if (!rawValue) {
            return null;
        }

        try {
            const parsed = JSON.parse(
                rawValue,
            ) as StorageValue<PersistedAppState>;
            if (!parsed || typeof parsed !== "object" || !("state" in parsed)) {
                window.localStorage.removeItem(name);
                return null;
            }
            return parsed;
        } catch {
            window.localStorage.removeItem(name);
            return null;
        }
    },
    setItem: (name, value) => {
        if (typeof window === "undefined") {
            return;
        }
        window.localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
        if (typeof window === "undefined") {
            return;
        }
        window.localStorage.removeItem(name);
    },
};

const createAppState: StateCreator<StoreState, [], [], StoreState> = (
    set,
    get,
    api,
) => ({
    ...createWindowSlice<StoreState>()(set, get, api),
    ...createUiShellSlice<StoreState>()(set, get, api),
    ...createDesktopSlice<StoreState>()(set, get, api),
    shutdownAndReset: () => {
        const defaults = createDefaultShellState();

        set({
            ...defaults,
            restoreBoundsById: {},
            isStartMenuVisible: false,
        } as Partial<StoreState>);
    },
});

const sanitizePersistedState = (
    persistedState: Partial<PersistedShellState>,
): PersistedShellState => {
    const defaults = createDefaultShellState();

    return {
        desktopSlotOrder: Array.isArray(persistedState.desktopSlotOrder)
            ? persistedState.desktopSlotOrder
            : defaults.desktopSlotOrder,
        desktopSlotAssignments:
            persistedState.desktopSlotAssignments &&
            typeof persistedState.desktopSlotAssignments === "object"
                ? persistedState.desktopSlotAssignments
                : defaults.desktopSlotAssignments,
        trashItemIds: Array.isArray(persistedState.trashItemIds)
            ? persistedState.trashItemIds
            : defaults.trashItemIds,
        openWindows: Array.isArray(persistedState.openWindows)
            ? persistedState.openWindows
            : defaults.openWindows,
        nextWindowId:
            typeof persistedState.nextWindowId === "number"
                ? persistedState.nextWindowId
                : defaults.nextWindowId,
        highestZIndex:
            typeof persistedState.highestZIndex === "number"
                ? persistedState.highestZIndex
                : defaults.highestZIndex,
        windowZIndexes:
            persistedState.windowZIndexes &&
            typeof persistedState.windowZIndexes === "object"
                ? persistedState.windowZIndexes
                : defaults.windowZIndexes,
        windowBoundsById:
            persistedState.windowBoundsById &&
            typeof persistedState.windowBoundsById === "object"
                ? persistedState.windowBoundsById
                : defaults.windowBoundsById,
        lastKnownBoundsByTitle:
            persistedState.lastKnownBoundsByTitle &&
            typeof persistedState.lastKnownBoundsByTitle === "object"
                ? persistedState.lastKnownBoundsByTitle
                : defaults.lastKnownBoundsByTitle,
        isPoweredOn:
            typeof persistedState.isPoweredOn === "boolean"
                ? persistedState.isPoweredOn
                : defaults.isPoweredOn,
        bootSequenceCompleted:
            typeof persistedState.bootSequenceCompleted === "boolean"
                ? persistedState.bootSequenceCompleted
                : defaults.bootSequenceCompleted,
    };
};

export const useAppStore = create<StoreState>()(
    persist(createAppState, {
        name: SHELL_PERSIST_KEY,
        version: SHELL_PERSIST_VERSION,
        storage: safeLocalStorage,
        partialize: (state) => ({
            desktopSlotOrder: state.desktopSlotOrder,
            desktopSlotAssignments: state.desktopSlotAssignments,
            trashItemIds: state.trashItemIds,
            openWindows: state.openWindows,
            nextWindowId: state.nextWindowId,
            highestZIndex: state.highestZIndex,
            windowZIndexes: state.windowZIndexes,
            windowBoundsById: state.windowBoundsById,
            lastKnownBoundsByTitle: state.lastKnownBoundsByTitle,
            isPoweredOn: state.isPoweredOn,
            bootSequenceCompleted: state.bootSequenceCompleted,
            desktopSeedSignature: DESKTOP_SEED_SIGNATURE,
        }),
        migrate: (persistedState, version) => {
            if (
                version > SHELL_PERSIST_VERSION ||
                !persistedState ||
                typeof persistedState !== "object"
            ) {
                return createDefaultPersistedState();
            }

            if (!hasValidDesktopSeedSignature(persistedState)) {
                return createDefaultPersistedState();
            }

            return {
                ...sanitizePersistedState(
                    persistedState as Partial<PersistedShellState>,
                ),
                desktopSeedSignature: DESKTOP_SEED_SIGNATURE,
            };
        },
        merge: (persistedState, currentState) => ({
            ...currentState,
            ...(persistedState && hasValidDesktopSeedSignature(persistedState)
                ? sanitizePersistedState(
                      persistedState as Partial<PersistedShellState>,
                  )
                : createDefaultShellState()),
        }),
    }),
);
