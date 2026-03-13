import { useCallback } from "react";
import { startMenuRunAliasActions } from "../config/startMenuModel";
import { useAppStore } from "../store/appStore";
import type { StartMenuRunAlias } from "../types/startMenu";

const runAliasIds = Object.keys(startMenuRunAliasActions) as StartMenuRunAlias[];
export const runCommandAliases = [...runAliasIds] as ReadonlyArray<StartMenuRunAlias>;

export const useRunCommand = () => {
    const openWindow = useAppStore((s) => s.openWindow);

    const execute = useCallback(
        (rawInput: string): { ok: true } | { ok: false; error: string } => {
            const input = rawInput.trim();
            const normalized = input.toLowerCase();

            if (!normalized) {
                return {
                    ok: false,
                    error: "Please enter a program, folder, document, or command.",
                };
            }

            if (!runAliasIds.includes(normalized as StartMenuRunAlias)) {
                return {
                    ok: false,
                    error: `Cannot find '${input}'.`,
                };
            }

            const action = startMenuRunAliasActions[normalized as StartMenuRunAlias];

            if (action.type === "open-window") {
                openWindow({ title: action.title, source: "start-menu" });
                return { ok: true };
            }

            if (action.type === "open-external") {
                window.open(action.href, action.target ?? "_blank");
                return { ok: true };
            }

            return {
                ok: false,
                error: "This command is not executable from Run.",
            };
        },
        [openWindow],
    );

    return { execute, commands: runCommandAliases };
};
