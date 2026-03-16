import type {
    DesktopIconContextAction,
    DesktopIconContextTarget,
} from "../../components/desktop/context-menu/iconMenuTypes";
import type { DesktopItemDefinition } from "../../components/desktop/desktopTypes";
import {
    resolveLaunchUrl,
    resolveWindowTitle,
} from "../../components/desktop/desktopUtils";
import type { ContentType } from "../../types/ContentType";
import type { DesktopItemId } from "../../types/desktop";
import type { WindowLaunchSource } from "../../utils/windowPlacement";

interface DesktopActionFactoryDeps {
    registry: Record<string, DesktopItemDefinition>;
    launchDesktopItem?: (...args: unknown[]) => void;
    openWindow: (payload: {
        title: ContentType;
        source: WindowLaunchSource;
    }) => void;
    sendDesktopItemToTrash?: (itemId: DesktopItemId) => void;
    showShellDialog: (payload: { title: string; message: string }) => void;
}

type DesktopActionHandler = VoidFunction;

const createItemOpenHandler = (
    deps: DesktopActionFactoryDeps,
    itemId: string,
): DesktopActionHandler => {
    return () => {
        const item = deps.registry[itemId];
        if (!item) {
            return;
        }

        if (deps.launchDesktopItem) {
            deps.launchDesktopItem({ itemId, source: "desktop" });
            return;
        }

        const launchUrl = resolveLaunchUrl(item);
        if (launchUrl) {
            window.open(launchUrl);
            return;
        }

        if (item.onClick) {
            item.onClick();
            return;
        }

        const title = resolveWindowTitle(item);
        if (!title) {
            return;
        }

        deps.openWindow({ title, source: "desktop" });
    };
};

const createItemDeleteHandler = (
    deps: DesktopActionFactoryDeps,
    itemId: string,
): DesktopActionHandler => {
    return () => {
        if (!deps.registry[itemId]) {
            return;
        }

        deps.sendDesktopItemToTrash?.(itemId as DesktopItemId);
    };
};

const createTrashDeleteHandler = (
    deps: DesktopActionFactoryDeps,
): DesktopActionHandler => {
    return () => {
        deps.showShellDialog({
            title: "Error",
            message: "Cannot delete Trash.",
        });
    };
};

export const createDesktopActionHandlerFactory = (
    deps: DesktopActionFactoryDeps,
) => {
    return (
        target: DesktopIconContextTarget,
        action: DesktopIconContextAction,
    ): DesktopActionHandler => {
        if (target.kind === "trash") {
            if (action === "open") {
                return () =>
                    deps.openWindow({ title: "Trash", source: "desktop" });
            }

            return createTrashDeleteHandler(deps);
        }

        if (action === "open") {
            return createItemOpenHandler(deps, target.itemId);
        }

        return createItemDeleteHandler(deps, target.itemId);
    };
};
