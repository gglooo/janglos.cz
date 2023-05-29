export const ContentTypes = [
    "Education",
    "About\u00A0me",
    "Projects",
    "Weather",
] as const;

export type ContentType = (typeof ContentTypes)[number];
