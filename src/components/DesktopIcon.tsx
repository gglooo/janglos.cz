import { useDrag } from "react-dnd";
import { IconType } from "../types/IconType";

interface DesktopIconProps {
    icon: string;
    name: string;
    type: IconType;
    index: string;
    onClick: (event: any) => void;
}

export const DesktopIcon = ({
    icon,
    name,
    type,
    index,
    onClick,
}: DesktopIconProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: type,
        item: { index: index.toString() },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            className={
                "flex flex-col items-center font-main justify-center cursor-pointer hover:opacity-50" +
                (isDragging ? " invisible" : "")
            }
            onClick={onClick}
            ref={drag}
        >
            <img src={icon} alt={name} className={"w-10 h-10"} />
            <p className="text-white text-lg sm:text-lg md:text-lg lg:text-xl">
                {name}
            </p>
        </div>
    );
};
