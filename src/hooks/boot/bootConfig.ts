export type BootLine = {
    text: string;
    delay: number;
};

export const INITIAL_LINE_DELAY_MS = 500;
export const BOOT_TO_DESKTOP_DELAY_MS = 1000;
export const DESKTOP_REVEAL_DELAY_MS = 500;
export type ShellPhase = "off" | "booting" | "desktop-loading" | "ready";

export const bootSequence: BootLine[] = [
    { text: "Award Modular BIOS v4.51PG, An Energy Star Ally", delay: 100 },
    { text: "Copyright (C) 1984-1995, Award Software, Inc.", delay: 400 },
    { text: "", delay: 0 },
    { text: "JanglosOS 95 Motherboard ROM v1.02", delay: 200 },
    { text: "", delay: 0 },
    { text: "Main Processor : Intel Pentium(tm) 133MHz", delay: 150 },
    { text: "Memory Testing : 65536K OK", delay: 1200 },
    { text: "", delay: 0 },
    { text: "Award Plug and Play BIOS Extension v1.0A", delay: 100 },
    { text: "Initialize Plug and Play Cards...", delay: 600 },
    { text: "PNP Init Completed", delay: 200 },
    { text: "", delay: 0 },
    { text: "Detecting IDE Primary Master ... WDC AC31600H", delay: 400 },
    { text: "Detecting IDE Primary Slave  ... None", delay: 100 },
    { text: "Detecting IDE Secondary Master ... ATAPI CD-ROM", delay: 300 },
    { text: "Detecting IDE Secondary Slave  ... None", delay: 800 },
    { text: "", delay: 0 },
    { text: "Starting Windows 95...", delay: 600 },
    { text: "HIMEM.SYS is testing extended memory...done.", delay: 200 },
    { text: "Loading C:\\WINDOWS\\COMMAND\\DISPLAY.SYS", delay: 50 },
    { text: "Loading C:\\WINDOWS\\COMMAND\\EGA.CPI", delay: 50 },
    { text: "C:\\> C:\\WINDOWS\\WIN.COM", delay: 800 },
];
