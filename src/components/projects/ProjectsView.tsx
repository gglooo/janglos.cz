import { projects } from "./projectsData";
import { ProjectDetailView } from "./ProjectDetailView";
import { ProjectsGrid } from "./ProjectsGrid";
import { useProjectsNavigation } from "./useProjectsNavigation";

export const ProjectsView = () => {
    const { selectedProject, isDetailOpen, openProject, closeProject } = useProjectsNavigation(projects);

    return (
        <div className="flex flex-col gap-4 p-4 border font-content">
            {isDetailOpen && selectedProject ? (
                <ProjectDetailView project={selectedProject} onBack={closeProject} />
            ) : (
                <>
                    <h2 className="text-2xl font-semibold text-black">Projects</h2>
                    <p className="text-sm text-[#3a3a3a] -mt-2">
                        Select a project to open its full detail view.
                    </p>
                    <ProjectsGrid projects={projects} onOpenProject={openProject} />
                </>
            )}
        </div>
    );
};
