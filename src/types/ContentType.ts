export const ContentTypes = [
    "About\u00A0me",
    "Projects",
    "Weather",
    "Run",
    "GitHub",
    "LinkedIn",
] as const;

export type ContentType = (typeof ContentTypes)[number];
