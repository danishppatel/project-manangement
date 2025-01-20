import { Grid } from '@mui/material';
import ProjectCard from '@/components/molecules/ProjectCard';
import type { Project } from '@/types/project';

interface ProjectsGridProps {
  projects: Project[];
}

const ProjectsGrid = ({ projects }: ProjectsGridProps) => (
  <Grid container spacing={3}>
    {projects.map((project) => (
      <Grid item xs={12} sm={6} lg={4} key={project.id}>
        <ProjectCard project={project} />
      </Grid>
    ))}
  </Grid>
);

export default ProjectsGrid; 