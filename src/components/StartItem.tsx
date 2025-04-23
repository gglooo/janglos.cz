import { useStartMenuContext } from "../context/StartMenuContext";
import { useWindowContext } from "../context/WindowContext";

interface StartItemProps {
    title: string;
    id: number;
}

export const StartItem = ({ title, id }: StartItemProps) => {
    const { selectedStart } = useStartMenuContext();
    const { windows, updateWindowZIndex } = useWindowContext();

    const window = windows.find((w) => w.id === id);
    if (!window) return null;

    const border =
        selectedStart !== title
            ? "border-t-white border-l-white border"
            : "border-r-white border-b-white border";

    return (
        <div
            className={"bg-window text-black font-main hover:bg-grey " + border}
            onClick={() => updateWindowZIndex(id)}
        >
            <h1 className="px-2">{title}</h1>
        </div>
    );
};

export default StartItem;
