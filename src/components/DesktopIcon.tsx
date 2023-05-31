import React, { SyntheticEvent } from "react";
import { useDrag } from "react-dnd";
import { IconType } from "../models/IconType";

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
                "flex flex-col items-center font-main justify-center" +
                (isDragging ? " invisible" : "")
            }
        >
            <img
                src={icon}
                alt={name}
                className={"w-14 h-14 cursor-pointer hover:opacity-50"}
                onClick={onClick}
                ref={drag}
            />
            <p className="text-white text-xl">{name}</p>
        </div>
    );
};
