import { BootLine } from "../hooks/boot/bootConfig";

interface BootScreenProps {
    lines: BootLine[];
    visibleLineCount: number;
}

export const BootScreen = ({ lines, visibleLineCount }: BootScreenProps) => {
    return (
        <div className="h-full w-full bg-black text-white px-5 py-4 font-main text-2xl leading-7 select-none">
            <div className="max-w-245">
                {lines.slice(0, visibleLineCount).map((line, index) => (
                    <p key={`${index}-${line.text}`}>{line.text}</p>
                ))}
                <span className="inline-block h-5 w-3 align-middle bg-white animate-pulse" />
            </div>
        </div>
    );
};

export default BootScreen;
