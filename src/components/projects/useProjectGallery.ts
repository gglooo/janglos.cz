import { useCallback, useEffect, useState } from "react";

export const useProjectGallery = (images: string[]) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        setActiveImageIndex(0);
    }, [images]);

    const totalImages = images.length;

    const goToNext = useCallback(() => {
        if (totalImages <= 1) {
            return;
        }
        setActiveImageIndex((prev) => (prev + 1) % totalImages);
    }, [totalImages]);

    const goToPrevious = useCallback(() => {
        if (totalImages <= 1) {
            return;
        }
        setActiveImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    }, [totalImages]);

    const setIndex = useCallback(
        (index: number) => {
            if (index < 0 || index >= totalImages) {
                return;
            }
            setActiveImageIndex(index);
        },
        [totalImages],
    );

    return {
        activeImageIndex,
        activeImage: images[activeImageIndex],
        hasMultipleImages: totalImages > 1,
        setIndex,
        goToNext,
        goToPrevious,
    };
};
