import { useEffect, useState } from "react";

const detectTouchDevice = () => {
    if (typeof window === "undefined") {
        return false;
    }

    return Boolean(
        navigator.maxTouchPoints > 0 ||
            (typeof window.matchMedia === "function" &&
                window.matchMedia("(pointer: coarse)").matches),
    );
};

export const useTouchDevice = () => {
    const [isTouchDevice, setIsTouchDevice] = useState<boolean>(
        detectTouchDevice,
    );

    useEffect(() => {
        if (typeof window.matchMedia !== "function") {
            return;
        }

        const media = window.matchMedia("(pointer: coarse)");
        const onChange = () => {
            setIsTouchDevice(detectTouchDevice());
        };

        media.addEventListener("change", onChange);

        return () => {
            media.removeEventListener("change", onChange);
        };
    }, []);

    return isTouchDevice;
};
