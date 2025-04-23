import React, { createContext, ReactNode, useContext, useState } from "react";

interface TrashContextType {
    trashContent: JSX.Element[];
    setTrashContent: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
}

const TrashContext = createContext<TrashContextType | undefined>(undefined);

export const TrashProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [trashContent, setTrashContent] = useState<JSX.Element[]>([]);

    return (
        <TrashContext.Provider
            value={{
                trashContent,
                setTrashContent,
            }}
        >
            {children}
        </TrashContext.Provider>
    );
};

export const useTrashContext = () => {
    const context = useContext(TrashContext);
    if (context === undefined) {
        throw new Error("useTrashContext must be used within a TrashProvider");
    }
    return context;
};
