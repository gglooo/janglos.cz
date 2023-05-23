import React from "react";

interface ProjectProps {
    project: {
        title: string;
        stack: string[];
        description: string;
        image: string;
    };
}

export const Project = ({ project }: ProjectProps) => {
    return (
        <div className="border border-l-white border-t-white border-r-2 border-b-2 p-4">
            <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <div className="flex gap-x-3 flex-wrap">
                {project.stack.map((stack, index) => (
                    <span
                        className="bg-gray-200 text-gray-800 text-sm rounded-full"
                        key={index}
                    >
                        {stack}
                    </span>
                ))}
            </div>
            <div className="border opacity-20"></div>
            <p className="text-gray-800">{project.description}</p>
        </div>
    );
};

export default Project;
