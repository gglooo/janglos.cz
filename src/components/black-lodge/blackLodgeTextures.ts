import {
    CanvasTexture,
    ClampToEdgeWrapping,
    LinearFilter,
    NearestFilter,
    RepeatWrapping,
    SRGBColorSpace,
} from "three";

const createTextureCanvas = (width: number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
};

const wrapModulo = (value: number, size: number) =>
    ((value % size) + size) % size;

export const createCurtainTexture = () => {
    const canvas = createTextureCanvas(1024, 1024);
    const context = canvas.getContext("2d");
    if (!context) {
        return null;
    }

    context.fillStyle = "#a12642";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const vignette = context.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.08,
        canvas.width * 0.06,
        canvas.width * 0.5,
        canvas.height * 0.08,
        canvas.width * 0.48,
    );
    vignette.addColorStop(0, "rgba(255,255,255,0.1)");
    vignette.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = vignette;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const curtainPixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
    );
    const data = curtainPixels.data;
    const foldCount = 3;
    const microFoldFrequency = (Math.PI * 2 * 43) / canvas.width;

    for (let y = 0; y < canvas.height; y += 1) {
        const topLight = (1 - y / canvas.height) * 0.22;
        const lowerFalloff = y / canvas.height;

        for (let x = 0; x < canvas.width; x += 1) {
            const foldFrequency =
                (Math.PI * 2 * (Math.floor(Math.random() * foldCount) + 1)) /
                canvas.width;

            const index = (y * canvas.width + x) * 4;
            const foldWave = Math.sin(x * foldFrequency);
            const microWave = Math.sin(x * microFoldFrequency + y * 0.0032);
            const deterministicNoise =
                ((((x * 73) ^ (y * 151)) & 255) / 255 - 0.5) * 0.03;
            const foldShade =
                foldWave * 0.15 +
                microWave * 0.045 +
                topLight -
                lowerFalloff * 0.04 +
                deterministicNoise;
            const brightness = 1 + foldShade;
            data[index] = Math.max(
                0,
                Math.min(255, data[index] * (brightness + 0.012)),
            );
            data[index + 1] = Math.max(
                0,
                Math.min(255, data[index + 1] * (brightness + 0.004)),
            );
            data[index + 2] = Math.max(
                0,
                Math.min(255, data[index + 2] * (brightness - 0.012)),
            );
        }
    }
    context.putImageData(curtainPixels, 0, 0);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.repeat.set(8, 1);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
    return texture;
};

export const createCheckerFloorTexture = () => {
    const canvas = createTextureCanvas(1024, 1024);
    const context = canvas.getContext("2d");
    if (!context) {
        return null;
    }

    const floorPixels = context.createImageData(canvas.width, canvas.height);
    const data = floorPixels.data;
    const zigzagPeriod = 256;
    const bandHeight = 64;
    const zigzagAmplitude = 52;

    for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
            const phase = wrapModulo(x, zigzagPeriod) / zigzagPeriod;
            const triangleWave = 1 - Math.abs(phase * 2 - 1);
            const offset = (triangleWave * 2 - 1) * zigzagAmplitude;
            const yWithOffset = y - offset;
            const band = Math.floor(yWithOffset / bandHeight);
            const isWhiteBand = wrapModulo(band, 2) === 0;
            const color = isWhiteBand ? 248 : 5;
            const index = (y * canvas.width + x) * 4;
            data[index] = color;
            data[index + 1] = color;
            data[index + 2] = color;
            data[index + 3] = 255;
        }
    }
    context.putImageData(floorPixels, 0, 0);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(2.1, 2.1);
    texture.minFilter = LinearFilter;
    texture.magFilter = NearestFilter;
    texture.needsUpdate = true;
    return texture;
};
