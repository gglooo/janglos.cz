import type { StartMenuItem } from "../../types/startMenu";

export const firstInteractiveIndex = (nodes: StartMenuItem[]) => {
    const index = nodes.findIndex(
        (node) => node.kind !== "separator" && !node.disabled,
    );
    return index >= 0 ? index : 0;
};

export const moveInteractiveIndex = (
    nodes: StartMenuItem[],
    currentIndex: number,
    delta: 1 | -1,
) => {
    if (nodes.length === 0) {
        return 0;
    }

    let nextIndex = currentIndex;
    for (let attempts = 0; attempts < nodes.length; attempts += 1) {
        nextIndex = (nextIndex + delta + nodes.length) % nodes.length;
        const node = nodes[nextIndex];
        if (node.kind !== "separator" && !node.disabled) {
            return nextIndex;
        }
    }

    return currentIndex;
};

export const getNodeAtPath = (nodes: StartMenuItem[], path: number[]) => {
    let currentNodes = nodes;
    let currentNode: StartMenuItem | null = null;

    for (const index of path) {
        currentNode = currentNodes[index] ?? null;
        if (!currentNode) {
            return null;
        }

        if (currentNode.kind === "submenu") {
            currentNodes = currentNode.items;
        }
    }

    return currentNode;
};

export const getMenuAtDepth = (
    nodes: StartMenuItem[],
    focusPath: number[],
    depth: number,
) => {
    let currentNodes = nodes;

    for (let cursor = 0; cursor < depth; cursor += 1) {
        const selectedIndex = focusPath[cursor];
        const currentNode = currentNodes[selectedIndex];
        if (!currentNode || currentNode.kind !== "submenu") {
            return currentNodes;
        }
        currentNodes = currentNode.items;
    }

    return currentNodes;
};

export const isPrefixPath = (candidatePrefix: number[], fullPath: number[]) =>
    candidatePrefix.every((part, index) => fullPath[index] === part);
