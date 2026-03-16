import type { SelectionRect } from "../../../hooks/desktop-selection/selectionTypes";

interface DesktopSelectionMarqueeProps {
    rect: SelectionRect | null;
}

export const DesktopSelectionMarquee = ({
    rect,
}: DesktopSelectionMarqueeProps) => {
    if (!rect || rect.width === 0 || rect.height === 0) {
        return null;
    }

    return (
        <div
            className="pointer-events-none absolute border border-dashed border-[#0A246A] bg-[#0A246A]/20 z-20"
            style={{
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
            }}
        />
    );
};
