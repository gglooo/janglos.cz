import type { StartMenuItem } from "../../types/startMenu";
import { StartButton } from "../StartButton";
import { isPrefixPath } from "./navigation";

interface StartMenuTreeProps {
    nodes: StartMenuItem[];
    focusPath: number[];
    setFocusPath: (path: number[]) => void;
    activateNode: (path: number[]) => void;
    parentPath?: number[];
}

export const StartMenuTree = ({
    nodes,
    focusPath,
    setFocusPath,
    activateNode,
    parentPath = [],
}: StartMenuTreeProps) => {
    return (
        <div
            role="menu"
            className="bg-window border-2 border-t-white border-l-white border-r-black border-b-black shadow-sm max-w-[calc(100vw-20px)] w-[min(260px,calc(100vw-20px))] sm:w-auto sm:min-w-[220px]"
        >
            {nodes.map((node, index) => {
                const nodePath = [...parentPath, index];
                const isFocused =
                    focusPath.length === nodePath.length &&
                    isPrefixPath(nodePath, focusPath);
                const showChildMenu =
                    node.kind === "submenu" &&
                    focusPath.length >= nodePath.length &&
                    isPrefixPath(nodePath, focusPath);

                if (node.kind === "separator") {
                    return (
                        <div
                            key={node.id}
                            className="my-1 border-t border-t-grey border-b border-b-white"
                        />
                    );
                }

                return (
                    <div
                        key={node.id}
                        className="relative"
                        onMouseEnter={() => setFocusPath(nodePath)}
                    >
                        <StartButton
                            label={node.label}
                            hasSubmenu={node.kind === "submenu"}
                            isFocused={isFocused}
                            disabled={Boolean(node.disabled)}
                            onClick={() => activateNode(nodePath)}
                        />
                        {node.kind === "submenu" && showChildMenu ? (
                            <div className="absolute left-0 top-full sm:left-full sm:top-0 z-[1200]">
                                <StartMenuTree
                                    nodes={node.items}
                                    focusPath={focusPath}
                                    setFocusPath={setFocusPath}
                                    activateNode={activateNode}
                                    parentPath={nodePath}
                                />
                            </div>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
};
