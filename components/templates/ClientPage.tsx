"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { TaskStatus } from "../Task";
import NewTaskDialog from "../NewTaskDialog";
import EditTaskDialog from "../EditTaskDialog";
import NewProjectDialog from "../organisms/NewProjectDialog";
import ProjectsSidebar from "../organisms/ProjectsSidebar";
import TasksSection from "./TasksSection";
import { useRouter } from "next/navigation";
import { getAllProjects, createNewProject, createNewTask, getTasksByProject, deleteExistingTask, updateExistingTask } from "@/lib/api";
import client from "@/graphql/apollo-client";
import { Task } from "@/types/task";

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
  const [tasks, setTasks] = useState<Task[]>([]);
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

  // Fetch tasks when selected project changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedProject) return;
      
      try {
        setIsLoading(true);
        const projectTasks = await getTasksByProject(client, selectedProject.id);
        setTasks(projectTasks);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [selectedProject]);

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

  const handleAddTask = async (newTask: { title: string; description?: string }) => {
    if (!selectedProject) return;

    try {
      // setIsLoading(true);
      
      const taskInput = {
        title: newTask.title,
        description: newTask.description,
        status: "PENDING",
        projectId: selectedProject.id
      };

      // Call the API to create new task
      const createdTask = await createNewTask(client, taskInput);
      
      // Update local state directly
      setTasks(prevTasks => [...prevTasks, createdTask]);
      setIsNewTaskDialogOpen(false);
      setError(null);
      
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to create task'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = async (task: {
    id: string;
    title: string;
    description: string;
    assignedTo?: string;
    status: TaskStatus;
  }) => {
    if (!selectedProject) return;

    try {
      
      const updateInput = {
        title: task.title,
        description: task.description,
        status: task.status,
        userId: task.assignedTo
      };

      const updatedTask = await updateExistingTask(
        client,
        task.id,
        updateInput,
        selectedProject.id
      );
      
      // Update local state directly
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? updatedTask : t)
      );
      
      setEditTask(null);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to update task'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!selectedProject) return;

    try {
      
      await deleteExistingTask(client, taskId, selectedProject.id);
      
      // Update local state directly
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to delete task'));
    } finally {
      setIsLoading(false);
    }
  };

  const groupedTasks = {
    pending: tasks?.filter((task) => task.status === "PENDING") || [],
    in_progress: tasks?.filter(
      (task) => task.status === "INPROGRESS"
    ) || [],
    completed: tasks?.filter(
      (task) => task.status === "COMPLETED"
    ) || [],
  };


  const statusHeaders = {
    pending: { title: "PENDING", color: "#FF991F" },
    in_progress: { title: "INPROGRESS", color: "#0052CC" },
    completed: { title: "COMPLETED", color: "#36B37E" },
  };

  const handleAddProject = async ({ name, description }: { name: string; description?: string }) => {
    try {
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
  // if (isLoading) {
  //   return <LoadingSpinner />;
  // }

  // if (error) {
  //   console.error(error)
  //   return (
  //     <ErrorMessage 
  //       message={error.message}
  //       error={error}
  //       onRetry={() => {
  //         setError(null);
  //         setIsLoading(true);
  //         getAllProjects(client)
  //           .then(data => setProjects(data as Project[]))
  //           .catch(err => setError(err))
  //           .finally(() => setIsLoading(false));
  //       }}
  //     />
  //   );
  // }

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
          loading={isLoading}
        />

        <NewTaskDialog
          open={isNewTaskDialogOpen}
          onClose={() => {
            setIsNewTaskDialogOpen(false);
            setError(null);
          }}
          onAdd={handleAddTask}
          error={error?.message}
        />

        <EditTaskDialog
          open={!!editTask}
          onClose={() => {
            setEditTask(null);
            setError(null);
          }}
          onSave={handleEditTask}
          task={editTask}
          error={error?.message}
        />

        <NewProjectDialog
          open={isNewProjectDialogOpen}
          onClose={() => {
            setIsNewProjectDialogOpen(false);
            setError(null);
          }}
          onAdd={handleAddProject}
          error={error?.message}
        />
      </Box>
    // </DragDropClient>
  );
}
