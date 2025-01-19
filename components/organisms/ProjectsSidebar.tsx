import { Paper } from "@mui/material";
import SectionHeader from "../molecules/SectionHeader";
import ProjectsList from "./ProjectsList";
import { Project } from "../../types";

interface ProjectsSidebarProps {
  projects: Project[];
  selectedProject: Project;
  onProjectSelect: (project: Project) => void;
  onAddProject: () => void;
}

const ProjectsSidebar = ({
  projects,
  selectedProject,
  onProjectSelect,
  onAddProject,
}: ProjectsSidebarProps) => (
  <Paper
    sx={{
      width: { xs: "100%", md: "35%" },
      maxWidth: { md: 300 },
      p: 2,
      borderRadius: 0,
      borderRight: { xs: 0, md: 1 },
      borderBottom: { xs: 1, md: 0 },
      borderColor: "rgba(255,255,255,0.1)",
      bgcolor: "#2C2C2C",
      color: "white",
    }}
  >
    <SectionHeader title="Projects" onAddClick={onAddProject} />
    <ProjectsList
      projects={projects}
      selectedProjectId={selectedProject.id}
      onProjectSelect={onProjectSelect}
    />
  </Paper>
);

export default ProjectsSidebar;
