"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { TaskStatus } from "../Task";
import NewTaskDialog from "../NewTaskDialog";
import EditTaskDialog from "../EditTaskDialog";
import NewProjectDialog from "../organisms/NewProjectDialog";
import ProjectsSidebar from "../organisms/ProjectsSidebar";
import TasksSection from "./TasksSection";
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import { useRouter } from "next/navigation";
import { getAllProjects, createNewProject } from "@/lib/api";
import client from "@/graphql/apollo-client";

interface TaskType {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  tasks?: TaskType[];
  createdAt: string;
}

export default function ClientPage({ projectId }: { projectId: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    projects.find((p) => p.id === projectId)
  );
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<TaskType | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProjects(client);
        setProjects(data as Project[]);
        
        // Set selected project after we have the data
        if (data && data.length > 0) {
          const project = data.find((p) => p.id === projectId);
          setSelectedProject(project as Project);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [projectId]);

  const handleProjectSelect = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  const handleTaskStatusUpdate = (taskId: string, newStatus: TaskStatus) => {
    setSelectedProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks?.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
      };
    });
  };

  const handleAddTask = (newTask: Omit<TaskType, "id">) => {
    const task: TaskType = {
      ...newTask,
      id: `${selectedProject?.id}-${Date.now()}`,
    };

    setProjects(
      projects.map((project) => {
        if (project.id === selectedProject?.id) {
          return {
            ...project,
            tasks: [...(project.tasks || []), task],
          };
        }
        return project;
      })
    );

    setSelectedProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: [...(prev.tasks || []), task],
      };
    });
  };

  const handleEditTask = (task: {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    status: TaskStatus;
  }) => {
    setProjects(
      projects.map((project) => ({
        ...project,
        tasks: project.tasks?.map((t) =>
          t.id === task.id ? { ...t, ...task } : t
        ),
      }))
    );

    setSelectedProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks?.map((t) => (t.id === task.id ? { ...t, ...task } : t)),
      };
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setProjects(
      projects.map((project) => ({
        ...project,
        tasks: project.tasks?.filter((t) => t.id !== taskId),
      }))
    );

    setSelectedProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks?.filter((t) => t.id !== taskId),
      };
    });
  };

  const groupedTasks = {
    pending: selectedProject?.tasks?.filter((task) => task.status === "pending") || [],
    in_progress: selectedProject?.tasks?.filter(
      (task) => task.status === "in_progress"
    ) || [],
    completed: selectedProject?.tasks?.filter(
      (task) => task.status === "completed"
    ) || [],
  };

  const statusHeaders = {
    pending: { title: "Pending", color: "#FF991F" },
    in_progress: { title: "In Progress", color: "#0052CC" },
    completed: { title: "Completed", color: "#36B37E" },
  };

  const handleAddProject = async ({ name, description }: { name: string; description?: string }) => {
    try {
      setIsLoading(true);
      // Call the API to create new project
      const newProject = await createNewProject(client, {
        name,
        description
      });
      
      // Update local state with the new project from the server
      setIsNewProjectDialogOpen(false);
      setProjects((prevProjects) => [...prevProjects, newProject as Project]);
      
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to create project'));
    } finally {
      setIsLoading(false);
    }
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
            .then(data => setProjects(data as Project[]))
            .catch(err => setError(err))
            .finally(() => setIsLoading(false));
        }}
      />
    );
  }

  return (
    // <DragDropClient onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "#1E1F21",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <ProjectsSidebar
          projects={projects}
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
          onAddProject={() => setIsNewProjectDialogOpen(true)}
        />

        <TasksSection
          selectedProject={selectedProject}
          groupedTasks={groupedTasks}
          statusHeaders={statusHeaders}
          onAddTask={() => setIsNewTaskDialogOpen(true)}
          onStatusChange={handleTaskStatusUpdate}
          onEditTask={setEditTask}
          onDeleteTask={handleDeleteTask}
        />

        <NewTaskDialog
          open={isNewTaskDialogOpen}
          onClose={() => setIsNewTaskDialogOpen(false)}
          onAdd={handleAddTask}
        />

        <EditTaskDialog
          open={!!editTask}
          onClose={() => setEditTask(null)}
          onSave={handleEditTask}
          task={editTask}
        />

        <NewProjectDialog
          open={isNewProjectDialogOpen}
          onClose={() => setIsNewProjectDialogOpen(false)}
          onAdd={handleAddProject}
        />
      </Box>
    // </DragDropClient>
  );
}
