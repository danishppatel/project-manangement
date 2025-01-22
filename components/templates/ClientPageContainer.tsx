"use client";

import { useState, useEffect } from 'react';
import type { Project } from '@/types/project';
import type { Task } from '@/types/task';
import ProjectsContent from '@/components/organisms/ProjectsContent';
import NewProjectDialog from '@/components/organisms/NewProjectDialog';
import EditProjectDialog from '@/components/organisms/EditProjectDialog';
import { getAllProjects, createNewProject, updateExistingProject, deleteExistingProject, getAllTasks } from '@/lib/api';
import client from '@/graphql/apollo-client';
import PageLayout from '../atoms/PageLayout';

export default function ClientPageContainer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [projectsData, tasksData] = await Promise.all([
          getAllProjects(client),
          getAllTasks(client)
        ]);
        setProjects(projectsData);
        setTasks(tasksData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
        setError(error instanceof Error ? error : new Error('Failed to update project'));
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



  return (
    <PageLayout>
      { tasks.length > 0 && (
      <ProjectsContent 
        projects={projects}
        onAddProject={() => setIsNewProjectDialogOpen(true)}
        onUpdateProject={(project) => setEditingProject(project)}
        onDeleteProject={handleDeleteProject}
        isLoading={isLoading}
        tasks={tasks}
      />
      )}
      <NewProjectDialog
        open={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onAdd={handleAddProject}
        error={error?.message}
      />
      <EditProjectDialog
        open={Boolean(editingProject)}
        onClose={() => {
          setEditingProject(null)
          setError(null)
        }}
        onSave={handleUpdateProject}
        project={editingProject}
        error={error?.message}
      />
    </PageLayout>
  );
} 