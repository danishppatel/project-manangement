import { DroppableClient } from "../DragDropClient";
import DraggableProject from "../DraggableProject";
import { Project } from "../../types";

interface ProjectsListProps {
  projects: Project[];
  selectedProjectId?: string;
  onProjectSelect: (project: Project) => void;
}

const ProjectsList = ({
  projects,
  selectedProjectId,
  onProjectSelect,
}: ProjectsListProps) => (
  <DroppableClient status="project">
    {projects?.map((project, index) => (
      <DraggableProject
        key={project.id}
        project={project}
        index={index}
        isSelected={selectedProjectId === project.id}
        onSelect={() => onProjectSelect(project)}
      />
    ))}
  </DroppableClient>
);

export default ProjectsList;
