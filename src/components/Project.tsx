import { useEffect, useState } from "react";

export interface Project {
    title: string;
    stack: string[];
    description: string;
    images: string[];
    url?: string;
    onClick?: () => void;
}

interface ProjectProps {
    project: Project;
}

export const Project = ({ project }: ProjectProps) => {
    const [showModal, setShowModal] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const currentImage = project.images[currentImageIndex];

    const toggleDescription = () => {
        setShowFullDescription((prevState) => !prevState);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setCurrentImageIndex(0);
        setShowModal(false);
    };

    const goToImage = (number: 1 | -1) => {
        const nextIndex = (currentImageIndex + number) % project.images.length;
        setCurrentImageIndex(
            nextIndex < 0 ? project.images.length - 1 : nextIndex,
        );
    };

    const goToNextImage = () => {
        goToImage(1);
    };

    const goToPreviousImage = () => {
        goToImage(-1);
    };

    useEffect(() => {
        if (!showModal) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                setCurrentImageIndex((prev) =>
                    prev === 0 ? project.images.length - 1 : prev - 1,
                );
            } else if (event.key === "ArrowRight") {
                setCurrentImageIndex((prev) =>
                    prev === project.images.length - 1 ? 0 : prev + 1,
                );
            } else if (event.key === "Escape") {
                setCurrentImageIndex(0);
                setShowModal(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showModal, project.images.length]);

    return (
        <div className="border border-l-white border-t-white border-r-2 border-b-2 p-4">
            {project.images.length > 0 ? (
                <div>
                    <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full rounded-lg mb-4 cursor-pointer"
                        onClick={project.onClick ?? openModal}
                    />
                    {showModal ? (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div
                                className="bg-black bg-opacity-50 absolute inset-0"
                                onClick={closeModal}
                            />
                            <div className="max-w-6xl p-2 bg-white z-10">
                                <img
                                    src={currentImage}
                                    alt={project.title}
                                    className="w-full rounded-lg"
                                />
                            </div>
                            {project.images.length > 1 ? (
                                <>
                                    <button
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-black p-4 z-20 text-[40px]"
                                        onClick={goToPreviousImage}
                                    >
                                        {"<"}
                                    </button>
                                    <button
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-black p-4 z-20 text-[40px]"
                                        onClick={goToNextImage}
                                    >
                                        {">"}
                                    </button>
                                </>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            ) : null}
            <div className="border p-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 leading-snug text-black">
                    {project.title}
                </h3>
                <div className="flex gap-x-3 flex-wrap border p-2 border-l-white border-t-white">
                    {project.stack.map((stack) => (
                        <span
                            className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-[2px] rounded-full"
                            // the stack should be unique
                            key={stack}
                        >
                            {stack}
                        </span>
                    ))}
                </div>
                {project.url ? (
                    <button
                        className="flex flex-row items-center border border-l-white border-t-white border-r-2 border-b-2  justify-start mt-2 px-2 py-1 w-full"
                        onClick={() => window.open(project.url)}
                    >
                        <h4 className="text-sm text-darker-grey font-medium">
                            Check this out at{" "}
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#0b4da3] underline"
                            >
                                {project.url.split("www.")[1]}
                            </a>
                        </h4>
                    </button>
                ) : null}
                <p className="text-black text-[15px] leading-6 mt-3 font-normal">
                    {showFullDescription
                        ? project.description
                        : project.description.slice(0, 100) + "..."}
                </p>
                <button
                    className="text-darker-grey mt-2 underline text-sm font-medium focus:outline-none"
                    onClick={toggleDescription}
                >
                    {showFullDescription ? "View Less" : "View More"}
                </button>
            </div>
        </div>
    );
};

export default Project;
