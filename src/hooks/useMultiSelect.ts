import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type KeyboardEvent,
    type MouseEvent,
} from "react";

interface UseMultiSelectParams<T extends string> {
    itemIds: T[];
}

export const useMultiSelect = <T extends string>({
    itemIds,
}: UseMultiSelectParams<T>) => {
    const [selectedIds, setSelectedIds] = useState<T[]>([]);

    useEffect(() => {
        setSelectedIds((currentSelection) => {
            const nextSelection = currentSelection.filter((id) =>
                itemIds.includes(id),
            );

            if (
                nextSelection.length === currentSelection.length &&
                nextSelection.every((id, index) => id === currentSelection[index])
            ) {
                return currentSelection;
            }

            return nextSelection;
        });
    }, [itemIds]);

    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

    const isSelected = useCallback(
        (id: T) => selectedSet.has(id),
        [selectedSet],
    );

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    const selectOnly = useCallback((id: T) => {
        setSelectedIds([id]);
    }, []);

    const toggleSelection = useCallback((id: T) => {
        setSelectedIds((currentSelection) => {
            if (currentSelection.includes(id)) {
                return currentSelection.filter((selectedId) => selectedId !== id);
            }

            return [...currentSelection, id];
        });
    }, []);

    const selectAll = useCallback(() => {
        setSelectedIds(itemIds);
    }, [itemIds]);

    const handleItemClick = useCallback(
        (id: T, event: MouseEvent<HTMLElement>) => {
            if (event.ctrlKey || event.metaKey) {
                toggleSelection(id);
                return;
            }

            selectOnly(id);
        },
        [selectOnly, toggleSelection],
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLElement>) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
                event.preventDefault();
                selectAll();
            }
        },
        [selectAll],
    );

    return {
        clearSelection,
        handleItemClick,
        handleKeyDown,
        isSelected,
        selectAll,
        selectOnly,
        selectedIds,
        selectedSet,
        toggleSelection,
    };
};
