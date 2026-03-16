/* eslint-disable react/no-unknown-property */
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import type { BlackLodgeCharacter } from "../../config/blackLodgeCharacters";

const CharacterModel = ({ modelPath }: { modelPath: string }) => {
    const gltf = useGLTF(modelPath);
    const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

    return (
        <primitive object={clonedScene} scale={1.2} position={[0, -1.1, 0]} />
    );
};

export const CharacterViewer = ({
    character,
}: {
    character: BlackLodgeCharacter;
}) => (
    <div aria-label={character.name} className={character.containerClassName}>
        <Canvas
            camera={character.cameraProps}
            gl={{ alpha: true, antialias: true }}
        >
            <ambientLight intensity={0.9} />
            <directionalLight position={[3, 5, 3]} intensity={1.1} />
            <directionalLight position={[-2, 3, -3]} intensity={0.45} />
            <Suspense fallback={null}>
                <CharacterModel modelPath={character.modelPath} />
            </Suspense>
            <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate={false}
            />
        </Canvas>
    </div>
);
