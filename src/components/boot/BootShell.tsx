import { bootSequence } from "../../hooks/boot/bootConfig";
import { useBootSequence } from "../../hooks/boot/useBootSequence";
import BootScreen from "../BootScreen";
import Desktop from "../Desktop";
import { ShellDialogHost } from "../shell/ShellDialogHost";
import { StartBar } from "../StartBar";

export const BootShell = () => {
    const { phase, visibleLineCount } = useBootSequence();

    if (phase === "off") {
        return <div className="h-screen w-screen bg-black" />;
    }

    if (phase === "booting") {
        return (
            <div className="h-screen w-screen">
                <BootScreen
                    lines={bootSequence}
                    visibleLineCount={visibleLineCount}
                />
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col">
            {phase === "desktop-loading" ? (
                <div className="h-full w-full bg-desktop" />
            ) : (
                <>
                    <Desktop />
                    <StartBar />
                    <ShellDialogHost />
                </>
            )}
        </div>
    );
};

export default BootShell;
