import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import type { StartMenuAction, StartMenuItem } from "../../types/startMenu";
import {
    firstInteractiveIndex,
    getMenuAtDepth,
    getNodeAtPath,
    isPrefixPath,
    moveInteractiveIndex,
} from "./navigation";

interface UseStartMenuNavigationProps {
    rootNodes: StartMenuItem[];
    isMenuVisible: boolean;
    closeMenu: () => void;
    executeAction: (action: StartMenuAction) => void;
}

export const useStartMenuNavigation = ({
    rootNodes,
    isMenuVisible,
    closeMenu,
    executeAction,
}: UseStartMenuNavigationProps) => {
    const [focusPath, setFocusPath] = useState<number[]>([]);

    useEffect(() => {
        if (!isMenuVisible) {
            return;
        }

        setFocusPath([]);
    }, [isMenuVisible, rootNodes]);

    const activateNode = useCallback(
        (path: number[]) => {
            const node = getNodeAtPath(rootNodes, path);
            if (!node || node.kind === "separator" || node.disabled) {
                return;
            }

            if (node.kind === "submenu") {
                const isSubmenuExpanded =
                    focusPath.length >= path.length &&
                    isPrefixPath(path, focusPath);
                console.log({ node, focusPath, path, isSubmenuExpanded });
                if (isSubmenuExpanded) {
                    setFocusPath(path.slice(0, -1));
                    return;
                }

                setFocusPath([...path, firstInteractiveIndex(node.items)]);
                return;
            }

            executeAction(node.action);
        },
        [executeAction, focusPath, rootNodes],
    );

    const handleMenuKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (!isMenuVisible) {
                return;
            }

            const depth = Math.max(0, focusPath.length - 1);
            const currentMenu = getMenuAtDepth(rootNodes, focusPath, depth);
            const currentIndex =
                focusPath[depth] ?? firstInteractiveIndex(currentMenu);
            const currentNode = getNodeAtPath(rootNodes, focusPath);

            if (event.key === "Escape") {
                event.preventDefault();
                closeMenu();
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                const nextIndex = moveInteractiveIndex(
                    currentMenu,
                    currentIndex,
                    1,
                );
                setFocusPath([...focusPath.slice(0, depth), nextIndex]);
                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();
                const nextIndex = moveInteractiveIndex(
                    currentMenu,
                    currentIndex,
                    -1,
                );
                setFocusPath([...focusPath.slice(0, depth), nextIndex]);
                return;
            }

            if (event.key === "ArrowRight") {
                if (
                    currentNode &&
                    currentNode.kind === "submenu" &&
                    !currentNode.disabled
                ) {
                    event.preventDefault();
                    setFocusPath([
                        ...focusPath,
                        firstInteractiveIndex(currentNode.items),
                    ]);
                }
                return;
            }

            if (event.key === "ArrowLeft") {
                if (focusPath.length > 1) {
                    event.preventDefault();
                    setFocusPath(focusPath.slice(0, -1));
                }
                return;
            }

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                activateNode(focusPath);
            }
        },
        [activateNode, closeMenu, focusPath, isMenuVisible, rootNodes],
    );

    return {
        focusPath,
        setFocusPath,
        activateNode,
        handleMenuKeyDown,
    };
};
