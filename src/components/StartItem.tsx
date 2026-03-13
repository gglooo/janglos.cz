import { useAppStore } from "../store/appStore";

interface StartItemProps {
    title: string;
    id: number;
}

export const StartItem = ({ title, id }: StartItemProps) => {
    const bringToFront = useAppStore((s) => s.bringToFront);

    return (
        <div
            className="bg-window text-black font-main hover:bg-grey border-t-white border-l-white border"
            onClick={() => bringToFront(id)}
        >
            <h1 className="px-2">{title}</h1>
        </div>
    );
};

export default StartItem;
