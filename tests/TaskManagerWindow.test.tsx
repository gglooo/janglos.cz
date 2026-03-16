// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TaskManagerWindow } from "../src/components/TaskManagerWindow";
import type { WindowData } from "../src/store/slices/windowSlice";

interface MockAppState {
    openWindows: WindowData[];
    closeWindow: ReturnType<typeof vi.fn>;
}

let mockState: MockAppState;

vi.mock("../src/store/appStore", () => ({
    useAppStore: (selector: (state: MockAppState) => unknown) =>
        selector(mockState),
}));

describe("TaskManagerWindow", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        mockState = {
            openWindows: [
                {
                    id: 1,
                    title: "Task Manager",
                    state: "normal",
                    bounds: { x: 0, y: 0, width: 300, height: 200 },
                },
                {
                    id: 2,
                    title: "About\u00A0me",
                    state: "normal",
                    bounds: { x: 20, y: 20, width: 300, height: 200 },
                },
                {
                    id: 3,
                    title: "Projects",
                    state: "minimized",
                    bounds: { x: 40, y: 40, width: 300, height: 200 },
                },
            ],
            closeWindow: vi.fn(),
        };
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    it("lists open apps and excludes Task Manager itself", () => {
        render(<TaskManagerWindow />);

        expect(screen.queryByText("Task Manager")).toBeNull();
        const appList = screen.getByRole("listbox", { name: "Open applications" });
        expect(
            within(appList).getByRole("option", { name: /About.*Normal/i }),
        ).toBeTruthy();
        expect(
            within(appList).getByRole("option", { name: /Projects.*Minimized/i }),
        ).toBeTruthy();
    });

    it("ends selected task via closeWindow", () => {
        render(<TaskManagerWindow />);

        fireEvent.click(screen.getByRole("option", { name: /Projects.*Minimized/i }));
        fireEvent.click(screen.getByRole("button", { name: "End Task" }));

        expect(mockState.closeWindow).toHaveBeenCalledTimes(1);
        expect(mockState.closeWindow).toHaveBeenCalledWith(3);
    });

    it("shows empty state and disables End Task when no other apps are running", () => {
        mockState.openWindows = [
            {
                id: 1,
                title: "Task Manager",
                state: "normal",
                bounds: { x: 0, y: 0, width: 300, height: 200 },
            },
        ];

        render(<TaskManagerWindow />);

        expect(screen.getByTestId("task-manager-empty-state")).toBeTruthy();
        expect(
            screen.getByRole("button", { name: "End Task" }).hasAttribute(
                "disabled",
            ),
        ).toBe(true);
    });

    it("updates fake CPU and memory usage over time", () => {
        render(<TaskManagerWindow />);

        const cpuBefore = screen.getByTestId("task-manager-cpu-value").textContent;
        const memoryBefore = screen.getByTestId(
            "task-manager-memory-value",
        ).textContent;

        act(() => {
            vi.advanceTimersByTime(2400);
        });

        const cpuAfter = screen.getByTestId("task-manager-cpu-value").textContent;
        const memoryAfter = screen.getByTestId(
            "task-manager-memory-value",
        ).textContent;

        expect(cpuAfter).not.toBe(cpuBefore);
        expect(memoryAfter).not.toBe(memoryBefore);
    });
});
