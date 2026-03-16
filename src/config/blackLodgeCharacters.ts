import { CameraProps } from "@react-three/fiber";
import bobPath from "../assets/black-lodge/bob.glb?url";
import logLadyPath from "../assets/black-lodge/log_lady.glb?url";

export type CharacterId = "log-lady" | "bob";

export type BlackLodgeCharacter = {
    id: CharacterId;
    name: string;
    modelPath: string;
    enabled: boolean;
    containerClassName: string;
    cameraProps: CameraProps;
};

export const BLACK_LODGE_CHARACTERS: BlackLodgeCharacter[] = [
    {
        id: "log-lady",
        name: "Log Lady",
        modelPath: logLadyPath,
        enabled: true,
        containerClassName:
            "absolute z-10 h-56 w-44 sm:h-72 sm:w-56 bottom-12 left-1/2 -translate-x-1/2",
        cameraProps: { position: [0, 1.1, 3], fov: 45 },
    },
    {
        id: "bob",
        name: "Bob",
        modelPath: bobPath,
        enabled: true,
        containerClassName:
            "absolute z-10 h-56 w-44 sm:h-72 sm:w-56 bottom-10 left-[22%] -translate-x-1/2",
        cameraProps: { position: [0, 1.1, 3], fov: 45 },
    },
];
