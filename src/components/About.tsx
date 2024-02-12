import { addMonths, differenceInMonths, format } from "date-fns";

const technologies = [
    "React",
    "React Native",
    "TypeScript",
    "Prisma",
    "Git",
    "Python",
    "C",
    "C#",
    "HTML/CSS",
    "TailwindCSS",
    "SQL",
    "Node.js",
];

const UPDATED_ON = new Date("2024-02-12");

export const About = () => {
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
                    <h1 className="text-3xl font-bold">Jan Glos</h1>
                    <p className="text-dark-grey text-md">
                        Programming and Development student | Web developer |
                        Mobile developer | C seminar tutor && code reviewer |
                        Python code reviewer
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
                            Hi! My name is Jan and I am a student of Programming
                            and Development at the Faculty of Informatics at
                            Masaryk University in Brno. I have recently started
                            doing the third year of my studies. I am really
                            passionate about programming, problem solving and
                            new technologies in general.
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
                            {differenceInMonths(new Date(), new Date(2023, 6))}{" "}
                            months of me working there, I have had the
                            opportunity to work on amazing projects such as the
                            Balíkovna mobile app for the Czech Post and many
                            others.
                        </p>
                        <br />
                        <p className="text-lg">
                            I am not currently actively looking for a job offer.
                            However, if you think your proposal might sound
                            interesting to me or if you have any questions do
                            not hesitate to{" "}
                            <a
                                href="https://www.linkedin.com/in/jan-glos-21007b202/"
                                className="underline"
                            >
                                contact me
                            </a>
                            .
                        </p>
                    </article>
                </section>
            </div>
            <p className="text-center text-sm text-dark-grey p-4">
                updated/reviewed on {format(displayedUpdatedOn, "dd.MM.yyyy")}
            </p>
        </>
    );
};

export default About;
