import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "../store/appStore";
import type { WindowData } from "../store/slices/windowSlice";

const HISTORY_LENGTH = 32;
const TICK_INTERVAL_MS = 800;

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const computeCpuValue = (tick: number, programsOpen: number) => {
    if (programsOpen === 0) {
        return clampPercent(Math.round(2 + Math.sin(tick / 3)));
    }

    const baseLoad = programsOpen * 12;

    const primarySpike = Math.sin(tick / 2) * (5 + programsOpen * 2);
    const secondarySpike =
        Math.sin(tick / 5) * (4 * programsOpen) * Math.cos(tick / 11);

    return clampPercent(Math.round(baseLoad + primarySpike + secondarySpike));
};

const computeMemoryValue = (tick: number, programsOpen: number) => {
    if (programsOpen === 0) {
        return clampPercent(Math.round(8 + Math.cos(tick / 4)));
    }

    const baseUsage = programsOpen * 18;

    const primaryFluctuation =
        Math.cos(tick / 3 + 1.3) * (6 + programsOpen * 3);
    const secondaryFluctuation =
        Math.cos(tick / 7) * (4 * programsOpen) * Math.sin(tick / 13);

    return clampPercent(
        Math.round(baseUsage + primaryFluctuation + secondaryFluctuation),
    );
};

const toGraphPoints = (values: number[]) =>
    values
        .map((value, index) => {
            const x = (index / Math.max(1, values.length - 1)) * 100;
            const y = 100 - value;
            return `${x},${y}`;
        })
        .join(" ");

interface MetricGraphProps {
    label: string;
    value: number;
    values: number[];
    lineClassName: string;
    valueTestId: string;
}

const MetricGraph = ({
    label,
    value,
    values,
    lineClassName,
    valueTestId,
}: MetricGraphProps) => (
    <div className="border-2 border-t-white border-l-white border-r-black border-b-black bg-black p-2">
        <div className="mb-1 flex items-center justify-between text-sm text-white">
            <span>{label}</span>
            <span data-testid={valueTestId}>{value}%</span>
        </div>
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-16 w-full border border-[#2f2f2f] bg-black"
            aria-hidden="true"
        >
            <path
                d="M 0 20 H 100 M 0 40 H 100 M 0 60 H 100 M 0 80 H 100"
                className="stroke-[#113311]"
                strokeWidth="0.6"
                fill="none"
            />
            <polyline
                points={toGraphPoints(values)}
                className={lineClassName}
                strokeWidth="1.6"
                fill="none"
            />
        </svg>
    </div>
);

const formatWindowState = (state: WindowData["state"]) =>
    state === "maximized"
        ? "Maximized"
        : state === "minimized"
          ? "Minimized"
          : "";

export const TaskManagerWindow = () => {
    const openWindows = useAppStore((s) => s.openWindows);
    const closeWindow = useAppStore((s) => s.closeWindow);

    const managedWindows = useMemo(
        () =>
            openWindows.filter(
                (windowData) => windowData.title !== "Task Manager",
            ),
        [openWindows],
    );
    const [selectedWindowId, setSelectedWindowId] = useState<number | null>(
        null,
    );

    const [tick, setTick] = useState(0);
    const [cpuHistory, setCpuHistory] = useState<number[]>(
        Array.from({ length: HISTORY_LENGTH }, (_, index) =>
            computeCpuValue(-HISTORY_LENGTH + index, openWindows.length - 1),
        ),
    );
    const [memoryHistory, setMemoryHistory] = useState<number[]>(
        Array.from({ length: HISTORY_LENGTH }, (_, index) =>
            computeMemoryValue(-HISTORY_LENGTH + index, openWindows.length - 1),
        ),
    );

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setTick((prev) => prev + 1);
        }, TICK_INTERVAL_MS);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        const cpuValue = computeCpuValue(tick, openWindows.length - 1);
        const memoryValue = computeMemoryValue(tick, openWindows.length - 1);
        setCpuHistory((prev) => [...prev.slice(1), cpuValue]);
        setMemoryHistory((prev) => [...prev.slice(1), memoryValue]);
    }, [openWindows.length, tick]);

    useEffect(() => {
        if (managedWindows.length === 0) {
            setSelectedWindowId(null);
            return;
        }

        const selectedStillExists = managedWindows.some(
            (windowData) => windowData.id === selectedWindowId,
        );
        if (!selectedStillExists) {
            setSelectedWindowId(managedWindows[0]?.id ?? null);
        }
    }, [managedWindows, selectedWindowId]);

    const selectedWindow = managedWindows.find(
        (windowData) => windowData.id === selectedWindowId,
    );
    const cpuUsage = cpuHistory[cpuHistory.length - 1] ?? 0;
    const memoryUsage = memoryHistory[memoryHistory.length - 1] ?? 0;

    return (
        <div className="text-sm">
            <div className="mb-3 grid gap-2 sm:grid-cols-2">
                <MetricGraph
                    label="CPU Usage"
                    value={cpuUsage}
                    values={cpuHistory}
                    lineClassName="stroke-[#3aff6f]"
                    valueTestId="task-manager-cpu-value"
                />
                <MetricGraph
                    label="Memory Usage"
                    value={memoryUsage}
                    values={memoryHistory}
                    lineClassName="stroke-[#5fd2ff]"
                    valueTestId="task-manager-memory-value"
                />
            </div>

            <div className="border-t-white border-l-white border-r-black border-b-black bg-window p-2">
                {managedWindows.length === 0 ? (
                    <p data-testid="task-manager-empty-state">
                        No applications are currently running.
                    </p>
                ) : (
                    <ul
                        role="listbox"
                        aria-label="Open applications"
                        className="max-h-48 space-y-1 overflow-auto border border-grey bg-white p-1"
                    >
                        {managedWindows.map((windowData) => {
                            const isSelected =
                                windowData.id === selectedWindowId;
                            return (
                                <li key={windowData.id}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() =>
                                            setSelectedWindowId(windowData.id)
                                        }
                                        className={
                                            "flex w-full items-center justify-between px-2 py-1 text-left " +
                                            (isSelected
                                                ? "bg-blue text-white"
                                                : "bg-white text-black hover:bg-[#dedede]")
                                        }
                                    >
                                        <span>{windowData.title}</span>
                                        <span>
                                            {formatWindowState(
                                                windowData.state,
                                            )}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <div className="mt-2 flex items-center justify-between border-t border-grey pt-2">
                    <span className="truncate">
                        {selectedWindow
                            ? `Selected: ${selectedWindow.title}`
                            : "Selected: none"}
                    </span>
                    <button
                        type="button"
                        disabled={!selectedWindow}
                        onClick={() => {
                            if (selectedWindow) {
                                closeWindow(selectedWindow.id);
                            }
                        }}
                        className={
                            "border-2 px-2 py-1 " +
                            (!selectedWindow
                                ? "cursor-not-allowed border-[#b7b7b7] text-[#6a6a6a]"
                                : "border-t-white border-l-white border-r-black border-b-black bg-window hover:bg-grey")
                        }
                    >
                        End Task
                    </button>
                </div>
            </div>
        </div>
    );
};
