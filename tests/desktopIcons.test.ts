import { describe, expect, it } from "vitest";
import {
    desktopRegistrySeed,
    getDesktopItemById,
} from "../src/config/desktopIcons";

describe("desktop icon configuration", () => {
    it("includes a label-less Black Lodge desktop item", () => {
        const item = getDesktopItemById("black-lodge");

        expect(item).toBeTruthy();
        expect(item.name).toBe("The Black Lodge");
        expect(item.hideLabel).toBe(true);
        expect(item.launch.type).toBe("window");
        if (item.launch.type === "window") {
            expect(item.launch.content).toBe("The Black Lodge");
        }
    });

    it("keeps Black Lodge item in default desktop ordering", () => {
        expect(desktopRegistrySeed.itemIds.includes("black-lodge")).toBe(true);
    });
});
