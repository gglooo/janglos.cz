import React, { createContext, ReactNode, useContext, useState } from "react";
import { ContentType } from "../types/ContentType";

export type WindowMetadata = {
    id: number;
    title: ContentType;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
    isMinimized: boolean;
    isMaximized: boolean;
};

type WindowContextType = {
    windows: WindowMetadata[];
    setWindows: React.Dispatch<React.SetStateAction<WindowMetadata[]>>;
    updateWindowZIndex: (windowId: number) => void;
    closeWindow: (windowId: number) => void;
    minimizeWindow: (windowId: number) => void;
    maximizeWindow: (windowId: number) => void;
    updateWindowPosition: (
        windowId: number,
        position: { x: number; y: number }
    ) => void;
    updateWindowSize: (
        windowId: number,
        size: { width: number; height: number }
    ) => void;
};

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [windows, setWindows] = useState<WindowMetadata[]>([]);
    const [highestZIndex, setHighestZIndex] = useState(10);

    const updateWindowZIndex = (windowId: number) => {
        setHighestZIndex((prev) => prev + 10);
        setWindows((prevWindows) =>
            prevWindows.map((window) =>
                window.id === windowId
                    ? { ...window, zIndex: highestZIndex + 10 }
                    : window
            )
        );
    };

    const closeWindow = (windowId: number) => {
        setWindows((prevWindows) =>
            prevWindows.filter((window) => window.id !== windowId)
        );
    };

    const minimizeWindow = (windowId: number) => {
        setWindows((prevWindows) =>
            prevWindows.map((window) =>
                window.id === windowId
                    ? { ...window, isMinimized: !window.isMinimized }
                    : window
            )
        );
    };

    const maximizeWindow = (windowId: number) => {
        setWindows((prevWindows) =>
            prevWindows.map((window) =>
                window.id === windowId
                    ? { ...window, isMaximized: !window.isMaximized }
                    : window
            )
        );
    };

    const updateWindowPosition = (
        windowId: number,
        position: { x: number; y: number }
    ) => {
        setWindows((prevWindows) =>
            prevWindows.map((window) =>
                window.id === windowId ? { ...window, position } : window
            )
        );
    };

    const updateWindowSize = (
        windowId: number,
        size: { width: number; height: number }
    ) => {
        setWindows((prevWindows) =>
            prevWindows.map((window) =>
                window.id === windowId ? { ...window, size } : window
            )
        );
    };

    return (
        <WindowContext.Provider
            value={{
                windows,
                setWindows,
                updateWindowZIndex,
                closeWindow,
                minimizeWindow,
                maximizeWindow,
                updateWindowPosition,
                updateWindowSize,
            }}
        >
            {children}
        </WindowContext.Provider>
    );
};

export const useWindowContext = () => {
    const context = useContext(WindowContext);
    if (context === undefined) {
        throw new Error(
            "useWindowContext must be used within a WindowProvider"
        );
    }
    return context;
};
