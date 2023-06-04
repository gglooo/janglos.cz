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
                "A school project which allows a user to create any number of projects in which the user can manage tasks for that project and users that collaborate with them on this project. All of the data is stored in the cloud so the app offers seamless access to your projects. Tasks can further be categorized, filtered, assigned to many different users, edited or deleted. I learned a lot about Avalonia and how it works, even though it was a struggle at the beginning. Persisting and learning this framework was definitely worth it.",
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
                "Project in a team of 4 people – Kahoot clone. I contributed to both frontend and backend parts of this project. I really cherish that I gained a good amount of experience working with TypeScript and React on this project. I also learned how to work in a team and collaborate / communicate with each other to achieve common goals.",
            image: brainbyte,
        },
        {
            title: "Steel structures portfolio",
            stack: ["PHP", "HTML", "CSS", "Python"],
            description:
                "One of my first projects – I created a website for a customer, which displays models of steel structures. It was mainly focused on the ease of adding new content to the website which I achieved by dynamically generating the content from a filesystem. I also created a script in Python which translated important IFC data into a json file.",
            image: karlos,
            onClick: () => window.open("http://www.ok.9e.cz/"),
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
