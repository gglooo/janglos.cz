import React, { useCallback, useEffect, useRef, useState } from "react";

interface WindowProps {
    children?: React.ReactNode;
    title: string;
    onClose: () => void;
    initialPosition: { x: number; y: number };
}

export const Window = ({
    children,
    title,
    onClose,
    initialPosition,
}: WindowProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { x, y } = initialPosition;
        const windowElement = elementRef.current;

        if (windowElement) {
            windowElement.style.left = `${x}px`;
            windowElement.style.top = `${y}px`;
        }
    }, [position]);

    const onMouseDown = useCallback(
        (event: any) => {
            const onMouseMove = (event: MouseEvent) => {
                position.x += event.movementX;
                position.y += event.movementY;
                const element = elementRef.current;
                if (element) {
                    element.style.transform = `translate(${position.x}px, ${position.y}px)`;
                }
                setPosition(position);
            };
            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [position, setPosition, elementRef]
    );

    return (
        <div
            className={
                "absolute z-0 ml-auto mr-auto font-main border-t-white border-l-white border-2 flex flex-col"
            }
            ref={elementRef}
            onMouseDown={onMouseDown}
        >
            <div className="bg-blue w-full border-b border-b-black text-left flex items-center">
                <h1 className="text-xl text-white mr-4 ml-2 select-none">
                    {title}
                </h1>
                <a
                    onClick={onClose}
                    className="border-t-white border-l-white border-2 ml-auto bg-window mr-2 mt-1 pr-2 pl-2 mb-1 text-center flex justify-center items-center hover:bg-grey hover:cursor-pointer"
                >
                    <span>X</span>
                </a>
            </div>
            <div className="flex flex-col bg-window font-main p-2 w-full">
                <div className="flex gap-5 border border-r-white border-b-white p-1 pt-0 pb-0 text-xl">
                    {(() => {
                        const tabs = [
                            "Education",
                            "About me",
                            "Projects",
                            "Experience",
                        ];

                        return tabs.map((tab) => (
                            <h2
                                className={
                                    (title == tab ? "underline" : "") +
                                    " first-letter:underline"
                                }
                            >
                                {tab}
                            </h2>
                        ));
                    })()}
                </div>
                {children}
            </div>
        </div>
    );
};

export default Window;
