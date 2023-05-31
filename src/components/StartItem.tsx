import { selectedStartAtom } from "../atoms/SelectedStart";
import { useRecoilValue } from "recoil";

interface StartItemProps {
    title: string;
}

export const StartItem = ({ title }: StartItemProps) => {
    const selectedStart = useRecoilValue(selectedStartAtom);
    const border =
        selectedStart !== title
            ? "border-t-white border-l-white border"
            : "border-r-white border-b-white border";

    console.log(window);
    return (
        <div className={"bg-window text-black font-main " + border}>
            <h1 className="px-2">{title}</h1>
        </div>
    );
};

export default StartItem;
