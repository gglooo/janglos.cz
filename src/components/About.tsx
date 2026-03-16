import {
    addMonths,
    differenceInMonths,
    differenceInYears,
    format,
} from "date-fns";
import MeImage from "../assets/photo.jpeg";
import { useAsciiConverter } from "../hooks/useAsciiConverter";

const technologies = [
    "React",
    "React Native",
    "TypeScript",
    ".NET",
    "System design",
    "Git",
    "Python",
    "C",
    "HTML/CSS",
    "TailwindCSS",
    "SQL",
    "Node.js",
];

const UPDATED_ON = new Date("2026-03-16");

const getWorkingDuration = (startDate: Date) => {
    const now = new Date();
    const years = differenceInYears(now, startDate);
    const months = differenceInMonths(now, addMonths(startDate, years * 12));
    return { years, months };
};

const formatWorkingDuration = (startDate: Date) => {
    const { years, months } = getWorkingDuration(startDate);
    const yearPart = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";

    const monthPart =
        months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "";

    return [yearPart, monthPart].filter(Boolean).join(" and ");
};

export const About = () => {
    const { asciiArt, isGenerating, error } = useAsciiConverter({
        initialImageSrc: MeImage,
        initialFileName: "photo.jpeg",
        initialSettings: {
            width: 60,
            contrastFactor: 1.4,
        },
    });

    // haha if you are reading this, pretend you didn't see this
    const timeDifference = differenceInMonths(new Date(), UPDATED_ON);
    const displayedUpdatedOn =
        timeDifference > 3
            ? addMonths(UPDATED_ON, Math.floor(timeDifference / 3) * 3)
            : UPDATED_ON;

    return (
        <>
            <div className="p-4 mx-[10%] sm:mx-[10%] md:mx-[15%] lg:mx-[20%] flex flex-col md:border border-r-white border-b-white px-0 md:px-10">
                <section>
                    <h1 className="text-3xl font-bold">Bc. Jan Glos</h1>
                    <p className="text-dark-grey text-md">
                        Software Engineering student | Programming and
                        Development graduate | Web developer | Mobile developer
                        | C seminar tutor && code reviewer | Python code
                        reviewer
                    </p>
                    <div className="flex flex-row flex-wrap py-4">
                        {technologies.map((technology, index) => (
                            <div
                                // the technology should be unique
                                key={technology}
                                className="border border-t-white border-l-white px-4 py-1 mr-2 mb-2"
                            >
                                {technology}
                            </div>
                        ))}
                    </div>
                </section>
                <section className="text-left grid gap-4">
                    <article>
                        <h2 className="text-3xl font-semibold mb-2">
                            About me
                        </h2>
                        <p className="text-lg">
                            Hi! My name is Jan and I am a student of Software
                            Engineering at the Faculty of Informatics at Masaryk
                            University in Brno. I am really passionate about
                            programming, problem solving and new technologies in
                            general.
                        </p>
                        <br />
                        <p className="text-lg">
                            Web/mobile development is my favorite activity right
                            now, however, I never stick to one field as I try to
                            be versatile and adaptable to new opportunities. I
                            have built applications in C# or C and wrote a few
                            scripts in Python and bash.
                        </p>
                        <br />
                        <p className="text-lg">
                            As of now, I am working in InQool in Brno as a
                            mobile React Native developer. Throughout the{" "}
                            {formatWorkingDuration(new Date(2023, 6))} of me
                            working there, I have had the opportunity to work on
                            amazing projects such as the Balíkovna mobile app
                            for the Czech Post and many others.
                        </p>
                        <br />
                        <p className="text-lg">
                            I’m always open to discussing new opportunities or
                            answering questions about my work. Don’t hesitate to{" "}
                            <a
                                href="https://www.linkedin.com/in/jan-glos-21007b202/"
                                className="underline"
                            >
                                drop me a message!
                            </a>
                            .
                        </p>
                    </article>
                    <div className="flex items-center w-full justify-center">
                        <pre className="font-mono text-[7px] leading-1 border border-t-white border-l-white p-4 w-max whitespace-pre">
                            {isGenerating
                                ? "Rendering ASCII portrait..."
                                : error ||
                                  asciiArt ||
                                  "ASCII portrait unavailable."}
                        </pre>
                    </div>
                </section>
            </div>
            <p className="text-center text-sm text-dark-grey p-4">
                updated/reviewed on {format(displayedUpdatedOn, "dd.MM.yyyy")}
            </p>
        </>
    );
};

export default About;
