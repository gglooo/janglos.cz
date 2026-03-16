interface StackBadgeProps {
    label: string;
    variant?: "raised" | "pressed";
    className?: string;
}

const baseClassName =
    "inline-flex items-center rounded-[1px] px-3 py-2 text-[11px] font-semibold leading-none tracking-[0.02em] text-[#202020] select-none";

const raisedClassName =
    "bg-[#ececec] border-2 border-l-white border-t-white border-r-[#6f6f6f] border-b-[#6f6f6f] shadow-[inset_1px_1px_0_#f8f8f8]";

const pressedClassName =
    "bg-[#dcdcdc] border border-l-[#6f6f6f] border-t-[#6f6f6f] border-r-white border-b-white shadow-[inset_1px_1px_0_#bdbdbd]";

export const StackBadge = ({
    label,
    variant = "raised",
    className = "",
}: StackBadgeProps) => {
    const variantClassName =
        variant === "pressed" ? pressedClassName : raisedClassName;

    return (
        <span
            className={`${baseClassName} ${variantClassName} ${className}`.trim()}
        >
            {label}
        </span>
    );
};
