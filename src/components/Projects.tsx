import brainbyte from "../assets/brainbyte.png";
import gatepass from "../assets/gatepass.png";
import gatepass2 from "../assets/gatepass2.png";
import gatepass3 from "../assets/gatepass3.png";
import gatepass4 from "../assets/gatepass4.png";
import gatepass5 from "../assets/gatepass5.png";
import gatepass6 from "../assets/gatepass6.png";
import gitlab from "../assets/gitlab.png";
import karlos from "../assets/karlos.png";
import pv178 from "../assets/pv178.png";
import win95 from "../assets/win95.png";
import Project from "./Project";

const projects: Project[] = [
    {
        title: "Reservation and ticketing system",
        stack: [
            "React",
            "React Native",
            "TypeScript",
            "Node.js",
            "MySQL",
            "Git",
            "Express",
            "nodemailer",
            "bash",
        ],
        description:
            "My largest project so far. I created a reservation and ticketing system for friends at my high school who were organizing a big school ball. The system was created to make buying tickets online less complicated and to make the whole process more efficient. It offers a simple customer form for reserving tickets and a user-friendly admin dashboard and overview of all reservations. The admins can then manage and confirm reservations. It also offers some basic statistics to help the organizers. After succesful payment the customer received a QR code which was then scanned at the entrance by a scanner app developed by me in React Native. The system was used in production from December 2023 to February 2024 and had almost 300 reservations and 420 tickets sold. The scanner app at the entrance scanned 400 QR codes without issues. I wrote both the backend and frontend in TypeScript and used MySQL as a database. I also created a bash script to automate the deployment of the system. I plan to expand on this project and offer it to other schools in my area.",
        images: [
            gatepass,
            gatepass2,
            gatepass3,
            gatepass4,
            gatepass5,
            gatepass6,
        ],
        url: "https://www.ples.janglos.cz",
    },
    {
        title: "Project manager desktop app",
        stack: ["C#", "MongoDB", "Avalonia", "Git"],
        description:
            "A platform for creating and managing multiple projects with collaborative users and tasks. All data is stored in the cloud to provide users with seamless project access. Tasks can further be categorized, filtered, assigned to many different users, edited or deleted. I learned a lot about Avalonia and how it works, even though it was a struggle at the beginning. Persisting and learning this framework was definitely worth it.",
        images: [pv178],
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
        images: [brainbyte],
    },
    {
        title: "Steel structures portfolio",
        stack: ["PHP", "HTML", "CSS", "Python"],
        description:
            "One of my first projects – I created a website for a customer, which displays models of steel structures. It was mainly focused on the ease of adding new content to the website which I achieved by dynamically generating the content from a filesystem. I also created a script in Python which translated important IFC data into a json file.",
        images: [karlos],
        url: "http://www.ok.9e.cz",
    },
    {
        title: "Windows95 themed portfolio",
        stack: ["TypeScript", "React", "TailwindCSS", "Git", "Vite"],
        description:
            "This is the portfolio you are viewing right now. I put emphasis on retro visuals which take you back to the 90s. The main focus was to make the website as intuitive as possible - eg. when you see a bin icon, you can throw stuff into it, then take it out etc. Every window is draggable and resizable, each icon can be dragged and dropped anywhere on the desktop. Real Brno weather data is fetched from an API and displayed in my Weather widget. The website is responsive and should work on mobile devices as well.",
        images: [win95],
    },
    {
        title: "CI/CD pipeline for React Native apps",
        stack: ["Python", "bash", "fastlane", "GitLab CI/CD", "Expo"],
        description:
            "As my bachelor thesis, I decided to streamline the process of building and deploying applications in the company I work for. I created a CI/CD pipeline which automatically builds and deploys React Native applications. The pipeline comes with a comprehensive configuration script that handles most of the work needed to set up the pipeline. It is currently being used to build and deploy large scale production applications.",
        images: [gitlab],
    },
];

export const Projects = () => {
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
