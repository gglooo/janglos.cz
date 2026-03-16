// @vitest-environment jsdom

import { act, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BlackLodgeWindow } from "../src/components/black-lodge/BlackLodgeWindow";

vi.mock("@react-three/fiber", () => ({
    Canvas: (_props: { children: ReactNode }) => (
        <div data-testid="mock-canvas" />
    ),
    useFrame: vi.fn(),
    useThree: () => ({
        camera: {
            position: {
                set: vi.fn(),
                addScaledVector: vi.fn(),
                x: 0,
                y: 0,
                z: 0,
            },
            rotation: { order: "XYZ", set: vi.fn() },
        },
    }),
}));

vi.mock("@react-three/drei", () => ({
    OrbitControls: () => <div data-testid="mock-orbit-controls" />,
    useGLTF: Object.assign(
        () => ({
            scene: {
                clone: () => ({}),
            },
        }),
        {
            preload: vi.fn(),
        },
    ),
}));

describe("BlackLodgeWindow", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("progresses from intro to dance scene", () => {
        vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();

        render(<BlackLodgeWindow />);

        expect(
            screen.queryByTestId("black-lodge-character-log-lady"),
        ).toBeNull();

        act(() => {
            vi.advanceTimersByTime(4500);
        });
        expect(
            screen.getByTestId("black-lodge-character-log-lady"),
        ).toBeTruthy();
        expect(screen.getByTestId("black-lodge-character-bob")).toBeTruthy();
    });

    it("shows soundtrack button when autoplay is blocked", async () => {
        vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(
            new Error("autoplay blocked"),
        );

        render(<BlackLodgeWindow />);
        await vi.runAllTimersAsync();

        expect(
            screen.getByRole("button", { name: "Start soundtrack" }),
        ).toBeTruthy();
    });

    it("renders touch joysticks when touch input is available", () => {
        vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
        vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
            ((contextId: string) => {
                if (contextId === "webgl" || contextId === "webgl2") {
                    return {} as RenderingContext;
                }
                return null;
            }) as HTMLCanvasElement["getContext"],
        );

        const originalMatchMedia = window.matchMedia;
        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: query === "(pointer: coarse)",
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
        }));

        render(<BlackLodgeWindow />);
        act(() => {
            vi.advanceTimersByTime(10000);
        });

        expect(screen.getByTestId("black-lodge-touch-controls")).toBeTruthy();
        expect(screen.getByTestId("black-lodge-touch-joystick")).toBeTruthy();
        expect(screen.getByTestId("black-lodge-touch-lookpad")).toBeTruthy();

        window.matchMedia = originalMatchMedia;
    });
});
