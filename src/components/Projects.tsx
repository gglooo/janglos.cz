import React from "react";
import Project from "./Project";

export const Projects = () => {
    const projects = [
        {
            title: "Project manager desktop app",
            stack: ["C#", "MongoDB", "Avalonia", "Git"],
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam elementum urna ac arcu sodales aliquam.",
            image: "project1.jpg",
        },
        {
            title: "Web quiz application",
            stack: [
                "React",
                "Typescript",
                "Node.js",
                "TailwindCSS",
                "PostgreSQL",
                "Git",
                "Docker",
            ],
            description:
                "Nulla gravida scelerisque nulla in dapibus. Nulla tincidunt libero in felis congue aliquam.",
            image: "project2.jpg",
        },
        {
            title: "Work portfolio",
            stack: ["PHP", "HTML", "CSS", "Python"],
            description:
                "Fusce eget purus eleifend, malesuada lectus id, tincidunt ipsum. Integer iaculis mauris ut risus ullamcorper iaculis.",
            image: "project3.jpg",
        },
    ];

    return (
        <div className="flex flex-col gap-4 p-4 border">
            <h2 className="text-2xl font-semibold mb-2">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project, index) => (
                    <Project key={index} project={project} />
                ))}
            </div>
        </div>
    );
};

export default Projects;
