import React from "react";
import Project from "./Project";
import pv178 from "../assets/pv178.png";
import brainbyte from "../assets/brainbyte.png";
import karlos from "../assets/karlos.png";

export const Projects = () => {
    const projects = [
        {
            title: "Project manager desktop app",
            stack: ["C#", "MongoDB", "Avalonia", "Git"],
            description:
                "A school project – you can create your own unique projects, invite others to collaborate, assign tasks to them and manage the progress of the project all in one place.",
            image: pv178,
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
                "Project in a team of 4 people – Kahoot clone. I contributed to both frontend and backend parts of this project. I really cherish the experience I gained with using websockets, as it was something I had never done before.",
            image: brainbyte,
        },
        {
            title: "Steel structures portfolio",
            stack: ["PHP", "HTML", "CSS", "Python"],
            description:
                "One of my first projects – I created a website for a customer, which displays models of steel structures. It was mainly focused on the ease of adding new content to the website which I achieved by dynamically generating the content from a filesystem. I also created a script in Python which translated important IFC data into a json.",
            image: karlos,
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
