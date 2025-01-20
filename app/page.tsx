"use client";

import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '@/components/molecules/ProjectCard';
import ProjectsHeader from '@/components/molecules/ProjectsHeader';
import NewProjectDialog from '@/components/NewProjectDialog';
import type { Project } from '@/types/project';

export default function HomePage() {
  const { projects, addProject } = useProjects();
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);

  const handleAddProject = (projectData: { name: string }) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: projectData.name,
      tasks: [],
    };
    addProject(newProject);
    setIsNewProjectDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#1E1F21', minHeight: '100vh' }}>
      <ProjectsHeader 
        projectCount={projects.length}
        onAddProject={() => setIsNewProjectDialogOpen(true)}
      />
      
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} lg={4} key={project.id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>

      <NewProjectDialog
        open={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onAdd={handleAddProject}
      />
    </Box>
  );
}
