interface StartButtonProps {
    label?: string;
    name?: string;
    icon?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    hasSubmenu?: boolean;
    isFocused?: boolean;
    disabled?: boolean;
    className?: string;
}

export const StartButton = ({
    label,
    name,
    icon,
    onClick,
    onMouseEnter,
    hasSubmenu = false,
    isFocused = false,
    disabled = false,
    className = "",
}: StartButtonProps) => {
    const resolvedLabel = label ?? name ?? "";

    return (
        <button
            type="button"
            role="menuitem"
            aria-label={resolvedLabel}
            aria-haspopup={hasSubmenu ? "menu" : undefined}
            aria-disabled={disabled}
            onClick={disabled ? undefined : onClick}
            onMouseEnter={onMouseEnter}
            disabled={disabled}
            className={
                `${isFocused ? "bg-blue text-white" : "bg-window text-black"} ` +
                "w-full min-h-9 px-2 py-1 text-left font-main text-lg " +
                "flex items-center gap-2 select-none disabled:opacity-50 " +
                "disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-1 " +
                "focus-visible:outline-black " +
                className
            }
        >
            <span className="w-6 h-6 flex items-center justify-center shrink-0">
                {icon ? <img src={icon} alt="" className="w-5 h-5" /> : null}
            </span>
            <span className="first-letter:underline flex-1 truncate">
                {resolvedLabel}
            </span>
            {hasSubmenu ? <span aria-hidden="true">&gt;</span> : null}
        </button>
    );
};

export default StartButton;
