"use client";

import { useState, useEffect } from 'react';
import type { Project } from '@/types/project';
import ProjectsContent from '@/components/organisms/ProjectsContent';
import NewProjectDialog from '@/components/organisms/NewProjectDialog';
import EditProjectDialog from '@/components/organisms/EditProjectDialog';
import { getAllProjects, createNewProject, updateExistingProject, deleteExistingProject } from '@/lib/api';
import client from '@/graphql/apollo-client';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import PageLayout from '../atoms/PageLayout';

export default function ClientPageContainer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProjects(client);
        setProjects(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleAddProject = (projectData: { name: string; description: string }) => {
    createNewProject(client, {
      name: projectData.name,
      description: projectData.description,
    })
      .then(newProject => {
        setProjects(prev => [...prev, newProject]);
        setIsNewProjectDialogOpen(false);
      })
      .catch(error => {
        console.error('Failed to create project:', error);
        // Handle error (show notification, etc.)
      });
  };

  const handleUpdateProject = (projectData: { id: string; name: string; description: string }) => {
    updateExistingProject(client, projectData.id, {
      name: projectData.name,
      description: projectData.description,
    })
      .then(updatedProject => {
        setProjects(prev => prev.map(project => 
          project.id === projectData.id ? updatedProject : project
        ));
        setEditingProject(null);
      })
      .catch(error => {
        console.error('Failed to update project:', error);
        // Handle error
      });
  };

  const handleDeleteProject = (project: Project) => {
    deleteExistingProject(client, project.id)
      .then(() => {
        setProjects(prev => prev.filter(p => p.id !== project.id));
      })
      .catch(error => {
        console.error('Failed to delete project:', error);
        // Handle error
      });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load projects"
        error={error}
        onRetry={() => {
          setError(null);
          setIsLoading(true);
          getAllProjects(client)
            .then(data => setProjects(data))
            .catch(err => setError(err))
            .finally(() => setIsLoading(false));
        }}
      />
    );
  }

  return (
    <PageLayout>
      <ProjectsContent 
        projects={projects}
        onAddProject={() => setIsNewProjectDialogOpen(true)}
        onUpdateProject={(project) => setEditingProject(project)}
        onDeleteProject={handleDeleteProject}
      />
      <NewProjectDialog
        open={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onAdd={handleAddProject}
      />
      <EditProjectDialog
        open={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        onSave={handleUpdateProject}
        project={editingProject}
      />
    </PageLayout>
  );
} 