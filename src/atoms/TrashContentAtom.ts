import { atom } from "recoil";

export const trashContentAtom = atom({
    key: "trashContentAtom",
    default: [] as JSX.Element[],
});
