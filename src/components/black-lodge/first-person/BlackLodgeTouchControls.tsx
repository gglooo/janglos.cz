import type { HTMLAttributes } from "react";

type Point = { x: number; y: number };

type BlackLodgeTouchControlsProps = {
    joystickOffset: Point;
    moveHandlers: HTMLAttributes<HTMLDivElement>;
    lookHandlers: HTMLAttributes<HTMLDivElement>;
};

export const BlackLodgeTouchControls = ({
    joystickOffset,
    moveHandlers,
    lookHandlers,
}: BlackLodgeTouchControlsProps) => (
    <div
        className="pointer-events-none absolute inset-0 z-30"
        data-testid="black-lodge-touch-controls"
    >
        <div className="absolute bottom-5 left-5 pointer-events-auto h-36 w-36 rounded-full border border-white/45 bg-black/35 backdrop-blur-[1px] touch-none">
            <div
                className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/18"
                style={{
                    transform: `translate(calc(-50% + ${joystickOffset.x}px), calc(-50% + ${joystickOffset.y}px))`,
                }}
            />
            <div
                className="absolute inset-0"
                data-testid="black-lodge-touch-joystick"
                {...moveHandlers}
            />
        </div>

        <div
            className="absolute bottom-5 right-5 pointer-events-auto h-36 w-36 rounded-full border border-white/45 bg-black/20 touch-none"
            data-testid="black-lodge-touch-lookpad"
            {...lookHandlers}
        />
    </div>
);
