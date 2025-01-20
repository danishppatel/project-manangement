import { useState } from 'react';
import { projectsData } from '../components/templates/ClientPage'; // Move your sample data here
import type { Project } from '@/types/project';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(projectsData);

  const addProject = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);
  };

  return {
    projects,
    setProjects,
    addProject,
  };
} 