import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useRunCommand } from "../hooks/useRunCommand";

interface RunWindowProps {
    onClose: () => void;
}

export const RunWindow = ({ onClose }: RunWindowProps) => {
    const { execute, commands } = useRunCommand();
    const [command, setCommand] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const normalizedCommand = command.trim().toLowerCase();
    const filteredCommands = commands.filter((item) =>
        normalizedCommand ? item.startsWith(normalizedCommand) : true,
    );

    const applyCommand = (value: string) => {
        setCommand(value);
        setActiveIndex(0);
        setIsSuggestionsOpen(false);
        if (error) {
            setError(null);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = execute(command);

        if (!result.ok) {
            setError(result.error);
            return;
        }

        setError(null);
        onClose();
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setIsSuggestionsOpen(false);
            return;
        }

        if (!filteredCommands.length) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setIsSuggestionsOpen(true);
            setActiveIndex(
                (prevIndex) => (prevIndex + 1) % filteredCommands.length,
            );
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setIsSuggestionsOpen(true);
            setActiveIndex(
                (prevIndex) =>
                    (prevIndex - 1 + filteredCommands.length) %
                    filteredCommands.length,
            );
            return;
        }

        if (event.key === "Enter" && isSuggestionsOpen) {
            const selected = filteredCommands[activeIndex];
            if (selected) {
                event.preventDefault();
                applyCommand(selected);
            }
        }
    };

    return (
        <form
            className="px-1 py-1 flex flex-col gap-2 border flex-1 h-full"
            onSubmit={handleSubmit}
        >
            <p className="font-main text-base">
                Type the name of a program and Windows will open it for you.
            </p>
            <label htmlFor="run-command-input" className="font-main text-base">
                Open:
            </label>
            <div className="relative">
                <input
                    id="run-command-input"
                    type="text"
                    value={command}
                    onChange={(event) => {
                        setCommand(event.target.value);
                        setIsSuggestionsOpen(true);
                        setActiveIndex(0);
                        if (error) {
                            setError(null);
                        }
                    }}
                    onFocus={() => {
                        setIsSuggestionsOpen(true);
                        setActiveIndex(0);
                    }}
                    onBlur={() => {
                        setTimeout(() => setIsSuggestionsOpen(false), 0);
                    }}
                    onKeyDown={handleInputKeyDown}
                    className="h-9 w-full px-2 bg-white border-2 border-t-black border-l-black border-r-white border-b-white font-main text-base outline-none"
                    autoComplete="off"
                    spellCheck={false}
                    autoFocus
                    aria-autocomplete="list"
                    aria-expanded={
                        isSuggestionsOpen && filteredCommands.length > 0
                            ? "true"
                            : "false"
                    }
                    aria-controls="run-command-suggestions"
                />
                {isSuggestionsOpen && filteredCommands.length > 0 ? (
                    <div
                        id="run-command-suggestions"
                        role="listbox"
                        className="absolute z-20 mt-1 w-full max-h-40 overflow-y-auto bg-window border-2 border-t-white border-l-white border-r-black border-b-black p-[2px]"
                    >
                        {filteredCommands.map((item, index) => (
                            <button
                                key={item}
                                type="button"
                                role="option"
                                aria-selected={activeIndex === index}
                                onMouseDown={(event) => event.preventDefault()}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => applyCommand(item)}
                                className={
                                    "w-full px-2 py-[2px] text-left font-main text-base " +
                                    (activeIndex === index
                                        ? "bg-blue text-white"
                                        : "bg-window text-black")
                                }
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>
            <p className="font-main text-base">
                Available commands: {commands.join(", ")}
            </p>
            {error ? (
                <p className="font-main text-base text-red-700">{error}</p>
            ) : null}
            <div className="ml-auto flex items-center gap-2">
                <button
                    type="submit"
                    className="min-w-[72px] h-8 px-3 bg-window border-2 border-t-white border-l-white border-r-black border-b-black font-main text-base"
                >
                    OK
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="min-w-[72px] h-8 px-3 bg-window border-2 border-t-white border-l-white border-r-black border-b-black font-main text-base"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};
