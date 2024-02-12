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
            nextIndex < 0 ? project.images.length - 1 : nextIndex
        );
    };

    const goToNextImage = () => {
        goToImage(1);
    };

    const goToPreviousImage = () => {
        goToImage(-1);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
            goToPreviousImage();
        } else if (event.key === "ArrowRight") {
            goToNextImage();
        } else if (event.key === "Escape") {
            closeModal();
        }
    };

    useEffect(() => {
        if (showModal) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showModal, goToPreviousImage, goToNextImage]);

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
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <div className="flex gap-x-3 flex-wrap border p-2 border-l-white border-t-white">
                    {project.stack.map((stack) => (
                        <span
                            className="bg-gray-200 text-gray-800 text-md rounded-full"
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
                        <h4 className="text-lg text-darker-grey">
                            Check this out at{" "}
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500 underline"
                            >
                                {project.url.split("www.")[1]}
                            </a>
                        </h4>
                    </button>
                ) : null}
                <p className="text-gray-800 text-lg mt-2">
                    {showFullDescription
                        ? project.description
                        : project.description.slice(0, 100) + "..."}
                </p>
                <button
                    className="text-darker-grey mt-2 underline focus:outline-none"
                    onClick={toggleDescription}
                >
                    {showFullDescription ? "View Less" : "View More"}
                </button>
            </div>
        </div>
    );
};

export default Project;
