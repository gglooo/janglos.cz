import { useGLTF } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import soundtrackPath from "../../assets/black-lodge/black-lodge-theme.mp3";
import {
    BLACK_LODGE_CHARACTERS,
    type BlackLodgeCharacter,
} from "../../config/blackLodgeCharacters";
import { BlackLodgeScene3D } from "./BlackLodgeScene3D";

type Scene = "intro" | "lodge" | "dance";

const INTRO_DURATION_MS = 4500;
const LYNCH_HEAD_PATH = "src/assets/black-lodge/lynch.png";

const ACTIVE_CHARACTERS: BlackLodgeCharacter[] = BLACK_LODGE_CHARACTERS.filter(
    (character) => character.enabled,
);

ACTIVE_CHARACTERS.forEach((character) => {
    useGLTF.preload(character.modelPath);
});

const SceneSurface = ({ children }: { children: React.ReactNode }) => (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
        {children}
    </div>
);

const IntroScene = ({ scene }: { scene: Scene }) => (
    <div
        className={`absolute inset-0 transition-opacity duration-700 ${
            scene === "intro" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="black-lodge-lynch h-56 w-56">
                <img
                    src={LYNCH_HEAD_PATH}
                    alt="David Lynch"
                    className="h-full w-full rounded-full object-cover"
                />
            </div>
        </div>
    </div>
);

const DanceScene = ({ scene }: { scene: Scene }) => (
    <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
            scene === "intro" ? "opacity-0" : "opacity-100"
        }`}
    >
        <BlackLodgeScene3D showCharacters={scene === "dance"} />
    </div>
);

export const BlackLodgeWindow = () => {
    const [scene, setScene] = useState<Scene>("intro");
    const [autoplayBlocked, setAutoplayBlocked] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const introTimer = window.setTimeout(
            () => setScene("dance"),
            INTRO_DURATION_MS,
        );

        return () => {
            window.clearTimeout(introTimer);
        };
    }, []);

    const playSoundtrack = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio) {
            return;
        }

        try {
            await audio.play();
            setAutoplayBlocked(false);
        } catch {
            setAutoplayBlocked(true);
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        void playSoundtrack();

        return () => {
            if (!audio) {
                return;
            }
            audio.pause();
            audio.currentTime = 0;
        };
    }, [playSoundtrack]);

    return (
        <SceneSurface>
            <audio ref={audioRef} src={soundtrackPath} loop preload="auto" />
            {autoplayBlocked ? (
                <button
                    type="button"
                    className="absolute right-4 top-4 z-40 border border-[#9f1111] bg-black px-3 py-2 text-sm text-white hover:bg-[#1a0000]"
                    onClick={() => {
                        void playSoundtrack();
                    }}
                >
                    Start soundtrack
                </button>
            ) : null}
            <IntroScene scene={scene} />
            <DanceScene scene={scene} />
        </SceneSurface>
    );
};
