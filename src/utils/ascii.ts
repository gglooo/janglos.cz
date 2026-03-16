const getPixelBrightness = (
    r: number,
    g: number,
    b: number,
    a: number,
    redBrightnessFactor = 0.299,
    greenBrightnessFactor = 0.587,
    blueBrightnessFactor = 0.114,
    invertBrightness = false,
    contrastFactor = 1,
): number => {
    const adjustedR = Math.min(
        255,
        Math.max(0, (r - 128) * contrastFactor + 128),
    );
    const adjustedG = Math.min(
        255,
        Math.max(0, (g - 128) * contrastFactor + 128),
    );
    const adjustedB = Math.min(
        255,
        Math.max(0, (b - 128) * contrastFactor + 128),
    );

    const baseBrightness =
        (redBrightnessFactor * adjustedR +
            greenBrightnessFactor * adjustedG +
            blueBrightnessFactor * adjustedB) *
        (a / 255);

    const brightness = invertBrightness ? 255 - baseBrightness : baseBrightness;
    return brightness;
};

export const loadImageFromSrc = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Failed to load the image."));
        image.src = src;
    });

export const convertImageToAscii = (
    image: HTMLImageElement,
    width: number,
    redBrightnessFactor = 0.299,
    greenBrightnessFactor = 0.587,
    blueBrightnessFactor = 0.114,
    invertBrightness = false,
    contrastFactor = 1,
): string => {
    const canvas = document.createElement("canvas");
    const aspectRatio = image.height / image.width;
    canvas.width = width;
    canvas.height = width * aspectRatio;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Could not get canvas context");
    }

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const asciiChars = "@%#*+=-:. ";
    let asciiArt: string[][] = [];

    for (let y = 0; y < imageData.height; y++) {
        const asciiRow: string[] = [];
        for (let x = 0; x < imageData.width; x++) {
            const index = (y * imageData.width + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            const a = imageData.data[index + 3];

            const brightness = getPixelBrightness(
                r,
                g,
                b,
                a,
                redBrightnessFactor,
                greenBrightnessFactor,
                blueBrightnessFactor,
                invertBrightness,
                contrastFactor,
            );
            const charIndex = Math.floor(
                (brightness / 255) * (asciiChars.length - 1),
            );
            asciiRow.push(asciiChars[charIndex]);
        }
        asciiArt.push(asciiRow);
    }

    return asciiArt.map((row) => row.join("")).join("\n");
};
