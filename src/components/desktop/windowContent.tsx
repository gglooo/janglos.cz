import type { ContentType } from "../../types/ContentType";
import About from "../About";
import { AsciiWindow } from "../AsciiWindow";
import { BlackLodgeWindow } from "../black-lodge/BlackLodgeWindow";
import Projects from "../Projects";
import { RecycleBinWindow } from "../RecycleBinWindow";
import { RunWindow } from "../RunWindow";
import { TaskManagerWindow } from "../TaskManagerWindow";
import Weather from "../Weather";

interface WindowContentParams {
    title: ContentType;
    onClose: () => void;
}

export const renderWindowContent = ({
    title,
    onClose,
}: WindowContentParams) => {
    switch (title) {
        case "About\u00A0me":
            return <About />;
        case "Projects":
            return <Projects />;
        case "Weather":
            return <Weather />;
        case "ASCII Art":
            return <AsciiWindow />;
        case "The Black Lodge":
            return <BlackLodgeWindow />;
        case "Trash":
            return <RecycleBinWindow />;
        case "Run":
            return <RunWindow onClose={onClose} />;
        case "Task Manager":
            return <TaskManagerWindow />;
        default:
            return null;
    }
};
