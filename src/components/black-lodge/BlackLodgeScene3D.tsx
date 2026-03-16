/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { DoubleSide, Group, MeshStandardMaterial, Texture } from "three";
import {
    BLACK_LODGE_CHARACTERS,
    type CharacterId,
} from "../../config/blackLodgeCharacters";
import {
    createCheckerFloorTexture,
    createCurtainTexture,
} from "./blackLodgeTextures";
import { BlackLodgeTouchControls } from "./first-person/BlackLodgeTouchControls";
import { FirstPersonCameraRig } from "./first-person/FirstPersonCameraRig";
import { useDesktopFirstPersonControls } from "./first-person/useDesktopFirstPersonControls";
import { useTouchFirstPersonControls } from "./first-person/useTouchFirstPersonControls";
import { BlackLodgeMirror } from "./mirror/BlackLodgeMirror";
import { Bob } from "./mirror/Bob";

type BlackLodgeScene3DProps = {
    showCharacters: boolean;
};

const ACTIVE_CHARACTERS = BLACK_LODGE_CHARACTERS.filter(
    (character) => character.enabled,
);
const MAIN_SCENE_CHARACTERS = ACTIVE_CHARACTERS.filter(
    (character) => character.id !== "bob",
);
const BOB_MODEL_PATH =
    ACTIVE_CHARACTERS.find((character) => character.id === "bob")?.modelPath ??
    "";

const CHARACTER_POSES: Record<
    CharacterId,
    { position: [number, number, number]; rotationY?: number; scale?: number }
> = {
    "log-lady": { position: [0.1, 0.04, 0.6], rotationY: 0, scale: 1.15 },
    bob: { position: [-2.6, 0.02, 1.4], rotationY: 0.25, scale: 1.12 },
};

const isWebGLSupported = () => {
    const canvas = document.createElement("canvas");
    return Boolean(
        canvas.getContext("webgl2", { alpha: true }) ||
        canvas.getContext("webgl", { alpha: true }),
    );
};

const CharacterModel = ({
    modelPath,
    position,
    rotationY,
    scale,
}: {
    modelPath: string;
    position: [number, number, number];
    rotationY?: number;
    scale?: number;
}) => {
    const gltf = useGLTF(modelPath);
    const clonedScene = useMemo(
        () => gltf.scene.clone(true) as Group,
        [gltf.scene],
    );

    return (
        <primitive
            object={clonedScene}
            scale={scale ?? 1.2}
            position={position}
            rotation={[0, rotationY ?? 0, 0]}
        />
    );
};

const BlackLodgeRoom = ({
    curtainTexture,
    floorTexture,
}: {
    curtainTexture: Texture | null;
    floorTexture: Texture | null;
}) => {
    const curtainMaterial = useMemo(() => {
        return new MeshStandardMaterial({
            color: "#c63a5a",
            map: curtainTexture ?? undefined,
            roughness: 0.88,
            metalness: 0,
            emissive: "#2a0711",
            emissiveIntensity: 0.28,
            side: DoubleSide,
        });
    }, [curtainTexture]);

    const floorMaterial = useMemo(() => {
        return new MeshStandardMaterial({
            color: "#f2f2f2",
            map: floorTexture ?? undefined,
            roughness: 0.86,
            metalness: 0.04,
        });
    }, [floorTexture]);

    useEffect(() => {
        return () => {
            curtainMaterial.dispose();
            floorMaterial.dispose();
        };
    }, [curtainMaterial, floorMaterial]);

    return (
        <group>
            <mesh
                receiveShadow
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.02, 0]}
            >
                <planeGeometry args={[26, 22]} />
                <primitive object={floorMaterial} attach="material" />
            </mesh>

            <mesh position={[0, 4.4, -8.5]}>
                <planeGeometry args={[26, 9]} />
                <primitive object={curtainMaterial} attach="material" />
            </mesh>

            <mesh rotation={[0, Math.PI / 2, 0]} position={[-12.9, 4.4, 0]}>
                <planeGeometry args={[18, 9]} />
                <primitive object={curtainMaterial} attach="material" />
            </mesh>

            <mesh rotation={[0, -Math.PI / 2, 0]} position={[12.9, 4.4, 0]}>
                <planeGeometry args={[18, 9]} />
                <primitive object={curtainMaterial} attach="material" />
            </mesh>
        </group>
    );
};

