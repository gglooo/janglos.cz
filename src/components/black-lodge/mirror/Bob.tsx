/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Material, Mesh, Vector3, type Group } from "three";

export const Bob = ({ modelPath }: { modelPath: string }) => {
    const gltf = useGLTF(modelPath);
    const { camera: mainCamera } = useThree();

    const clonedScene = useMemo(
        () => gltf.scene.clone(true) as Group,
        [gltf.scene],
    );

    useEffect(() => {
        clonedScene.traverse((node) => {
            if ((node as Mesh).isMesh) {
                const mesh = node as Mesh;

                if (Array.isArray(mesh.material)) {
                    mesh.material = mesh.material.map((m) => m.clone());
                } else {
                    mesh.material = (mesh.material as Material).clone();
                }

                mesh.onBeforeRender = (renderer, scene, currentCamera) => {
                    const isMainCamera = currentCamera.uuid === mainCamera.uuid;
                    const materials = Array.isArray(mesh.material)
                        ? mesh.material
                        : [mesh.material];

                    materials.forEach((mat) => {
                        mat.colorWrite = !isMainCamera;
                        mat.depthWrite = !isMainCamera;
                    });
                };
            }
        });
    }, [clonedScene, mainCamera]);

    useFrame((state) => {
        const { camera } = state;
        const localOffset = new Vector3(0, -1, 0.5);

        localOffset.applyQuaternion(camera.quaternion);

        clonedScene.position.copy(camera.position.clone()).add(localOffset);
        clonedScene.rotation.y = camera.rotation.y + Math.PI;
    });

    return <primitive object={clonedScene} scale={1.12} />;
};
