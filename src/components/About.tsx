import React from "react";

export const About = () => {
    const technologies = [
        "React",
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

    return (
        <div className="p-4 px-[10%] sm:px-[10%] md:px-[15%] lg:px-[20%] flex flex-col">
            <section>
                <h1 className="text-3xl font-bold">Jan Glos</h1>
                <p className="text-dark-grey text-md">
                    Programming and Development student | C seminar tutor &&
                    code reviewer | Python code reviewer | Web developer
                </p>
                <div className="flex flex-row flex-wrap py-4">
                    {technologies.map((technology, index) => (
                        <div
                            key={index}
                            className="border border-t-white border-l-white px-4 py-1 mr-2 mb-2"
                        >
                            {technology}
                        </div>
                    ))}
                </div>
            </section>
            <section className="text-left grid gap-4">
                <article>
                    <h2 className="text-3xl font-semibold mb-2">About me</h2>
                    <p className="text-lg">
                        Hi! My name is Jan and I am a student of Programming and
                        Development at the Faculty of Informatics at Masaryk
                        University in Brno. I have recently finished my second
                        year of studies. I am really passionate about
                        programming, problem solving and new technologies in
                        general.
                    </p>
                    <br />
                    <p className="text-lg">
                        Web development is my favorite activity right now,
                        however, I never stick to one field as I try to be
                        versatile and adaptable to new opportunities. I have
                        built applications in C# or C and wrote a few scripts in
                        Python and bash.
                    </p>
                    <br />
                    <p className="text-lg">
                        I am currently looking for an (ideally) full-time
                        internship to further improve my skills, gain experience
                        in the field and learn from experienced developers. If
                        you have any questions do not hesitate to{" "}
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
    );
};

export default About;
