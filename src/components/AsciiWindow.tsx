import { useRef } from "react";
import { useAsciiConverter } from "../hooks/useAsciiConverter";

const win95ButtonClass =
    "h-8 px-3 bg-window border-2 border-t-white border-l-white border-r-black border-b-black " +
    "active:border-t-black active:border-l-black active:border-r-white active:border-b-white " +
    "font-main text-base";

const sliderClass = "w-full accent-black h-4 cursor-pointer bg-transparent";

export const AsciiWindow = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const {
        asciiArt,
        error,
        handleFileSelect,
        isGenerating,
        selectedFileName,
        settings,
        updateSetting,
    } = useAsciiConverter();
    const hasAsciiOutput = asciiArt.trim().length > 0;

    const getExportBaseName = () => {
        if (!selectedFileName) {
            return "ascii-art";
        }

        return selectedFileName.replace(/\.[^/.]+$/, "");
    };

    const triggerDownload = (href: string, fileName: string) => {
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName;
        link.click();
    };

    const handleExportTxt = () => {
        if (!hasAsciiOutput) {
            return;
        }

        const fileName = `${getExportBaseName()}.txt`;
        const blob = new Blob([asciiArt], { type: "text/plain;charset=utf-8" });
        const objectUrl = URL.createObjectURL(blob);
        triggerDownload(objectUrl, fileName);
        URL.revokeObjectURL(objectUrl);
    };

    return (
        <section className="h-full flex flex-col gap-2 p-2 border">
            <div className="flex items-center gap-2">
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                        void handleFileSelect(event.target.files?.[0] ?? null);
                        event.currentTarget.value = "";
                    }}
                />
                <button
                    type="button"
                    className={win95ButtonClass}
                    onClick={() => inputRef.current?.click()}
                >
                    Upload Image...
                </button>
                <span className="font-main text-base truncate">
                    {selectedFileName ?? "No file selected"}
                </span>
                {hasAsciiOutput && (
                    <button
                        type="button"
                        className={win95ButtonClass}
                        onClick={handleExportTxt}
                        disabled={!hasAsciiOutput || isGenerating}
                    >
                        Export TXT
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <label className="font-main text-base flex flex-col gap-1">
                    Width: {settings.width}
                    <input
                        type="range"
                        min={40}
                        max={240}
                        step={1}
                        value={settings.width}
                        className={sliderClass}
                        onChange={(event) =>
                            updateSetting("width", Number(event.target.value))
                        }
                    />
                </label>
                <label className="font-main text-base flex flex-col gap-1">
                    Contrast: {settings.contrastFactor}
                    <input
                        type="range"
                        min={0}
                        max={10}
                        step={0.001}
                        value={settings.contrastFactor}
                        className={sliderClass}
                        onChange={(event) =>
                            updateSetting(
                                "contrastFactor",
                                Number(event.target.value),
                            )
                        }
                    />
                </label>
                <label className="font-main text-base flex flex-col gap-1">
                    Red factor: {settings.redBrightnessFactor.toFixed(3)}
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.001}
                        value={settings.redBrightnessFactor}
                        className={sliderClass}
                        onChange={(event) =>
                            updateSetting(
                                "redBrightnessFactor",
                                Number(event.target.value),
                            )
                        }
                    />
                </label>
                <label className="font-main text-base flex flex-col gap-1">
                    Green factor: {settings.greenBrightnessFactor.toFixed(3)}
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.001}
                        value={settings.greenBrightnessFactor}
                        className={sliderClass}
                        onChange={(event) =>
                            updateSetting(
                                "greenBrightnessFactor",
                                Number(event.target.value),
                            )
                        }
                    />
                </label>
                <label className="font-main text-base flex flex-col gap-1">
                    Blue factor: {settings.blueBrightnessFactor.toFixed(3)}
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.001}
                        value={settings.blueBrightnessFactor}
                        className={sliderClass}
                        onChange={(event) =>
                            updateSetting(
                                "blueBrightnessFactor",
                                Number(event.target.value),
                            )
                        }
                    />
                </label>
            </div>

            <label className="font-main text-base inline-flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={settings.invertBrightness}
                    onChange={(event) =>
                        updateSetting("invertBrightness", event.target.checked)
                    }
                    className="size-4 border-2 border-t-black border-l-black border-r-white border-b-white bg-white"
                />
                Invert brightness
            </label>

            {error ? (
                <p className="font-main text-base text-red-700">{error}</p>
            ) : null}
            {isGenerating && !hasAsciiOutput ? (
                <p className="font-main text-base">
                    Rendering ASCII preview...
                </p>
            ) : null}

            <div className="flex-1 min-h-0 border-2 border-t-black border-l-black border-r-white border-b-white bg-white p-2 overflow-auto">
                <pre className="font-mono text-[8px] leading-1.25 whitespace-pre">
                    {asciiArt || "Upload an image to generate ASCII art."}
                </pre>
            </div>
        </section>
    );
};
