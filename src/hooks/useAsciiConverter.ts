import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { convertImageToAscii, loadImageFromSrc } from "../utils/ascii";

interface AsciiSettings {
    width: number;
    redBrightnessFactor: number;
    greenBrightnessFactor: number;
    blueBrightnessFactor: number;
    invertBrightness: boolean;
    contrastFactor: number;
}

const initialSettings: AsciiSettings = {
    width: 120,
    redBrightnessFactor: 0.299,
    greenBrightnessFactor: 0.587,
    blueBrightnessFactor: 0.114,
    invertBrightness: false,
    contrastFactor: 1,
};

interface UseAsciiConverterOptions {
    initialImageSrc?: string;
    initialFileName?: string;
    initialSettings?: Partial<AsciiSettings>;
}

interface SourceImageState {
    image: HTMLImageElement | null;
    sourceKey: string | null;
    fileName: string | null;
}

interface LoadSourceVariables {
    imageSrc: string;
    sourceKey: string;
    fileName?: string;
}

const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error("Unable to read image file."));
        reader.readAsDataURL(file);
    });

export const useAsciiConverter = (options?: UseAsciiConverterOptions) => {
    const [settings, setSettings] = useState<AsciiSettings>({
        ...initialSettings,
        ...(options?.initialSettings ?? {}),
    });
    const [manualError, setManualError] = useState<string | null>(null);
    const [source, setSource] = useState<SourceImageState>({
        image: null,
        sourceKey: null,
        fileName: null,
    });

    const loadSourceMutation = useMutation<
        { image: HTMLImageElement; sourceKey: string; fileName: string | null },
        Error,
        LoadSourceVariables
    >({
        mutationFn: async ({ imageSrc, sourceKey, fileName }) => {
            const image = await loadImageFromSrc(imageSrc);
            return {
                image,
                sourceKey,
                fileName: fileName ?? imageSrc.split("/").pop() ?? null,
            };
        },
        onSuccess: ({ image, sourceKey, fileName }) => {
            setSource({ image, sourceKey, fileName });
            setManualError(null);
        },
        onError: (error) => {
            setSource({ image: null, sourceKey: null, fileName: null });
            setManualError(error.message);
        },
    });

    const asciiQuery = useQuery<string>({
        queryKey: ["ascii-art", source.sourceKey, settings],
        enabled: Boolean(source.image && source.sourceKey),
        placeholderData: (previousData) => previousData,
        queryFn: () => {
            if (!source.image) {
                throw new Error("No image selected.");
            }

            return convertImageToAscii(
                source.image,
                settings.width,
                settings.redBrightnessFactor,
                settings.greenBrightnessFactor,
                settings.blueBrightnessFactor,
                settings.invertBrightness,
                settings.contrastFactor,
            );
        },
    });

    const updateSetting = useCallback(
        <K extends keyof AsciiSettings>(key: K, value: AsciiSettings[K]) => {
            setSettings((current) => ({ ...current, [key]: value }));
        },
        [],
    );

    const handleFileSelect = useCallback(async (file: File | null) => {
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setSource({ image: null, sourceKey: null, fileName: file.name });
            setManualError("Select a valid image file.");
            return;
        }

        try {
            const dataUrl = await readFileAsDataUrl(file);
            await loadSourceMutation.mutateAsync({
                imageSrc: dataUrl,
                sourceKey: `file:${file.name}:${file.size}:${file.lastModified}`,
                fileName: file.name,
            });
        } catch (loadError) {
            setSource({ image: null, sourceKey: null, fileName: file.name });
            setManualError(
                loadError instanceof Error
                    ? loadError.message
                    : "Failed to load the selected image.",
            );
        }
    }, [loadSourceMutation]);

    const loadImageFromAsset = useCallback(
        async (imageSrc: string, fileName?: string) => {
            try {
                await loadSourceMutation.mutateAsync({
                    imageSrc,
                    sourceKey: `asset:${imageSrc}`,
                    fileName,
                });
            } catch (loadError) {
                setSource({
                    image: null,
                    sourceKey: null,
                    fileName: fileName ?? imageSrc.split("/").pop() ?? null,
                });
                setManualError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Failed to load the selected image.",
                );
            }
        },
        [loadSourceMutation],
    );

    useEffect(() => {
        if (!options?.initialImageSrc) {
            return;
        }

        const initialSourceKey = `asset:${options.initialImageSrc}`;
        if (source.sourceKey === initialSourceKey) {
            return;
        }

        void loadImageFromAsset(options.initialImageSrc, options.initialFileName);
    }, [
        loadImageFromAsset,
        options?.initialFileName,
        options?.initialImageSrc,
        source.sourceKey,
    ]);

    const asciiArt = source.image ? (asciiQuery.data ?? "") : "";
    const error =
        manualError ??
        (asciiQuery.error instanceof Error
            ? asciiQuery.error.message
            : null);
    const isGenerating =
        loadSourceMutation.isPending ||
        (source.image ? asciiQuery.isFetching : false);

    return {
        asciiArt,
        error,
        handleFileSelect,
        loadImageFromAsset,
        isGenerating,
        selectedFileName: source.fileName,
        settings,
        updateSetting,
    };
};
