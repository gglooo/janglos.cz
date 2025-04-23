import { format } from "date-fns";
import StartIcon from "../assets/start.png";
import { useStartMenuContext } from "../context/StartMenuContext";
import { useWindowContext } from "../context/WindowContext";
import { useDate } from "../hooks/useDate";
import { ContentType } from "../types/ContentType";
import { desktopIcons } from "./Desktop";
import { StartButton } from "./StartButton";
import StartItem from "./StartItem";

export const StartBar = () => {
    const { windows, setWindows } = useWindowContext();
    const { isStartMenuVisible, setIsStartMenuVisible } = useStartMenuContext();
    const currTime = useDate();
    const formattedTime = format(currTime, "HH:mm");

    const createWindow = (newWindow: {
        id: number;
        title: ContentType;
        position: { x: number; y: number };
    }) => {
        setWindows((prevWindows) => [
            ...prevWindows,
            {
                ...newWindow,
                size: getDefaultWindowSize(newWindow.title),
                zIndex: 10,
                isMinimized: false,
                isMaximized: false,
            },
        ]);
    };

    const getDefaultWindowSize = (title: ContentType) => {
        const sizes = {
            "About\u00A0me": { width: 800, height: 700 },
            Projects: { width: 1100, height: 700 },
            Weather: { width: 400, height: 300 },
            LinkedIn: { width: 800, height: 600 },
            GitHub: { width: 800, height: 600 },
        };
        return sizes[title];
    };

    return (
        <div className="w-full max-w-full h-8 bg-window text-black flex flex-row items-center gap-2 p-2 absolute bottom-0 z-50">
            <div
                className={`bg-window ${
                    isStartMenuVisible ? "" : "hidden"
                } absolute left-0 bottom-8 flex
            flex-col p-4 z-[1000] border-2 border-t-white border-l-white`}
            >
                {isStartMenuVisible &&
                    desktopIcons.map((icon) => (
                        <StartButton
                            key={icon.name}
                            icon={icon.icon}
                            name={icon.name}
                            onClick={
                                icon.onClick != undefined
                                    ? () => {
                                          icon.onClick!();
                                          setIsStartMenuVisible(false);
                                      }
                                    : (event) => {
                                          setIsStartMenuVisible(false);
                                          createWindow({
                                              id: event.timeStamp,
                                              title: icon.name,
                                              position: {
                                                  x: event.clientX,
                                                  y: event.clientY,
                                              },
                                          });
                                      }
                            }
                        />
                    ))}
            </div>
            <a
                onClick={() => setIsStartMenuVisible((p) => !p)}
                className="fixed cursor-pointer"
            >
                <img src={StartIcon} width={60}></img>
            </a>
            <div className="overflow-hidden flex flex-row max-w-full ml-16 select-none cursor-pointer">
                {windows.map((window) => (
                    <StartItem
                        key={window.id}
                        title={window.title}
                        id={window.id}
                    />
                ))}
            </div>
            <div className="ml-auto border-b-white border-r-white border border-grey pl-2 pr-2 font-main select-none">
                <h1 className="text-xl">{formattedTime}</h1>
            </div>
        </div>
    );
};
