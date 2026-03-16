import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type MutableRefObject } from "react";
import { MathUtils, Vector3 } from "three";
import {
    FIRST_PERSON_KEYBOARD_LOOK_SPEED,
    FIRST_PERSON_MAX_PITCH,
    FIRST_PERSON_MIN_PITCH,
    FIRST_PERSON_MOUSE_SENSITIVITY,
    FIRST_PERSON_MOVE_SPEED,
    FIRST_PERSON_START_POSITION,
    FIRST_PERSON_TOUCH_SENSITIVITY,
    FIRST_PERSON_WALK_BOUNDS,
} from "./firstPersonConfig";
import type {
    LookAxis,
    LookDelta,
    MovementKeys,
} from "./useDesktopFirstPersonControls";

type Axis2D = { x: number; y: number };

type FirstPersonCameraRigProps = {
    enabled: boolean;
    movementKeysRef: MutableRefObject<MovementKeys>;
    keyboardLookAxisRef: MutableRefObject<LookAxis>;
    desktopLookDeltaRef: MutableRefObject<LookDelta>;
    touchMovementAxisRef: MutableRefObject<Axis2D>;
    touchLookDeltaRef: MutableRefObject<LookDelta>;
};

export const FirstPersonCameraRig = ({
    enabled,
    movementKeysRef,
    keyboardLookAxisRef,
    desktopLookDeltaRef,
    touchMovementAxisRef,
    touchLookDeltaRef,
}: FirstPersonCameraRigProps) => {
    const { camera } = useThree();
    const yawRef = useRef(0);
    const pitchRef = useRef(0);
    const forwardVectorRef = useRef(new Vector3(0, 0, -1));
    const rightVectorRef = useRef(new Vector3(1, 0, 0));

    useEffect(() => {
        if (!enabled) {
            return;
        }

        camera.position.set(...FIRST_PERSON_START_POSITION);
        camera.rotation.order = "YXZ";
        yawRef.current = 0;
        pitchRef.current = 0;
    }, [camera, enabled]);

    useFrame((_, delta) => {
        if (!enabled) {
            return;
        }

        const clampedDelta = Math.min(delta, 1 / 20);

        const desktopLook = desktopLookDeltaRef.current;
        const touchLook = touchLookDeltaRef.current;
        const lookAxis = keyboardLookAxisRef.current;

        yawRef.current -=
            desktopLook.x * FIRST_PERSON_MOUSE_SENSITIVITY +
            touchLook.x * FIRST_PERSON_TOUCH_SENSITIVITY +
            lookAxis.x * FIRST_PERSON_KEYBOARD_LOOK_SPEED * clampedDelta;

        pitchRef.current -=
            desktopLook.y * FIRST_PERSON_MOUSE_SENSITIVITY +
            touchLook.y * FIRST_PERSON_TOUCH_SENSITIVITY +
            lookAxis.y * FIRST_PERSON_KEYBOARD_LOOK_SPEED * clampedDelta;

        desktopLook.x = 0;
        desktopLook.y = 0;
        touchLook.x = 0;
        touchLook.y = 0;

        pitchRef.current = MathUtils.clamp(
            pitchRef.current,
            FIRST_PERSON_MIN_PITCH,
            FIRST_PERSON_MAX_PITCH,
        );

        const movementKeys = movementKeysRef.current;
        const touchAxis = touchMovementAxisRef.current;

        const forwardInput =
            Number(movementKeys.forward) -
            Number(movementKeys.backward) +
            touchAxis.y;

        const strafeInput =
            Number(movementKeys.right) -
            Number(movementKeys.left) +
            touchAxis.x;

        const inputMagnitude = Math.hypot(forwardInput, strafeInput);
        const movementScale = inputMagnitude > 1 ? 1 / inputMagnitude : 1;

        forwardVectorRef.current
            .set(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current))
            .normalize();

        rightVectorRef.current
            .set(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current))
            .normalize();

        const step = FIRST_PERSON_MOVE_SPEED * clampedDelta;
        camera.position.addScaledVector(
            forwardVectorRef.current,
            forwardInput * movementScale * step,
        );
        camera.position.addScaledVector(
            rightVectorRef.current,
            strafeInput * movementScale * step,
        );

        camera.position.x = MathUtils.clamp(
            camera.position.x,
            FIRST_PERSON_WALK_BOUNDS.minX,
            FIRST_PERSON_WALK_BOUNDS.maxX,
        );
        camera.position.z = MathUtils.clamp(
            camera.position.z,
            FIRST_PERSON_WALK_BOUNDS.minZ,
            FIRST_PERSON_WALK_BOUNDS.maxZ,
        );
        camera.position.y = FIRST_PERSON_START_POSITION[1];

        camera.rotation.order = "YXZ";
        camera.rotation.set(pitchRef.current, yawRef.current, 0);
    });

    return null;
};
