import { atom } from "recoil";

export const openWindowComponents = atom({
    key: "openWindowComponents",
    default: [] as JSX.Element[],
});
