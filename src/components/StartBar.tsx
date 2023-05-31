import { openWindowsAtom } from "../atoms/OpenWindows";
import { useRecoilValue } from "recoil";
import StartItem from "./StartItem";
import { useDate } from "../hooks/useDate";
import { format } from "date-fns";
import StartIcon from "../assets/start.png";

export const StartBar = () => {
    const openWindows = useRecoilValue(openWindowsAtom);
    const currTime = useDate();
    const formattedTime = format(currTime, "HH:mm");

    return (
        <div className="w-full h-8 bg-window text-black flex flex-row items-center gap-2 p-2">
            <a href=".">
                <img src={StartIcon} width={60} className="ml-0"></img>
            </a>
            {openWindows.map((window) => (
                <StartItem key={window.id} title={window.title} />
            ))}
            <div className="ml-auto border-b-white border-r-white border border-grey pl-2 pr-2 font-main select-none">
                <h1 className="text-xl">{formattedTime}</h1>
            </div>
        </div>
    );
};
