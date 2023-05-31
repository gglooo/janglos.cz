import Navbar from "../components/Navbar";
import React from "react";
import Desktop from "../components/Desktop";
import { StartBar } from "../components/StartBar";

export const Portfolio = () => {
    return (
        <div className="h-screen w-screen flex flex-col">
            <Desktop />
            <StartBar />
        </div>
    );
};

export default Portfolio;
