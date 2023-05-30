import { useState } from "react";
import { DesktopIcon } from "./DesktopIcon";
import { IconPlace } from "./IconPlace";
import { set } from "date-fns";

interface BinProps {
    swap: (from: number, to: number) => void;
    index: number;
}

export const Bin = ({ swap, index }: BinProps) => {
    const [isEmpty, setIsEmpty] = useState(true);

    const onDrag = () => {
        setIsEmpty(false);
    };

    return (
        <IconPlace key={0} index={0} move={swap} onDrag={onDrag}>
            <DesktopIcon
                icon={
                    "src/assets/" + (isEmpty ? "empty_bin.png" : "full_bin.png")
                }
                name={"Trash"}
                type={"trash"}
                onClick={() => {
                    void 0;
                }}
                index={0}
                key={0}
            />
        </IconPlace>
    );
};

export default Bin;
