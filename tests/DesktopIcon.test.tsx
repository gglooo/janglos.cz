// @vitest-environment jsdom

import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DesktopIcon } from "../src/components/DesktopIcon";

const mockUseIsMobile = vi.fn();

vi.mock("../src/hooks/useIsMobile", () => ({
    useIsMobile: () => mockUseIsMobile(),
}));

vi.mock("react-dnd", () => ({
    useDrag: () => [{ isDragging: false }, vi.fn()],
}));

const getIconRoot = (container: HTMLElement) => {
    return container.querySelector(
        "div[data-desktop-icon-root='true']",
    ) as HTMLDivElement;
};

describe("DesktopIcon interactions", () => {
    beforeEach(() => {
        mockUseIsMobile.mockReset();
        mockUseIsMobile.mockReturnValue(false);
    });

    it("keeps desktop launch on double-click", () => {
        const onClick = vi.fn();
        const onDoubleClick = vi.fn();

        const { container } = render(
            <DesktopIcon
                icon="/icon.png"
                name="Projects"
                onClick={onClick}
                onDoubleClick={onDoubleClick}
            />,
        );

        const iconRoot = getIconRoot(container);
        fireEvent.click(iconRoot);
        fireEvent.doubleClick(iconRoot);

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onDoubleClick).toHaveBeenCalledTimes(1);
    });

    it("maps launch handler to single click on mobile", () => {
        mockUseIsMobile.mockReturnValue(true);
        const onClick = vi.fn();
        const onDoubleClick = vi.fn();

        const { container } = render(
            <DesktopIcon
                icon="/icon.png"
                name="Projects"
                onClick={onClick}
                onDoubleClick={onDoubleClick}
            />,
        );

        const iconRoot = getIconRoot(container);
        fireEvent.click(iconRoot);

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onDoubleClick).toHaveBeenCalledTimes(1);
    });
});
