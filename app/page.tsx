'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemButton, ListItemText, Grid, Button } from '@mui/material';
import Task, { TaskStatus } from '../components/Task';
import AddIcon from '@mui/icons-material/Add';
import NewTaskDialog from '../components/NewTaskDialog';
import EditTaskDialog from '../components/EditTaskDialog';
import { DragDropClient, DroppableClient } from '../components/DragDropClient';
import type { DropResult } from '@hello-pangea/dnd';
import NewProjectDialog from '../components/NewProjectDialog';
import DraggableProject from '../components/DraggableProject';

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

// Sample data
const projectsData: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    tasks: [
      {
        id: '101',
        title: 'Design Homepage',
        description: 'Create a modern and responsive homepage design',
        status: 'completed',
        assignedTo: '1'
      },
      {
        id: '102',
        title: 'Implement User Authentication',
        description: 'Set up secure user authentication system',
        status: 'in_progress',
        assignedTo: '2'
      },
      {
        id: '103',
        title: 'Mobile Responsiveness',
        description: 'Ensure website works well on all devices',
        status: 'pending',
        assignedTo: '3'
      }
    ]
  },
  {
    id: '2',
    name: 'Mobile App Development',
    tasks: [
      {
        id: '201',
        title: 'UI/UX Design',
        description: 'Design user interface for the mobile app',
        status: 'in_progress',
        assignedTo: '4'
      },
      {
        id: '202',
        title: 'API Integration',
        description: 'Integrate backend APIs with the mobile app',
        status: 'pending',
        assignedTo: '1'
      }
    ]
  }
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [selectedProject, setSelectedProject] = useState<Project>(projectsData[0]);
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
    setProjects(projects.map(project => ({
      ...project,
      tasks: project.tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    })));

    setSelectedProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    }));
  };

  const handleAddTask = (newTask: Omit<TaskType, 'id'>) => {
    const task: TaskType = {
      ...newTask,
      id: `${selectedProject.id}-${Date.now()}`
    };

    setProjects(projects.map(project => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          tasks: [...project.tasks, task]
        };
      }
      return project;
    }));

    setSelectedProject(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }));
  };

  const handleEditTask = (task: { id: string; title: string; description: string; assignedTo: string; status: TaskStatus }) => {
    setProjects(projects.map(project => ({
      ...project,
      tasks: project.tasks.map(t => 
        t.id === task.id ? { ...t, ...task } : t
      )
    })));

    setSelectedProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === task.id ? { ...t, ...task } : t
      )
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setProjects(projects.map(project => ({
      ...project,
      tasks: project.tasks.filter(t => t.id !== taskId)
    })));

    setSelectedProject(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  const groupedTasks = {
    pending: selectedProject.tasks.filter(task => task.status === 'pending'),
    in_progress: selectedProject.tasks.filter(task => task.status === 'in_progress'),
    completed: selectedProject.tasks.filter(task => task.status === 'completed')
  };

  const statusHeaders = {
    pending: { title: 'Pending', color: '#FF991F' },
    in_progress: { title: 'In Progress', color: '#0052CC' },
    completed: { title: 'Completed', color: '#36B37E' }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Update task status
    const newStatus = destination.droppableId as TaskStatus;
    handleStatusChange(draggableId, newStatus);
  };

  const handleTaskReorder = (taskId: string, status: TaskStatus, sourceIndex: number, targetIndex: number) => {
    setProjects(projects.map(project => {
      if (project.id === selectedProject.id) {
        const newTasks = [...project.tasks];
        const statusTasks = newTasks.filter(t => t.status === status);
        const [movedTask] = statusTasks.splice(sourceIndex, 1);
        statusTasks.splice(targetIndex, 0, movedTask);
        
        // Update the tasks array maintaining the order of tasks with different statuses
        const tasksWithDifferentStatus = newTasks.filter(t => t.status !== status);
        return {
          ...project,
          tasks: [...tasksWithDifferentStatus, ...statusTasks]
        };
      }
      return project;
    }));

    setSelectedProject(prev => {
      const newTasks = [...prev.tasks];
      const statusTasks = newTasks.filter(t => t.status === status);
      const [movedTask] = statusTasks.splice(sourceIndex, 1);
      statusTasks.splice(targetIndex, 0, movedTask);
      
      const tasksWithDifferentStatus = newTasks.filter(t => t.status !== status);
      return {
        ...prev,
        tasks: [...tasksWithDifferentStatus, ...statusTasks]
      };
    });
  };

  useEffect(() => {
    const handleTaskDropped = (e: CustomEvent) => {
      const { taskId, newStatus, targetIndex } = e.detail;
      handleStatusChange(taskId, newStatus);
    };

    const handleProjectDropped = (e: CustomEvent) => {
      const { sourceIndex, targetIndex } = e.detail;
      handleProjectDrop(sourceIndex, targetIndex);
    };

    const handleTaskReordered = (e: CustomEvent) => {
      const { taskId, status, sourceIndex, targetIndex } = e.detail;
      handleTaskReorder(taskId, status, sourceIndex, targetIndex);
    };

    window.addEventListener('taskDropped', handleTaskDropped as EventListener);
    window.addEventListener('projectDropped', handleProjectDropped as EventListener);
    window.addEventListener('taskReordered', handleTaskReordered as EventListener);
    
    return () => {
      window.removeEventListener('taskDropped', handleTaskDropped as EventListener);
      window.removeEventListener('projectDropped', handleProjectDropped as EventListener);
      window.removeEventListener('taskReordered', handleTaskReordered as EventListener);
    };
  }, [handleStatusChange, handleProjectDrop, handleTaskReorder]);

  const handleAddProject = ({ name }: { name: string }) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      tasks: []
    };

    setProjects([...projects, newProject]);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: '#1E1F21',
      flexDirection: { xs: 'column', md: 'row' }
    }}>
      {/* Projects Sidebar */}
      <Paper 
        sx={{ 
          width: { xs: '100%', md: '35%' }, 
          maxWidth: { md: 300 },
          p: 2,
          borderRadius: 0,
          borderRight: { xs: 0, md: 1 },
          borderBottom: { xs: 1, md: 0 },
          borderColor: 'rgba(255,255,255,0.1)',
          bgcolor: '#2C2C2C',
          color: 'white'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          p: 1
        }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
            Projects
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setIsNewProjectDialogOpen(true)}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              px: 2,
              py: 0.75,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s'
              },
              '&:active': {
                transform: 'translateY(0)',
              }
            }}
          >
            Add
          </Button>
        </Box>

        <DroppableClient status="project">
          {projects.map((project, index) => (
            <DraggableProject
              key={project.id}
              project={project}
              index={index}
              isSelected={selectedProject.id === project.id}
              onSelect={() => handleProjectSelect(project)}
            />
          ))}
        </DroppableClient>
      </Paper>

      {/* Tasks Section */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
          width: { xs: '100%', md: '65%' }, 
          bgcolor: '#1E1F21',
          overflowY: 'auto'
        }}
      >
        <Box sx={{ 
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'white',
                fontWeight: 600,
                mb: 1
              }}
            >
              {selectedProject.name}
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 400
              }}
            >
              {selectedProject.tasks.length} Tasks
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsNewTaskDialogOpen(true)}
            sx={{
              bgcolor: '#0052CC',
              '&:hover': {
                bgcolor: '#0047B3'
              }
            }}
          >
            Add New Task
          </Button>
        </Box>

        <DragDropClient onDragEnd={handleDragEnd}>
          <Box sx={{ 
            display: 'flex', 
            gap: 3,
            flexDirection: { xs: 'column', lg: 'row' }
          }}>
            {(Object.keys(groupedTasks) as Array<keyof typeof groupedTasks>).map((status) => (
              <Box 
                key={status}
                sx={{ 
                  flex: 1,
                  minWidth: 0
                }}
              >
                {/* Status Header */}
                <Box 
                  sx={{ 
                    mb: 2,
                    p: 2,
                    backgroundColor: `${statusHeaders[status].color}10`,
                    borderRadius: '8px',
                    border: `1px solid ${statusHeaders[status].color}30`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: statusHeaders[status].color
                      }}
                    />
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 600
                      }}
                    >
                      {statusHeaders[status].title}
                    </Typography>
                    <Typography 
                      sx={{ 
                        ml: 'auto',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.875rem'
                      }}
                    >
                      {groupedTasks[status].length}
                    </Typography>
                  </Box>
                </Box>

                <DroppableClient status={status}>
                  {groupedTasks[status].map((task, index) => (
                    <Task
                      key={task.id}
                      index={index}
                      {...task}
                      onStatusChange={handleStatusChange}
                      onEdit={(task) => setEditTask(task)}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </DroppableClient>
              </Box>
            ))}
          </Box>
        </DragDropClient>

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
      </Box>

      <NewProjectDialog
        open={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onAdd={handleAddProject}
      />
    </Box>
  );
}

