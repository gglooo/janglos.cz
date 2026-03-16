import { useEffect, useRef, useState, type PointerEvent } from "react";
import { TOUCH_JOYSTICK_RADIUS } from "./firstPersonConfig";
import { useTouchDevice } from "./useTouchDevice";

type Point = { x: number; y: number };

type PointerHandler = (event: PointerEvent<HTMLDivElement>) => void;

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

const clampToRadius = (dx: number, dy: number, radius: number) => {
    const length = Math.hypot(dx, dy);
    if (length <= radius || length === 0) {
        return { x: dx, y: dy };
    }

    const factor = radius / length;
    return {
        x: dx * factor,
        y: dy * factor,
    };
};

export const useTouchFirstPersonControls = ({ enabled }: { enabled: boolean }) => {
    const isTouchDevice = useTouchDevice();
    const movementAxisRef = useRef({ x: 0, y: 0 });
    const lookDeltaRef = useRef({ x: 0, y: 0 });
    const moveOriginRef = useRef<Point | null>(null);
    const movePointerIdRef = useRef<number | null>(null);
    const lookPointerIdRef = useRef<number | null>(null);
    const lookLastPointRef = useRef<Point | null>(null);
    const [joystickOffset, setJoystickOffset] = useState<Point>({ x: 0, y: 0 });

    useEffect(() => {
        if (enabled) {
            return;
        }

        movementAxisRef.current = { x: 0, y: 0 };
        lookDeltaRef.current = { x: 0, y: 0 };
        moveOriginRef.current = null;
        movePointerIdRef.current = null;
        lookPointerIdRef.current = null;
        lookLastPointRef.current = null;
        setJoystickOffset({ x: 0, y: 0 });
    }, [enabled]);

    const onMovePointerDown: PointerHandler = (event) => {
        if (!enabled) {
            return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);
        movePointerIdRef.current = event.pointerId;
        moveOriginRef.current = { x: event.clientX, y: event.clientY };
    };

    const onMovePointerMove: PointerHandler = (event) => {
        if (!enabled || movePointerIdRef.current !== event.pointerId) {
            return;
        }

        const origin = moveOriginRef.current;
        if (!origin) {
            return;
        }

        const clamped = clampToRadius(
            event.clientX - origin.x,
            event.clientY - origin.y,
            TOUCH_JOYSTICK_RADIUS,
        );
        setJoystickOffset(clamped);

        movementAxisRef.current = {
            x: clamp(clamped.x / TOUCH_JOYSTICK_RADIUS, -1, 1),
            y: clamp(-clamped.y / TOUCH_JOYSTICK_RADIUS, -1, 1),
        };
    };

    const resetMove = () => {
        movePointerIdRef.current = null;
        moveOriginRef.current = null;
        movementAxisRef.current = { x: 0, y: 0 };
        setJoystickOffset({ x: 0, y: 0 });
    };

    const onMovePointerUp: PointerHandler = (event) => {
        if (movePointerIdRef.current !== event.pointerId) {
            return;
        }

        event.currentTarget.releasePointerCapture(event.pointerId);
        resetMove();
    };

    const onLookPointerDown: PointerHandler = (event) => {
        if (!enabled) {
            return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);
        lookPointerIdRef.current = event.pointerId;
        lookLastPointRef.current = { x: event.clientX, y: event.clientY };
    };

    const onLookPointerMove: PointerHandler = (event) => {
        if (!enabled || lookPointerIdRef.current !== event.pointerId) {
            return;
        }

        const lastPoint = lookLastPointRef.current;
        if (!lastPoint) {
            lookLastPointRef.current = { x: event.clientX, y: event.clientY };
            return;
        }

        lookDeltaRef.current.x += event.clientX - lastPoint.x;
        lookDeltaRef.current.y += event.clientY - lastPoint.y;
        lookLastPointRef.current = { x: event.clientX, y: event.clientY };
    };

    const resetLook = () => {
        lookPointerIdRef.current = null;
        lookLastPointRef.current = null;
    };

    const onLookPointerUp: PointerHandler = (event) => {
        if (lookPointerIdRef.current !== event.pointerId) {
            return;
        }

        event.currentTarget.releasePointerCapture(event.pointerId);
        resetLook();
    };

    const moveHandlers = {
        onPointerDown: onMovePointerDown,
        onPointerMove: onMovePointerMove,
        onPointerUp: onMovePointerUp,
        onPointerCancel: onMovePointerUp,
        onPointerLeave: onMovePointerUp,
    };

    const lookHandlers = {
        onPointerDown: onLookPointerDown,
        onPointerMove: onLookPointerMove,
        onPointerUp: onLookPointerUp,
        onPointerCancel: onLookPointerUp,
        onPointerLeave: onLookPointerUp,
    };

    return {
        isTouchDevice,
        movementAxisRef,
        lookDeltaRef,
        joystickOffset,
        moveHandlers,
        lookHandlers,
    };
};
