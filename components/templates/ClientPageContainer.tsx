"use client";

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import type { Project } from '@/types/project';
import PageLayout from '@/components/atoms/PageLayout';
import NewProjectDialog from '@/components/organisms/NewProjectDialog';
import ProjectsContent from '@/components/organisms/ProjectsContent';

export default function ClientPageContainer() {
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
console.log(projects)
  return (
    <PageLayout>
      <ProjectsContent 
        projects={projects}
        onAddProject={() => setIsNewProjectDialogOpen(true)}
      />
      <NewProjectDialog
        open={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onAdd={handleAddProject}
      />
    </PageLayout>
  );
} 