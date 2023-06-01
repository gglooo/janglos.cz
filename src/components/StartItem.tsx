import { openWindowComponents } from "../atoms/OpenWindowComponents";
import { selectedStartAtom } from "../atoms/SelectedStart";
import { useRecoilValue } from "recoil";

interface StartItemProps {
    title: string;
    id: number;
}

export const StartItem = ({ title, id }: StartItemProps) => {
    const selectedStart = useRecoilValue(selectedStartAtom);
    const openComponents = useRecoilValue(openWindowComponents);

    const border =
        selectedStart !== title
            ? "border-t-white border-l-white border"
            : "border-r-white border-b-white border";

    return (
        <div
            className={"bg-window text-black font-main hover:bg-grey " + border}
            onClick={() => {
                openComponents
                    .find((component) => component.key === id.toString())
                    ?.props.onMouseDown();
            }}
        >
            <h1 className="px-2">{title}</h1>
        </div>
    );
};

export default StartItem;
