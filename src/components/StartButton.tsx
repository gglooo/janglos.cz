import { ContentType } from "../types/ContentType";

interface StartButtonProps {
    icon: string;
    name: ContentType;
    onClick: (event: any) => void;
}

export const StartButton = ({ icon, name, onClick }: StartButtonProps) => {
    return (
        <div
            className="flex flex-col hover:bg-blue hover:text-white py-3 pr-8 pl-2 select-none cursor-pointer"
            onClick={onClick}
        >
            <div className="grid grid-rows-1 grid-cols-2 items-center text-center">
                <div className="w-full h-full flex items-center justify-left">
                    <img src={icon} width={40}></img>
                </div>
                <div className="w-full h-full flex items-center justify-left">
                    <p className="first-letter:underline font-main text-xl ml-2">
                        {name}
                    </p>
                </div>
            </div>
        </div>
    );
};
