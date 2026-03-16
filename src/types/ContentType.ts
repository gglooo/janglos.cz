export const ContentTypes = [
    "About\u00A0me",
    "Projects",
    "Weather",
    "ASCII Art",
    "The Black Lodge",
    "Trash",
    "Run",
    "Task Manager",
    "GitHub",
    "LinkedIn",
] as const;

export type ContentType = (typeof ContentTypes)[number];
