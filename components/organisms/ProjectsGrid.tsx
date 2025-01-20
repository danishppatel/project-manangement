import { Grid } from '@mui/material';
import ProjectCard from '@/components/molecules/ProjectCard';
import type { Project } from '@/types/project';

interface ProjectsGridProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const ProjectsGrid = ({ projects, onEdit, onDelete }: ProjectsGridProps) => (
  <Grid container spacing={3}>
    {projects.map((project) => (
      <Grid item xs={12} sm={6} md={4} key={project.id}>
        <ProjectCard 
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Grid>
    ))}
  </Grid>
);

export default ProjectsGrid; 