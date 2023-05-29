import React from "react";

export const About = () => {
    return (
        <div className="p-4">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
                {" "}
                {/* Rectangular section */}
                <h2 className="text-2xl font-bold mb-2">Introduction</h2>
                <p className="text-lg">{/* Add your introduction here */}</p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-4">
                {" "}
                {/* Rectangular section */}
                <h2 className="text-2xl font-bold mb-2">Skills</h2>
                <ul className="list-disc ml-6">
                    {/* List your skills here */}
                    <li>Skill 1</li>
                    <li>Skill 2</li>
                    <li>Skill 3</li>
                </ul>
            </div>

            <div className="bg-grey rounded-lg p-4 mb-4">
                {" "}
                {/* Rectangular section */}
                <h2 className="text-2xl font-bold mb-2">Experience</h2>
                <div>
                    {/* Add your work experience here */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold">Company 1</h3>
                        <p className="text-md">Position: Job Title</p>
                        <p className="text-md">
                            Duration: Start Date - End Date
                        </p>
                        <ul className="list-disc ml-6">
                            <li>Responsibility 1</li>
                            <li>Responsibility 2</li>
                            <li>Responsibility 3</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-bold">Company 2</h3>
                        <p className="text-md">Position: Job Title</p>
                        <p className="text-md">
                            Duration: Start Date - End Date
                        </p>
                        <ul className="list-disc ml-6">
                            <li>Responsibility 1</li>
                            <li>Responsibility 2</li>
                            <li>Responsibility 3</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-grey rounded-lg p-4 mb-4">
                {" "}
                {/* Rectangular section */}
                <h2 className="text-2xl font-bold mb-2">Education</h2>
                <div>
                    {/* Add your education details here */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold">University Name</h3>
                        <p className="text-md">Degree: Degree Name</p>
                        <p className="text-md">Year: Graduation Year</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-bold">High School</h3>
                        <p className="text-md">Year: Graduation Year</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
