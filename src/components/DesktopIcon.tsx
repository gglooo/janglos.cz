import React, { SyntheticEvent } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";
import { IconType } from "../models/IconType";

interface DesktopIconProps {
    icon: string;
    name: string;
    type: IconType;
    onClick: (event: any) => void;
}

export const DesktopIcon = ({
    icon,
    name,
    type,
    onClick,
}: DesktopIconProps) => {
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: type,
        item: { id: "12" },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <>
            <DragPreviewImage connect={preview} src={icon} />
            <div
                className={
                    "flex flex-col items-center font-main justify-center" +
                    (isDragging ? " invisible" : "")
                }
                ref={drag}
            >
                <img
                    src={icon}
                    alt={name}
                    className={"w-14 h-14 cursor-pointer hover:opacity-50"}
                    onClick={onClick}
                />
                <p className="text-white text-xl">{name}</p>
            </div>
        </>
    );
};
