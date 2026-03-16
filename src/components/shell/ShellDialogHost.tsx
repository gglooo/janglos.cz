import { useAppStore } from "../../store/appStore";

export const ShellDialogHost = () => {
    const dialog = useAppStore((s) => s.shellDialog);
    const hideShellDialog = useAppStore((s) => s.hideShellDialog);

    if (!dialog) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/20"
            style={{ zIndex: 2147483647 }}
            onMouseDown={hideShellDialog}
            role="presentation"
        >
            <div
                className="w-[min(420px,calc(100vw-2rem))] border-2 border-t-white border-l-white border-r-black border-b-black bg-window p-3 font-main text-black"
                role="alertdialog"
                aria-labelledby="shell-dialog-title"
                aria-describedby="shell-dialog-message"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <h2 id="shell-dialog-title" className="mb-3 bg-blue px-2 py-1 text-xl text-white">
                    {dialog.title}
                </h2>
                <p id="shell-dialog-message" className="text-lg">
                    {dialog.message}
                </p>
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={hideShellDialog}
                        className="min-w-20 border-2 border-t-white border-l-white border-r-black border-b-black bg-window px-3 py-1 hover:bg-grey"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShellDialogHost;
