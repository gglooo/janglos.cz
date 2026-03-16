import { useCallback } from "react";
import type { ViewportRect } from "./selectionTypes";

const isIntersecting = (a: ViewportRect, b: ViewportRect) => {
    return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
    );
};

const toViewportRect = (rect: DOMRect): ViewportRect => ({
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
});

export const useDesktopSelectionHitTest = () => {
    const getIntersectingItemIds = useCallback(
        (container: HTMLElement, viewportRect: ViewportRect): string[] => {
            const iconNodes = container.querySelectorAll<HTMLElement>(
                "[data-desktop-item-id]",
            );

            const selected = new Set<string>();
            iconNodes.forEach((node) => {
                const itemId = node.dataset.desktopItemId;
                if (!itemId) {
                    return;
                }

                if (isIntersecting(toViewportRect(node.getBoundingClientRect()), viewportRect)) {
                    selected.add(itemId);
                }
            });

            return [...selected];
        },
        [],
    );

    return {
        getIntersectingItemIds,
    };
};
