import { useState } from "react";
import { DesktopIcon } from "./DesktopIcon";
import { IconPlace } from "./IconPlace";
import { set } from "date-fns";
import emptyBinImage from "../assets/empty_bin.png";
import fullBinImage from "../assets/full_bin.png";
import { useRecoilValue } from "recoil";
import { trashContentAtom } from "../atoms/TrashContentAtom";

interface BinProps {
    swap: (from: string, to: string) => void;
    index: string;
    onClick: (event: any) => void;
}

export const Bin = ({ swap, index, onClick }: BinProps) => {
    const trashStatus = useRecoilValue(trashContentAtom);
    const iconPath = trashStatus.length == 0 ? emptyBinImage : fullBinImage;

    return (
        <IconPlace key={"0"} index={"0"} move={swap}>
            <DesktopIcon
                icon={iconPath}
                name={"Trash"}
                type={"trash"}
                onClick={onClick}
                index={"0"}
                key={"0"}
            />
        </IconPlace>
    );
};

export default Bin;
