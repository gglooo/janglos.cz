interface StartItemProps {
    title: string;
    isActive: boolean;
    isMinimized: boolean;
    onToggle: () => void;
}

export const StartItem = ({
    title,
    isActive,
    isMinimized,
    onToggle,
}: StartItemProps) => {
    return (
        <button
            type="button"
            aria-label={`${isMinimized ? "Restore" : "Toggle"} ${title} window`}
            className={
                "font-main border px-2 text-left min-w-30 " +
                (isActive
                    ? "bg-grey text-black border-t-black border-l-black border-r-white border-b-white bg-[conic-gradient(#e5e7eb_90deg,transparent_90deg_180deg,#e5e7eb_180deg_270deg,transparent_270deg)] bg-[length:2px_2px]"
                    : "bg-window text-black hover:bg-grey border-t-white border-l-white border-r-black border-b-black")
            }
            onClick={onToggle}
        >
            <h1>{title}</h1>
        </button>
    );
};

export default StartItem;
