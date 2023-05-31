import { atom } from "recoil";
import { ContentType } from "../types/ContentType";

export const openWindowsAtom = atom({
    key: "openWindowsAtom",
    default: [] as {
        id: number;
        title: ContentType;
        initialPosition: { x: number; y: number };
    }[],
});
