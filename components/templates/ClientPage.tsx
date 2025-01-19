"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import type { DropResult } from "@hello-pangea/dnd";
import { TaskStatus } from "../Task";
import NewTaskDialog from "../NewTaskDialog";
import EditTaskDialog from "../EditTaskDialog";
import NewProjectDialog from "../NewProjectDialog";
import ProjectsSidebar from "../organisms/ProjectsSidebar";
import TasksSection from "./TasksSection";
import { DragDropClient } from "../DragDropClient";

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
  tasks: TaskType[];
}

// Sample data (you might want to move this to a separate file)
const projectsData: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    tasks: [
      {
        id: "101",
        title: "Design Homepage",
        description: "Create a modern and responsive homepage design",
        status: "completed",
        assignedTo: "1",
      },
      {
        id: "102",
        title: "Implement User Authentication",
        description: "Set up secure user authentication system",
        status: "in_progress",
        assignedTo: "2",
      },
      {
        id: "103",
        title: "Mobile Responsiveness",
        description: "Ensure website works well on all devices",
        status: "pending",
        assignedTo: "3",
      },
    ],
  },
  {
    id: "2",
    name: "Mobile App Development",
    tasks: [
      {
        id: "201",
        title: "UI/UX Design",
        description: "Design user interface for the mobile app",
        status: "in_progress",
        assignedTo: "4",
      },
      {
        id: "202",
        title: "API Integration",
        description: "Integrate backend APIs with the mobile app",
        status: "pending",
        assignedTo: "1",
      },
    ],
  },
];

export default function ClientPage() {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [selectedProject, setSelectedProject] = useState<Project>(
    projectsData[0]
  );
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<TaskType | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleProjectDrop = (sourceIndex: number, destinationIndex: number) => {
    const newProjects = Array.from(projects);
    const [removed] = newProjects.splice(sourceIndex, 1);
    newProjects.splice(destinationIndex, 0, removed);
    setProjects(newProjects);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setProjects(
      projects.map((project) => ({
        ...project,
        tasks: project.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
      }))
    );

    setSelectedProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    }));
  };

  const handleAddTask = (newTask: Omit<TaskType, "id">) => {
    const task: TaskType = {
      ...newTask,
      id: `${selectedProject.id}-${Date.now()}`,
    };

    setProjects(
      projects.map((project) => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            tasks: [...project.tasks, task],
          };
        }
        return project;
      })
    );

    setSelectedProject((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }));
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
        tasks: project.tasks.map((t) =>
          t.id === task.id ? { ...t, ...task } : t
        ),
      }))
    );

    setSelectedProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)),
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setProjects(
      projects.map((project) => ({
        ...project,
        tasks: project.tasks.filter((t) => t.id !== taskId),
      }))
    );

    setSelectedProject((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId, type } = result;

    if (type === "PROJECT") {
      handleProjectDrop(source.index, destination.index);
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Handle reordering within the same column
      const newTasks = Array.from(selectedProject.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      setSelectedProject((prev) => ({
        ...prev,
        tasks: newTasks,
      }));

      setProjects(
        projects.map((project) =>
          project.id === selectedProject.id
            ? { ...project, tasks: newTasks }
            : project
        )
      );
    } else {
      // Handle moving between columns
      handleStatusChange(draggableId, destination.droppableId as TaskStatus);
    }
  };

  const groupedTasks = {
    pending: selectedProject.tasks.filter((task) => task.status === "pending"),
    in_progress: selectedProject.tasks.filter(
      (task) => task.status === "in_progress"
    ),
    completed: selectedProject.tasks.filter(
      (task) => task.status === "completed"
    ),
  };

  const statusHeaders = {
    pending: { title: "Pending", color: "#FF991F" },
    in_progress: { title: "In Progress", color: "#0052CC" },
    completed: { title: "Completed", color: "#36B37E" },
  };

  const handleAddProject = ({ name }: { name: string }) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      tasks: [],
    };

    setProjects([...projects, newProject]);
  };

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
          onProjectSelect={setSelectedProject}
          onAddProject={() => setIsNewProjectDialogOpen(true)}
        />

        <TasksSection
          selectedProject={selectedProject}
          groupedTasks={groupedTasks}
          statusHeaders={statusHeaders}
          onAddTask={() => setIsNewTaskDialogOpen(true)}
          onStatusChange={handleStatusChange}
          onEditTask={setEditTask}
          onDeleteTask={handleDeleteTask}
          onDragEnd={handleDragEnd}
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
