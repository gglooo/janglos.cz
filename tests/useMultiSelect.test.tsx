// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import type { KeyboardEvent, MouseEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { useMultiSelect } from "../src/hooks/useMultiSelect";

describe("useMultiSelect", () => {
    it("toggles items with ctrl+click", () => {
        const { result } = renderHook(() =>
            useMultiSelect({
                itemIds: ["a", "b", "c"],
            }),
        );

        act(() => {
            result.current.handleItemClick("a", {
                ctrlKey: true,
                metaKey: false,
            } as MouseEvent<HTMLElement>);
            result.current.handleItemClick("b", {
                ctrlKey: true,
                metaKey: false,
            } as MouseEvent<HTMLElement>);
            result.current.handleItemClick("a", {
                ctrlKey: true,
                metaKey: false,
            } as MouseEvent<HTMLElement>);
        });

        expect(result.current.selectedIds).toEqual(["b"]);
    });

    it("selects all with ctrl+a", () => {
        const { result } = renderHook(() =>
            useMultiSelect({
                itemIds: ["a", "b", "c"],
            }),
        );

        const preventDefault = vi.fn();

        act(() => {
            result.current.handleKeyDown({
                key: "a",
                ctrlKey: true,
                metaKey: false,
                preventDefault,
            } as unknown as KeyboardEvent<HTMLElement>);
        });

        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(result.current.selectedIds).toEqual(["a", "b", "c"]);
    });

    it("removes stale selected ids when item list changes", () => {
        const { result, rerender } = renderHook(
            ({ itemIds }: { itemIds: string[] }) =>
                useMultiSelect({
                    itemIds,
                }),
            {
                initialProps: { itemIds: ["a", "b", "c"] },
            },
        );

        act(() => {
            result.current.selectAll();
        });

        rerender({ itemIds: ["a", "c"] });

        expect(result.current.selectedIds).toEqual(["a", "c"]);
    });
});
