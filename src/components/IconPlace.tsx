import { useDrop } from "react-dnd";

interface IconPlaceProps {
    index: string;
    children?: React.ReactNode;
    move: (from: string, to: string) => void;
    onDrag?: () => void;
}

export const IconPlace = ({
    children,
    index,
    move,
    onDrag,
}: IconPlaceProps) => {
    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: ["normal", "trash", "link"],
            canDrop: () => {
                return true;
            },
            drop: (item: { index: string }) => {
                move(item.index, index);
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop(),
            }),
        }),
        []
    );

    return (
        <div
            className="flex relative justify-center items-center z-10"
            ref={drop}
        >
            {children}
        </div>
    );
};
