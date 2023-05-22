import Navbar from "../components/Navbar";
import React from "react";
import Desktop from "../components/Desktop";

export const Portfolio = () => {
    return (
        <div className="h-screen w-screen flex flex-col">
            <Navbar />
            <Desktop />
        </div>
    );
};

export default Portfolio;
