import React, { useState } from "react";

interface ProjectProps {
    project: {
        title: string;
        stack: string[];
        description: string;
        image?: string;
    };
}

export const Project = ({ project }: ProjectProps) => {
    const [showModal, setShowModal] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription((prevState) => !prevState);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    return (
        <div className="border border-l-white border-t-white border-r-2 border-b-2 p-4">
            {project.image && (
                <div>
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full rounded-lg mb-4 cursor-pointer"
                        onClick={openModal}
                    />
                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div
                                className="bg-black bg-opacity-50 absolute inset-0"
                                onClick={closeModal}
                            />
                            <div className="max-w-6xl p-2 bg-white z-10">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full rounded-lg"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="border p-4">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <div className="flex gap-x-3 flex-wrap border p-2 border-l-white border-t-white">
                    {project.stack.map((stack, index) => (
                        <span
                            className="bg-gray-200 text-gray-800 text-md rounded-full"
                            key={index}
                        >
                            {stack}
                        </span>
                    ))}
                </div>
                <p className="text-gray-800 text-lg mt-2">
                    {showFullDescription
                        ? project.description
                        : project.description.slice(0, 100) + "..."}
                </p>
                <button
                    className="text-grey mt-2 underline focus:outline-none"
                    onClick={toggleDescription}
                >
                    {showFullDescription ? "View Less" : "View More"}
                </button>
            </div>
        </div>
    );
};

export default Project;
