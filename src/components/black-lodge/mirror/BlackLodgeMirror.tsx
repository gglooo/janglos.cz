/* eslint-disable react/no-unknown-property */
import { MeshReflectorMaterial } from "@react-three/drei";
import {
    BLACK_LODGE_MIRROR_POSITION,
    BLACK_LODGE_MIRROR_SIZE,
} from "./mirrorConfig";

export const BlackLodgeMirror = ({ enabled }: { enabled: boolean }) => {
    if (!enabled) return null;

    return (
        <mesh
            position={BLACK_LODGE_MIRROR_POSITION}
            rotation={[0, Math.PI * 0.5, 0]}
            data-testid="black-lodge-left-mirror"
        >
            <planeGeometry args={BLACK_LODGE_MIRROR_SIZE} />
            <MeshReflectorMaterial
                blur={[0, 0]}
                resolution={1024}
                mirror={1}
                color="#d6d2df"
                roughness={0.32}
                metalness={0.15}
            />
        </mesh>
    );
};
