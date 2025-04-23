import { PropsWithChildren } from "react";
import { StartMenuProvider } from "./StartMenuContext";
import { TrashProvider } from "./TrashContext";
import { WindowProvider } from "./WindowContext";

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <WindowProvider>
            <TrashProvider>
                <StartMenuProvider>{children}</StartMenuProvider>
            </TrashProvider>
        </WindowProvider>
    );
};
