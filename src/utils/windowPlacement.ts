import type { ContentType } from "../types/ContentType";

export type WindowLaunchSource =
    | "desktop"
    | "start-menu"
    | "taskbar"
    | "tab-switch";

export interface WindowPlacementBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ViewportBounds {
    width: number;
    height: number;
}

export interface WindowSizeConstraints {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
}

interface ComputeWindowPlacementParams {
    title: ContentType;
    source: WindowLaunchSource;
    openWindows: { id: number; title: ContentType }[];
    boundsById: Record<number, WindowPlacementBounds>;
    lastKnownBoundsByTitle: Partial<Record<ContentType, WindowPlacementBounds>>;
    viewport: ViewportBounds;
    taskbarHeight?: number;
    requestedPosition?: { x: number; y: number };
}

export const DEFAULT_TASKBAR_HEIGHT = 32;
const TITLEBAR_VISIBLE_MARGIN = 28;
const CASCADE_OFFSET = 24;
const MOBILE_BREAKPOINT = 768;

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

export const getWindowSizeConstraints = (
    title: ContentType,
    viewportWidth: number,
): WindowSizeConstraints => {
    const isCompactViewport = viewportWidth < MOBILE_BREAKPOINT;

    if (title === "About\u00A0me") {
        return {
            width: isCompactViewport ? 700 : 800,
            height: isCompactViewport ? 560 : 700,
            minWidth: 700,
            minHeight: 80,
        };
    }

    if (title === "Projects") {
        return {
            width: isCompactViewport ? 920 : 1100,
            height: isCompactViewport ? 560 : 700,
            minWidth: 700,
            minHeight: 80,
        };
    }

    return {
        width: isCompactViewport ? 360 : 400,
        height: isCompactViewport ? 280 : 300,
        minWidth: 320,
        minHeight: 80,
    };
};

export const clampWindowBounds = (
    bounds: WindowPlacementBounds,
    viewport: ViewportBounds,
    taskbarHeight = DEFAULT_TASKBAR_HEIGHT,
): WindowPlacementBounds => {
    const maxWindowWidth = Math.max(240, viewport.width);
    const maxWindowHeight = Math.max(120, viewport.height - taskbarHeight);
    const width = clamp(Math.round(bounds.width), 240, maxWindowWidth);
    const height = clamp(Math.round(bounds.height), 120, maxWindowHeight);
    const maxX = Math.max(0, viewport.width - width);
    const maxY = Math.max(
        0,
        viewport.height - taskbarHeight - TITLEBAR_VISIBLE_MARGIN,
    );

    return {
        width,
        height,
        x: clamp(Math.round(bounds.x), 0, maxX),
        y: clamp(Math.round(bounds.y), 0, maxY),
    };
};

export const computeWindowPlacement = ({
    title,
    source,
    openWindows,
    boundsById,
    lastKnownBoundsByTitle,
    viewport,
    taskbarHeight = DEFAULT_TASKBAR_HEIGHT,
    requestedPosition,
}: ComputeWindowPlacementParams): WindowPlacementBounds => {
    const constraints = getWindowSizeConstraints(title, viewport.width);

    if (requestedPosition) {
        return clampWindowBounds(
            {
                x: requestedPosition.x,
                y: requestedPosition.y,
                width: constraints.width,
                height: constraints.height,
            },
            viewport,
            taskbarHeight,
        );
    }

    const isMobileViewport = viewport.width < MOBILE_BREAKPOINT;
    if (isMobileViewport) {
        return clampWindowBounds(
            {
                x: 0,
                y: 0,
                width: Math.min(constraints.width, viewport.width),
                height: Math.min(
                    constraints.height,
                    viewport.height - taskbarHeight - TITLEBAR_VISIBLE_MARGIN,
                ),
            },
            viewport,
            taskbarHeight,
        );
    }

    const lastKnownBounds = lastKnownBoundsByTitle[title];
    if (lastKnownBounds && source !== "taskbar") {
        return clampWindowBounds(lastKnownBounds, viewport, taskbarHeight);
    }

    const isFirstOpenOfType = !openWindows.some((windowData) => {
        return windowData.title === title;
    });

    if (isFirstOpenOfType) {
        return clampWindowBounds(
            {
                x: (viewport.width - constraints.width) / 2,
                y: (viewport.height - taskbarHeight - constraints.height) / 2,
                width: constraints.width,
                height: constraints.height,
            },
            viewport,
            taskbarHeight,
        );
    }

    const anchorWindow = openWindows[openWindows.length - 1];
    const anchorBounds = anchorWindow ? boundsById[anchorWindow.id] : undefined;

    return clampWindowBounds(
        {
            x: (anchorBounds?.x ?? 48) + CASCADE_OFFSET,
            y: (anchorBounds?.y ?? 48) + CASCADE_OFFSET,
            width: constraints.width,
            height: constraints.height,
        },
        viewport,
        taskbarHeight,
    );
};

export const getDefaultWindowBounds = (
    title: ContentType,
    viewport?: ViewportBounds,
    taskbarHeight = DEFAULT_TASKBAR_HEIGHT,
): WindowPlacementBounds => {
    const effectiveViewport =
        viewport ??
        (typeof window !== "undefined"
            ? { width: window.innerWidth, height: window.innerHeight }
            : { width: 1280, height: 720 });
    const constraints = getWindowSizeConstraints(title, effectiveViewport.width);

    return clampWindowBounds(
        {
            x: (effectiveViewport.width - constraints.width) / 2,
            y:
                (effectiveViewport.height - taskbarHeight - constraints.height) /
                2,
            width: constraints.width,
            height: constraints.height,
        },
        effectiveViewport,
        taskbarHeight,
    );
};
