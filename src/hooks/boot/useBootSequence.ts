import { useCallback, useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store/appStore";
import {
    BOOT_TO_DESKTOP_DELAY_MS,
    bootSequence,
    DESKTOP_REVEAL_DELAY_MS,
    INITIAL_LINE_DELAY_MS,
    type ShellPhase,
} from "./bootConfig";

interface UseBootSequenceResult {
    phase: ShellPhase;
    visibleLineCount: number;
}

export const useBootSequence = (): UseBootSequenceResult => {
    const isPoweredOn = useAppStore((state) => state.isPoweredOn);
    const bootSequenceCompleted = useAppStore(
        (state) => state.bootSequenceCompleted,
    );
    const markBootSequenceCompleted = useAppStore(
        (state) => state.markBootSequenceCompleted,
    );

    const [phase, setPhase] = useState<ShellPhase>("booting");
    const [visibleLineCount, setVisibleLineCount] = useState(0);
    const prevPoweredOnRef = useRef(isPoweredOn);
    const timersRef = useRef<number[]>([]);

    const clearBootTimers = useCallback(() => {
        timersRef.current.forEach((timerId) => {
            window.clearTimeout(timerId);
        });
        timersRef.current = [];
    }, []);

    const runBootSequence = useCallback(() => {
        clearBootTimers();
        setPhase("booting");
        setVisibleLineCount(0);

        let accumulatedDelay = INITIAL_LINE_DELAY_MS;

        bootSequence.forEach((line, index) => {
            accumulatedDelay += line.delay;

            const timerId = window.setTimeout(() => {
                setVisibleLineCount(index + 1);
            }, accumulatedDelay);
            timersRef.current.push(timerId);
        });

        timersRef.current.push(
            window.setTimeout(() => {
                setPhase("desktop-loading");
            }, accumulatedDelay + BOOT_TO_DESKTOP_DELAY_MS),
        );

        timersRef.current.push(
            window.setTimeout(
                () => {
                    markBootSequenceCompleted();
                    setPhase("ready");
                },
                accumulatedDelay +
                    BOOT_TO_DESKTOP_DELAY_MS +
                    DESKTOP_REVEAL_DELAY_MS,
            ),
        );
    }, [clearBootTimers, markBootSequenceCompleted]);

    useEffect(() => {
        const wasPoweredOn = prevPoweredOnRef.current;
        prevPoweredOnRef.current = isPoweredOn;

        if (wasPoweredOn && !isPoweredOn) {
            clearBootTimers();
            setVisibleLineCount(0);
            setPhase("off");
            return;
        }

        if (isPoweredOn && bootSequenceCompleted) {
            clearBootTimers();
            setPhase("ready");
            return;
        }

        if (!isPoweredOn && !bootSequenceCompleted) {
            runBootSequence();
        }
    }, [bootSequenceCompleted, clearBootTimers, isPoweredOn, runBootSequence]);

    useEffect(
        () => () => {
            clearBootTimers();
        },
        [clearBootTimers],
    );

    return {
        phase,
        visibleLineCount,
    };
};
