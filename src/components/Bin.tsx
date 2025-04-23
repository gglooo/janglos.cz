import emptyBinImage from "../assets/empty_bin.png";
import fullBinImage from "../assets/full_bin.png";
import { useTrashContext } from "../context/TrashContext";
import { DesktopIcon } from "./DesktopIcon";
import { IconPlace } from "./IconPlace";

interface BinProps {
    swap: (from: string, to: string) => void;
    onClick: (trashContent: JSX.Element[]) => void;
}

export const Bin = ({ swap, onClick }: BinProps) => {
    const { trashContent } = useTrashContext();
    const iconPath = trashContent.length == 0 ? emptyBinImage : fullBinImage;

    return (
        <IconPlace key={"0"} index={"0"} move={swap}>
            <DesktopIcon
                icon={iconPath}
                name={"Trash"}
                type={"trash"}
                onClick={() => onClick?.(trashContent)}
                index={"0"}
                key={"0"}
            />
        </IconPlace>
    );
};

export default Bin;
