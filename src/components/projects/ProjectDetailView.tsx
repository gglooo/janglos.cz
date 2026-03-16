import { useEffect } from "react";
import { StackBadge } from "./StackBadge";
import type { Project } from "./types";
import { useProjectGallery } from "./useProjectGallery";

interface ProjectDetailViewProps {
    project: Project;
    onBack: () => void;
}

export const ProjectDetailView = ({
    project,
    onBack,
}: ProjectDetailViewProps) => {
    const {
        activeImage,
        activeImageIndex,
        hasMultipleImages,
        setIndex,
        goToNext,
        goToPrevious,
    } = useProjectGallery(project.images);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onBack();
                return;
            }

            if (event.key === "ArrowLeft") {
                goToPrevious();
                return;
            }

            if (event.key === "ArrowRight") {
                goToNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [goToNext, goToPrevious, onBack]);

    return (
        <div className="flex flex-col gap-4 border p-3 sm:p-4 bg-window">
            <div className="flex flex-wrap items-center gap-2 border border-r-white border-b-white p-2 bg-[#d4d0c8]">
                <button
                    type="button"
                    onClick={onBack}
                    className="h-7 px-2 border border-l-white border-t-white border-r-2 border-b-2 text-xs font-medium bg-window hover:bg-[#d8d8d8] active:border-r-white active:border-b-white active:border-l-black active:border-t-black"
                >
                    {"< Back"}
                </button>
                <h3 className="text-base sm:text-lg font-semibold text-black leading-tight">
                    {project.title}
                </h3>
                {project.url ? (
                    <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto h-7 px-2 py-1 text-xs text-[#0b3f7f] underline border border-l-white border-t-white border-r-2 border-b-2"
                    >
                        Open live site
                    </a>
                ) : null}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)] gap-4">
                <div className="border p-2 bg-[#cfcfcf]">
                    <div className="relative flex h-[320px] w-full items-center justify-center border border-l-white border-t-white border-r-[#7f7f7f] border-b-[#7f7f7f] overflow-hidden bg-[#cfcfcf] p-2 sm:h-[380px] lg:h-[420px]">
                        <img
                            src={activeImage}
                            alt={`${project.title} preview ${activeImageIndex + 1}`}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    {hasMultipleImages ? (
                        <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
                            <button
                                type="button"
                                className="w-16 px-3 py-1 border border-l-white border-t-white border-r-2 border-b-2 bg-window text-sm shrink-0"
                                onClick={goToPrevious}
                            >
                                Prev
                            </button>
                            <div className="min-w-0">
                                <div className="flex gap-1 overflow-x-auto pb-1">
                                    {project.images.map((image, index) => (
                                        <button
                                            type="button"
                                            key={image}
                                            onClick={() => setIndex(index)}
                                            className={
                                                "relative h-10 w-14 border bg-[#cfcfcf] shrink-0 overflow-hidden " +
                                                (index === activeImageIndex
                                                    ? "border-[#0b3f7f] shadow-[inset_0_0_0_1px_#0b3f7f]"
                                                    : "border-[#7f7f7f]")
                                            }
                                        >
                                            <img
                                                src={image}
                                                alt={`${project.title} thumbnail ${index + 1}`}
                                                className="h-full w-full object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="w-16 px-3 py-1 border border-l-white border-t-white border-r-2 border-b-2 bg-window text-sm shrink-0"
                                onClick={goToNext}
                            >
                                Next
                            </button>
                        </div>
                    ) : null}
                </div>

                <div className="border p-3 bg-[#e3e3e3]">
                    <div className="mb-2 border border-l-white border-t-white border-r-[#7f7f7f] border-b-[#7f7f7f] bg-[#d8d8d8] px-2 py-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider">
                            Tech stack
                        </h4>
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                        {project.stack.map((stackItem) => (
                            <StackBadge
                                key={stackItem}
                                label={stackItem}
                                variant="pressed"
                            />
                        ))}
                    </div>
                    <div className="mb-2 border border-l-white border-t-white border-r-[#7f7f7f] border-b-[#7f7f7f] bg-[#d8d8d8] px-2 py-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1f2f49]">
                            Description
                        </h4>
                    </div>
                    <p className="text-[15px] leading-6 text-black">
                        {project.description}
                    </p>
                </div>
            </div>
        </div>
    );
};
