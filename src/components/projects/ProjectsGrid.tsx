import type { Project } from "./types";
import { ProjectCard } from "./ProjectCard";

interface ProjectsGridProps {
    projects: Project[];
    onOpenProject: (projectId: string) => void;
}

export const ProjectsGrid = ({ projects, onOpenProject }: ProjectsGridProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onOpen={onOpenProject} />
            ))}
        </div>
    );
};
