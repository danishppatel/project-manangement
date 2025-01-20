"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { TaskStatus } from "../Task";
import NewTaskDialog from "../NewTaskDialog";
import EditTaskDialog from "../EditTaskDialog";
import NewProjectDialog from "../NewProjectDialog";
import ProjectsSidebar from "../organisms/ProjectsSidebar";
import TasksSection from "./TasksSection";
// import { DragDropClient } from "../DragDropClient";
import { useRouter } from "next/navigation";

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
export const projectsData: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    tasks: [
      { 
        id: '101', 
        title: 'Design Homepage', 
        description: 'Create a modern homepage design with improved UI/UX',
        status: 'completed',
        assignedTo: "1"  // John Doe's ID
      },
      { 
        id: '102', 
        title: 'Implement Authentication', 
        description: 'Set up secure user authentication system',
        status: 'in_progress',
        assignedTo: "2"  // Jane Smith's ID
      },
      { 
        id: '103', 
        title: 'Mobile Responsiveness', 
        description: 'Ensure website works on all devices',
        status: 'pending',
        assignedTo: "3"  // Mike Johnson's ID
      }
    ],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    tasks: [
      { 
        id: '201', 
        title: 'UI/UX Design', 
        description: 'Design user interface mockups and user experience flows',
        status: 'completed',
        assignedTo: "4"  // Sarah Williams's ID
      },
      { 
        id: '202', 
        title: 'Core Features Development', 
        description: 'Implement main features of the mobile app',
        status: 'in_progress',
        assignedTo: "3"  // Mike Johnson's ID
      },
      { 
        id: '203', 
        title: 'API Integration', 
        description: 'Connect mobile app with backend services',
        status: 'in_progress',
        assignedTo: "1"  // John Doe's ID
      },
      { 
        id: '204', 
        title: 'Push Notifications', 
        description: 'Implement push notification system',
        status: 'pending',
        assignedTo: "2"  // Jane Smith's ID
      },
      { 
        id: '205', 
        title: 'App Testing', 
        description: 'Conduct thorough testing on multiple devices',
        status: 'pending',
        assignedTo: "4"  // Sarah Williams's ID
      }
    ],
  },
  {
    id: '3',
    name: 'Data Analytics Dashboard',
    tasks: [
      { 
        id: '301', 
        title: 'Data Model Design', 
        description: 'Design the data schema and relationships',
        status: 'completed',
        assignedTo: "1"  // John Doe's ID
      },
      { 
        id: '302', 
        title: 'Data Integration', 
        description: 'Connect and integrate multiple data sources',
        status: 'in_progress',
        assignedTo: "3"  // Mike Johnson's ID
      },
      { 
        id: '303', 
        title: 'Dashboard Layout', 
        description: 'Design and implement dashboard layout with widgets',
        status: 'in_progress',
        assignedTo: "4"  // Sarah Williams's ID
      },
      { 
        id: '304', 
        title: 'Chart Components', 
        description: 'Create reusable chart components',
        status: 'pending',
        assignedTo: "2"  // Jane Smith's ID
      },
      { 
        id: '305', 
        title: 'Real-time Updates', 
        description: 'Implement real-time data updates',
        status: 'pending',
        assignedTo: "3"  // Mike Johnson's ID
      },
      { 
        id: '306', 
        title: 'Export Features', 
        description: 'Add functionality to export data in multiple formats',
        status: 'pending',
        assignedTo: "1"  // John Doe's ID
      }
    ],
  }
];

export default function ClientPage({ projectId }: { projectId: string }) {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    projects.find((p) => p.id === projectId)
  );
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<TaskType | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    } else {
      // Fallback to first project if the ID is not found
      setSelectedProject(projects[0]);
    }
  }, [projectId, projects]); // Remove projects from dependency array to avoid unnecessary rerenders

  const handleProjectSelect = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  const handleTaskStatusUpdate = (taskId: string, newStatus: TaskStatus) => {
    setSelectedProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map((task) =>
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
            tasks: [...project.tasks, task],
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
        tasks: project.tasks.map((t) =>
          t.id === task.id ? { ...t, ...task } : t
        ),
      }))
    );

    setSelectedProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)),
      };
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setProjects(
      projects.map((project) => ({
        ...project,
        tasks: project.tasks.filter((t) => t.id !== taskId),
      }))
    );

    setSelectedProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== taskId),
      };
    });
  };

  const groupedTasks = {
    pending: selectedProject?.tasks.filter((task) => task.status === "pending") || [],
    in_progress: selectedProject?.tasks.filter(
      (task) => task.status === "in_progress"
    ) || [],
    completed: selectedProject?.tasks.filter(
      (task) => task.status === "completed"
    ) || [],
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
