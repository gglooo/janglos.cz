import { useEffect, useRef, useState, type RefObject } from "react";

export type MovementKeys = {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
};

export type LookAxis = {
    x: number;
    y: number;
};

export type LookDelta = {
    x: number;
    y: number;
};

type UseDesktopFirstPersonControlsOptions = {
    containerRef: RefObject<HTMLDivElement | null>;
    enabled: boolean;
};

const DEFAULT_MOVEMENT_KEYS: MovementKeys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
};

const DEFAULT_LOOK_KEYS = {
    left: false,
    right: false,
    up: false,
    down: false,
};

export const useDesktopFirstPersonControls = ({
    containerRef,
    enabled,
}: UseDesktopFirstPersonControlsOptions) => {
    const movementKeysRef = useRef<MovementKeys>({ ...DEFAULT_MOVEMENT_KEYS });
    const lookAxisRef = useRef<LookAxis>({ x: 0, y: 0 });
    const lookDeltaRef = useRef<LookDelta>({ x: 0, y: 0 });
    const lookKeysRef = useRef({ ...DEFAULT_LOOK_KEYS });
    const [isPointerLocked, setIsPointerLocked] = useState(false);

    useEffect(() => {
        if (enabled) {
            return;
        }

        movementKeysRef.current = { ...DEFAULT_MOVEMENT_KEYS };
        lookAxisRef.current = { x: 0, y: 0 };
        lookDeltaRef.current = { x: 0, y: 0 };
        lookKeysRef.current = { ...DEFAULT_LOOK_KEYS };
        setIsPointerLocked(false);
    }, [enabled]);

    useEffect(() => {
        const syncLookAxis = () => {
            const lookKeys = lookKeysRef.current;
            lookAxisRef.current.x =
                Number(lookKeys.right) - Number(lookKeys.left);
            lookAxisRef.current.y = Number(lookKeys.down) - Number(lookKeys.up);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (!enabled) {
                return;
            }

            switch (event.key) {
                case "w":
                case "W":
                    movementKeysRef.current.forward = true;
                    break;
                case "s":
                case "S":
                    movementKeysRef.current.backward = true;
                    break;
                case "a":
                case "A":
                    movementKeysRef.current.left = true;
                    break;
                case "d":
                case "D":
                    movementKeysRef.current.right = true;
                    break;
                case "ArrowLeft":
                    lookKeysRef.current.left = true;
                    syncLookAxis();
                    event.preventDefault();
                    break;
                case "ArrowRight":
                    lookKeysRef.current.right = true;
                    syncLookAxis();
                    event.preventDefault();
                    break;
                case "ArrowUp":
                    lookKeysRef.current.up = true;
                    syncLookAxis();
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    lookKeysRef.current.down = true;
                    syncLookAxis();
                    event.preventDefault();
                    break;
                default:
                    break;
            }
        };

        const onKeyUp = (event: KeyboardEvent) => {
            switch (event.key) {
                case "w":
                case "W":
                    movementKeysRef.current.forward = false;
                    break;
                case "s":
                case "S":
                    movementKeysRef.current.backward = false;
                    break;
                case "a":
                case "A":
                    movementKeysRef.current.left = false;
                    break;
                case "d":
                case "D":
                    movementKeysRef.current.right = false;
                    break;
                case "ArrowLeft":
                    lookKeysRef.current.left = false;
                    syncLookAxis();
                    break;
                case "ArrowRight":
                    lookKeysRef.current.right = false;
                    syncLookAxis();
                    break;
                case "ArrowUp":
                    lookKeysRef.current.up = false;
                    syncLookAxis();
                    break;
                case "ArrowDown":
                    lookKeysRef.current.down = false;
                    syncLookAxis();
                    break;
                default:
                    break;
            }
        };

        const reset = () => {
            movementKeysRef.current = { ...DEFAULT_MOVEMENT_KEYS };
            lookAxisRef.current = { x: 0, y: 0 };
            lookKeysRef.current = { ...DEFAULT_LOOK_KEYS };
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("blur", reset);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("blur", reset);
        };
    }, [enabled]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        let dragging = false;
        let previousX = 0;
        let previousY = 0;

        const consumeDelta = (deltaX: number, deltaY: number) => {
            lookDeltaRef.current.x += deltaX;
            lookDeltaRef.current.y += deltaY;
        };

        const onMouseDown = (event: MouseEvent) => {
            if (!enabled || event.button !== 0) {
                return;
            }

            dragging = true;
            previousX = event.clientX;
            previousY = event.clientY;

            if (typeof container.requestPointerLock === "function") {
                container.requestPointerLock();
            }
        };

        const onMouseMove = (event: MouseEvent) => {
            if (!enabled) {
                return;
            }

            if (document.pointerLockElement === container) {
                consumeDelta(event.movementX, event.movementY);
                return;
            }

            if (!dragging) {
                return;
            }

            consumeDelta(event.clientX - previousX, event.clientY - previousY);
            previousX = event.clientX;
            previousY = event.clientY;
        };

        const onMouseUp = () => {
            dragging = false;
        };

        const onPointerLockChange = () => {
            setIsPointerLocked(document.pointerLockElement === container);
        };

        container.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        document.addEventListener("pointerlockchange", onPointerLockChange);

        return () => {
            container.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener(
                "pointerlockchange",
                onPointerLockChange,
            );
        };
    }, [containerRef, enabled]);

    return {
        movementKeysRef,
        lookAxisRef,
        lookDeltaRef,
        isPointerLocked,
    };
};
