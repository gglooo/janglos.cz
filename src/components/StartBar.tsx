import { openWindowsAtom } from "../atoms/OpenWindows";
import { useRecoilState } from "recoil";
import StartItem from "./StartItem";
import { useDate } from "../hooks/useDate";
import { format } from "date-fns";
import StartIcon from "../assets/start.png";
import { useState } from "react";
import { desktopIcons } from "./Desktop";
import { StartButton } from "./StartButton";
import { ContentType } from "../types/ContentType";
import { iStartMenuVisible } from "../atoms/StartMenuVisible";

export const StartBar = () => {
    const [openWindows, setOpenWindows] = useRecoilState(openWindowsAtom);
    const currTime = useDate();
    const formattedTime = format(currTime, "HH:mm");
    const [isMenuVisible, setIsMenuVisible] = useRecoilState(iStartMenuVisible);

    const createWindow = (newWindow: {
        id: number;
        title: ContentType;
        initialPosition: { x: number; y: number };
    }) => {
        setOpenWindows((windows) => [...windows, newWindow]);
    };

    return (
        <div className="w-full max-w-full h-8 bg-window text-black flex flex-row items-center gap-2 p-2 fixed bottom-0 z-50">
            <div
                className={`bg-window ${
                    isMenuVisible ? "" : "hidden"
                } absolute left-0 bottom-8 flex
            flex-col-reverse p-4 z-[1000] border-2 border-t-white border-l-white`}
            >
                {isMenuVisible &&
                    desktopIcons.map((icon) => (
                        <StartButton
                            key={icon.name}
                            icon={icon.icon}
                            name={icon.name}
                            onClick={
                                icon.onClick != undefined
                                    ? () => {
                                          icon.onClick!();
                                          setIsMenuVisible(false);
                                      }
                                    : (event) => {
                                          setIsMenuVisible(false);
                                          createWindow({
                                              id: event.timeStamp,
                                              title: icon.name,
                                              initialPosition: {
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
                onClick={() => setIsMenuVisible(!isMenuVisible)}
                className="fixed cursor-pointer"
            >
                <img src={StartIcon} width={60}></img>
            </a>
            <div className="overflow-hidden flex flex-row max-w-full ml-16 select-none cursor-pointer">
                {openWindows.map((window) => (
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
