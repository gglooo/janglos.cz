import { useMemo, useState } from "react";
import type { Project } from "./types";

export const useProjectsNavigation = (projects: Project[]) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const selectedProject = useMemo(
        () => projects.find((project) => project.id === selectedProjectId) ?? null,
        [projects, selectedProjectId],
    );

    const openProject = (projectId: string) => {
        setSelectedProjectId(projectId);
    };

    const closeProject = () => {
        setSelectedProjectId(null);
    };

    return {
        selectedProject,
        selectedProjectId,
        isDetailOpen: selectedProject !== null,
        openProject,
        closeProject,
    };
};