const BlackLodgeFallback = ({
    showCharacters,
}: {
    showCharacters: boolean;
}) => (
    <div data-testid="black-lodge-fallback" className="absolute inset-0">
        <div className="black-lodge-curtain-layer" />
        <div className="black-lodge-checker-floor" />
        {showCharacters ? (
            <div className="sr-only" aria-live="polite">
                {ACTIVE_CHARACTERS.map((character) => (
                    <span
                        key={character.id}
                        data-testid={`black-lodge-character-${character.id}`}
                    >
                        {character.name}
                    </span>
                ))}
            </div>
        ) : null}
    </div>
);

export const BlackLodgeScene3D = ({
    showCharacters,
}: BlackLodgeScene3DProps) => {
    const [webglAvailable, setWebglAvailable] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const curtainTexture = useMemo(() => createCurtainTexture(), []);
    const floorTexture = useMemo(() => createCheckerFloorTexture(), []);
    const { movementKeysRef, lookAxisRef, lookDeltaRef, isPointerLocked } =
        useDesktopFirstPersonControls({
            containerRef,
            enabled: true,
        });
    const {
        isTouchDevice,
        movementAxisRef,
        lookDeltaRef: touchLookDeltaRef,
        joystickOffset,
        moveHandlers,
        lookHandlers,
    } = useTouchFirstPersonControls({
        enabled: true,
    });

    useEffect(() => {
        setWebglAvailable(isWebGLSupported());
    }, []);

    useEffect(() => {
        return () => {
            curtainTexture?.dispose();
            floorTexture?.dispose();
        };
    }, [curtainTexture, floorTexture]);

    if (!webglAvailable) {
        return <BlackLodgeFallback showCharacters={showCharacters} />;
    }

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 ${
                isPointerLocked ? "cursor-none" : "cursor-grab"
            }`}
            data-testid="black-lodge-3d-scene"
        >
            <Canvas
                shadows
                camera={{ position: [0, 3.8, 9], fov: 43 }}
                gl={{ alpha: true, antialias: true }}
            >
                <color attach="background" args={["#030303"]} />
                <fog attach="fog" args={["#050505", 10, 40]} />
                <ambientLight intensity={0.58} />
                <directionalLight
                    position={[2.5, 9, 3]}
                    intensity={1.2}
                    castShadow
                />
                <directionalLight position={[-5, 5, -6]} intensity={0.55} />
                <pointLight
                    position={[0, 0.85, 0]}
                    intensity={1.15}
                    distance={10}
                    decay={1.6}
                    color="#f8f1d4"
                />
                <BlackLodgeRoom
                    curtainTexture={curtainTexture}
                    floorTexture={floorTexture}
                />
                <Suspense fallback={null}>
                    {showCharacters
                        ? MAIN_SCENE_CHARACTERS.map((character) => {
                              const pose = CHARACTER_POSES[character.id];
                              return (
                                  <CharacterModel
                                      key={character.id}
                                      modelPath={character.modelPath}
                                      position={pose.position}
                                      rotationY={pose.rotationY}
                                      scale={pose.scale}
                                  />
                              );
                          })
                        : null}
                    {showCharacters && BOB_MODEL_PATH ? (
                        <Bob modelPath={BOB_MODEL_PATH} />
                    ) : null}
                </Suspense>
                <BlackLodgeMirror enabled={showCharacters} />
                <FirstPersonCameraRig
                    enabled={showCharacters}
                    movementKeysRef={movementKeysRef}
                    keyboardLookAxisRef={lookAxisRef}
                    desktopLookDeltaRef={lookDeltaRef}
                    touchMovementAxisRef={movementAxisRef}
                    touchLookDeltaRef={touchLookDeltaRef}
                />
            </Canvas>
            {showCharacters && isTouchDevice ? (
                <BlackLodgeTouchControls
                    joystickOffset={joystickOffset}
                    moveHandlers={moveHandlers}
                    lookHandlers={lookHandlers}
                />
            ) : null}
            {showCharacters ? (
                <div className="sr-only" aria-live="polite">
                    <span data-testid="black-lodge-left-mirror-active">
                        Left mirror enabled
                    </span>
                    {ACTIVE_CHARACTERS.map((character) => (
                        <span
                            key={character.id}
                            data-testid={`black-lodge-character-${character.id}`}
                        >
                            {character.name}
                        </span>
                    ))}
                </div>
            ) : null}
        </div>
    );
};
