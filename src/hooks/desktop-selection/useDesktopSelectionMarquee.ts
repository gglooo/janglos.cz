import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type PointerEvent,
    type RefObject,
} from "react";
import type { SelectionRect, ViewportRect } from "./selectionTypes";

interface MarqueeState {
    active: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
}

interface UseDesktopSelectionMarqueeInput {
    desktopRef: RefObject<HTMLDivElement | null>;
    resolveSelection: (rect: ViewportRect) => string[];
    onSelectionChange: (itemIds: string[]) => void;
}

const toViewportRect = (state: MarqueeState): ViewportRect => {
    const left = Math.min(state.startX, state.currentX);
    const right = Math.max(state.startX, state.currentX);
    const top = Math.min(state.startY, state.currentY);
    const bottom = Math.max(state.startY, state.currentY);

    return { left, top, right, bottom };
};

const toSelectionRect = (
    viewportRect: ViewportRect,
    containerRect: DOMRect,
): SelectionRect => ({
    left: viewportRect.left - containerRect.left,
    top: viewportRect.top - containerRect.top,
    width: viewportRect.right - viewportRect.left,
    height: viewportRect.bottom - viewportRect.top,
});

const isSelectionStartAllowed = (target: HTMLElement) => {
    if (target.closest("[data-desktop-icon-root='true']")) {
        return false;
    }

    if (target.closest(".desktop-window-shell")) {
        return false;
    }

    return true;
};

export const useDesktopSelectionMarquee = ({
    desktopRef,
    resolveSelection,
    onSelectionChange,
}: UseDesktopSelectionMarqueeInput) => {
    const [state, setState] = useState<MarqueeState | null>(null);

    const onPointerDown = useCallback(
        (event: PointerEvent<HTMLDivElement>) => {
            if (event.button !== 0) {
                return;
            }

            const target = event.target as HTMLElement;
            if (!isSelectionStartAllowed(target)) {
                return;
            }

            setState({
                active: true,
                startX: event.clientX,
                startY: event.clientY,
                currentX: event.clientX,
                currentY: event.clientY,
            });
        },
        [],
    );

    const onPointerMove = useCallback(
        (event: PointerEvent<HTMLDivElement>) => {
            if (!state?.active) {
                return;
            }

            const nextState: MarqueeState = {
                ...state,
                currentX: event.clientX,
                currentY: event.clientY,
            };
            setState(nextState);

            const selection = resolveSelection(toViewportRect(nextState));
            onSelectionChange(selection);
        },
        [onSelectionChange, resolveSelection, state],
    );

    useEffect(() => {
        if (!state?.active) {
            return;
        }

        const handlePointerUp = () => {
            const selection = resolveSelection(toViewportRect(state));
            onSelectionChange(selection);
            setState(null);
        };

        window.addEventListener("pointerup", handlePointerUp);
        return () => {
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [onSelectionChange, resolveSelection, state]);

    const selectionRect = useMemo(() => {
        if (!state?.active || !desktopRef.current) {
            return null;
        }

        const viewportRect = toViewportRect(state);
        return toSelectionRect(viewportRect, desktopRef.current.getBoundingClientRect());
    }, [desktopRef, state]);

    return {
        marqueeActive: state?.active ?? false,
        onPointerDown,
        onPointerMove,
        selectionRect,
    };
};
