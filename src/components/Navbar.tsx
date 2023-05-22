import React from "react";
import { useDate } from "../hooks/useDate";
import { format } from "date-fns";

export const Navbar = () => {
    const currTime = useDate();
    const formattedTime = format(currTime, "HH:mm");

    return (
        <aside className="flex bg-window border-t-white border-l-white border pl-3 pr-3 items-center p-1 font-main z-10">
            <div className="text-md border-t-white border-l-white border pl-2 pr-2 text-center text-2xl cursor-pointer select-none hover:bg-grey hover:border-t-black hover:border-l-black hover:border-b-white hover:border-r-white">
                <a href=".">
                    <h1>Jan Glos</h1>
                </a>
            </div>
            <div className="ml-auto border-b-white border-r-white border border-grey pl-2 pr-2 font-main select-none">
                <h1 className="text-2xl">{formattedTime}</h1>
            </div>
        </aside>
    );
};

export default Navbar;
