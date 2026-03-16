import { useCallback, useMemo, useState } from "react";

export const useDesktopSelectionState = () => {
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

    const clearSelection = useCallback(() => {
        setSelectedItemIds([]);
    }, []);

    const setSelection = useCallback((itemIds: string[]) => {
        setSelectedItemIds(Array.from(new Set(itemIds)));
    }, []);

    const selectOnly = useCallback((itemId: string) => {
        setSelectedItemIds((current) => {
            if (current.length === 1 && current[0] === itemId) {
                return current;
            }

            return [itemId];
        });
    }, []);

    const isSelected = useCallback(
        (itemId: string) => selectedItemIds.includes(itemId),
        [selectedItemIds],
    );

    return useMemo(
        () => ({
            clearSelection,
            isSelected,
            selectOnly,
            selectedItemIds,
            setSelection,
        }),
        [clearSelection, isSelected, selectOnly, selectedItemIds, setSelection],
    );
};
