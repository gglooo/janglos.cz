import type { Project } from "./types";
import { StackBadge } from "./StackBadge";

interface ProjectCardProps {
    project: Project;
    onOpen: (projectId: string) => void;
}

const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength).trimEnd()}...`;
};

export const ProjectCard = ({ project, onOpen }: ProjectCardProps) => {
    return (
        <button
            type="button"
            className="group h-full border border-l-white border-t-white border-r-2 border-b-2 p-3 text-left bg-window hover:bg-[#d8d8d8] active:border-r-white active:border-b-white active:border-l-black active:border-t-black"
            onClick={() => onOpen(project.id)}
        >
            <div className="flex h-full flex-col gap-3">
                <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full aspect-[16/10] object-contain bg-[#cfcfcf] p-1 border border-l-white border-t-white border-r-[#7f7f7f] border-b-[#7f7f7f]"
                />
                <h3 className="text-[17px] leading-snug font-semibold text-black group-hover:text-[#0b3f7f]">
                    {project.title}
                </h3>
                <p className="text-[14px] leading-5 text-[#222]">{truncate(project.description, 120)}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                    {project.stack.slice(0, 4).map((stackItem) => (
                        <StackBadge key={stackItem} label={stackItem} variant="raised" />
                    ))}
                    {project.stack.length > 4 ? (
                        <span className="text-xs text-[#555]">+{project.stack.length - 4} more</span>
                    ) : null}
                </div>
            </div>
        </button>
    );
};
