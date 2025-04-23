import React, { createContext, ReactNode, useContext, useState } from "react";

interface StartMenuContextType {
    isStartMenuVisible: boolean;
    setIsStartMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
    selectedStart: string;
    setSelectedStart: React.Dispatch<React.SetStateAction<string>>;
}

const StartMenuContext = createContext<StartMenuContextType | undefined>(
    undefined
);

export const StartMenuProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isStartMenuVisible, setIsStartMenuVisible] = useState(false);
    const [selectedStart, setSelectedStart] = useState("");

    return (
        <StartMenuContext.Provider
            value={{
                isStartMenuVisible,
                setIsStartMenuVisible,
                selectedStart,
                setSelectedStart,
            }}
        >
            {children}
        </StartMenuContext.Provider>
    );
};

export const useStartMenuContext = () => {
    const context = useContext(StartMenuContext);
    if (context === undefined) {
        throw new Error(
            "useStartMenuContext must be used within a StartMenuProvider"
        );
    }
    return context;
};
