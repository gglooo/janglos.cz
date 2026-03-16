import { describe, expect, it } from "vitest";
import { startMenuModel } from "../src/config/startMenuModel";

describe("startMenuModel", () => {
    it("keeps only functional top-level actions and removes dead branches", () => {
        const topLevelIds = startMenuModel.map((item) => item.id);

        expect(topLevelIds).toContain("root-programs");
        expect(topLevelIds).toContain("root-help");
        expect(topLevelIds).toContain("root-run");
        expect(topLevelIds).toContain("root-task-manager");
        expect(topLevelIds).toContain("root-shutdown");

        expect(topLevelIds).not.toContain("root-documents");
        expect(topLevelIds).not.toContain("root-settings");
        expect(topLevelIds).not.toContain("root-find");
    });

    it("routes Help and Task Manager to implemented window actions", () => {
        const helpNode = startMenuModel.find((item) => item.id === "root-help");
        const taskManagerNode = startMenuModel.find(
            (item) => item.id === "root-task-manager",
        );

        expect(helpNode?.kind).toBe("action");
        if (helpNode?.kind !== "action") {
            throw new Error("Expected Help node to be an action");
        }

        expect(helpNode.action).toEqual({
            type: "open-window",
            title: "About\u00A0me",
        });

        expect(taskManagerNode?.kind).toBe("action");
        if (taskManagerNode?.kind !== "action") {
            throw new Error("Expected Task Manager node to be an action");
        }

        expect(taskManagerNode.action).toEqual({
            type: "open-window",
            title: "Task Manager",
        });
    });
});
