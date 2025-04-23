import { Rnd } from "react-rnd";
import { useWindowContext, WindowMetadata } from "../context/WindowContext";
import { ContentTypes } from "../types/ContentType";

interface WindowProps {
    metadata: WindowMetadata;
    Component: () => JSX.Element;
}

export const Window = ({ metadata, Component }: WindowProps) => {
    const isMobile = window.innerWidth <= 768;
    const {
        updateWindowZIndex,
        closeWindow,
        updateWindowPosition,
        updateWindowSize,
    } = useWindowContext();

    const handleDragStop = (e: any, d: { x: number; y: number }) => {
        updateWindowPosition(metadata.id, { x: d.x, y: d.y });
    };

    const handleResizeStop = (
        e: any,
        direction: any,
        ref: any,
        delta: any,
        position: any
    ) => {
        updateWindowSize(metadata.id, {
            width: ref.offsetWidth,
            height: ref.offsetHeight,
        });
        updateWindowPosition(metadata.id, position);
    };

    const content = (
        <>
            <div className="bg-blue w-full border-b border-b-black text-left flex items-center">
                <h1 className="text-xl text-white mr-4 ml-2 select-none">
                    {metadata.title}
                </h1>
                <a
                    onClick={() => closeWindow(metadata.id)}
                    className="border-t-white border-l-white border-2 ml-auto bg-window mr-2 mt-1 pr-2 pl-2 mb-1 text-center flex justify-center items-center hover:bg-grey hover:cursor-pointer"
                >
                    <span>X</span>
                </a>
            </div>
            <div className="flex flex-col bg-window font-main p-2 w-full h-full cursor-default overflow-hidden sm:overflow-auto lg:overflow-hidden md:overflow-hidden">
                <div className="flex gap-4 border border-r-white border-b-white p-1 pt-0 pb-0 mb-3 text-xl select-none">
                    {ContentTypes.map((tab) => (
                        <h2
                            key={tab}
                            className={
                                (metadata.title == tab ? "underline" : "") +
                                " first-letter:underline text-md select-none cursor-pointer overflow-hidden whitespace-nowrap max-w-xs truncate"
                            }
                        >
                            {tab}
                        </h2>
                    ))}
                </div>
                <div className="overflow-auto pb-10">
                    <Component />
                </div>
            </div>
        </>
    );

    const defaultSettings = {
        "About\u00A0me": {
            default: {
                width: 800,
                height: 700,
                x: metadata.position.x,
                y: metadata.position.y,
            },
            minHeight: 80,
            minWidth: 700,
        },
        Projects: {
            default: {
                width: 1100,
                height: 700,
                x: metadata.position.x,
                y: metadata.position.y,
            },
            minHeight: 80,
            minWidth: 700,
        },
        Weather: {
            default: {
                width: 400,
                height: 300,
                x: metadata.position.x,
                y: metadata.position.y,
            },
            minHeight: 80,
            minWidth: 389,
        },
        LinkedIn: {
            default: {
                width: 800,
                height: 600,
                x: metadata.position.x,
                y: metadata.position.y,
            },
            minHeight: 80,
            minWidth: 700,
        },
        GitHub: {
            default: {
                width: 800,
                height: 600,
                x: metadata.position.x,
                y: metadata.position.y,
            },
            minHeight: 80,
            minWidth: 700,
        },
    };

    if (metadata.isMinimized) {
        return null;
    }

    return !isMobile ? (
        <Rnd
            {...defaultSettings[metadata.title]}
            className={`lg:absolute lg:ml-auto lg:mr-auto font-main border-t-white border-l-white
                border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col
                row-span-4 overflow-hidden`}
            onMouseDown={() => updateWindowZIndex(metadata.id)}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            style={{ position: "absolute", zIndex: metadata.zIndex }}
        >
            {content}
        </Rnd>
    ) : (
        <div
            className={`fixed max-h-[90%] w-full z-10 font-main border-t-white border-l-white
            border-2 sm:relative sm:item-center sm:justify-center col-span-full flex flex-col
            row-span-4 row-start-2 overflow-hidden top-1/2 left-1/2
            transform -translate-x-1/2 -translate-y-1/2`}
            onClick={() => updateWindowZIndex(metadata.id)}
        >
            {content}
        </div>
    );
};

export default Window;
