import { useDrop } from "react-dnd";

interface IconPlaceProps {
    index: number;
    children?: React.ReactNode;
    move: (from: number, to: number) => void;
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
            accept: ["normal", "trash"],
            canDrop: () => {
                return true;
            },
            drop: (item: { index: number }) => {
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
        <div className="flex justify-center items-center z-10" ref={drop}>
            {children}
        </div>
    );
};