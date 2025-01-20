import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  createTask,
  getTasks,
  getTaskByProject,
  updateTask,
  deleteTask 
} from '@/graphql/queries/query';
import type { Project } from '@/types/project';
import type { Task } from '@/types/task';

// Project Types
interface CreateProjectInput {
  name: string;
  description?: string;
}

interface UpdateProjectInput {
  name?: string;
  description?: string;
}

// Task Types
interface CreateTaskInput {
  title: string;
  description?: string;
  status: string;
  projectId: string;
  assignedTo?: string | null;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
  assignedTo?: string | null;
}

// Project Functions
export async function getAllProjects(client: ApolloClient<NormalizedCacheObject>): Promise<Project[]> {
  try {
    const { data } = await client.query({
      query: getProjects,
      fetchPolicy: 'network-only'
    });
    return data.projects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw new Error('Failed to fetch projects');
  }
}

export async function createNewProject(
  client: ApolloClient<NormalizedCacheObject>,
  input: CreateProjectInput
): Promise<Project> {
  try {
    const { data } = await client.mutate({
      mutation: createProject,
      variables: { input },
      update: (cache, { data }) => {
        const existingProjects = cache.readQuery({ query: getProjects });
        cache.writeQuery({
          query: getProjects,
          data: {
            projects: [...existingProjects.projects, data.createProject]
          }
        });
      }
    });
    return data.createProject;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw new Error('Failed to create project');
  }
}

export async function updateExistingProject(
  client: ApolloClient<NormalizedCacheObject>,
  id: string, 
  input: UpdateProjectInput
): Promise<Project> {
  try {
    const { data } = await client.mutate({
      mutation: updateProject,
      variables: { id, input },
      update: (cache, { data }) => {
        const existingProjects = cache.readQuery({ query: getProjects });
        const updatedProjects = existingProjects.projects.map((project: Project) => 
          project.id === id ? data.updateProject : project
        );
        cache.writeQuery({
          query: getProjects,
          data: { projects: updatedProjects }
        });
      }
    });
    return data.updateProject;
  } catch (error) {
    console.error('Failed to update project:', error);
    throw new Error('Failed to update project');
  }
}

export async function deleteExistingProject(
  client: ApolloClient<NormalizedCacheObject>,
  id: string
): Promise<void> {
  try {
    await client.mutate({
      mutation: deleteProject,
      variables: { id },  // Pass id directly as variable
      update: (cache) => {
        const existingProjects = cache.readQuery<{ projects: Project[] }>({ 
          query: getProjects 
        });
        
        if (existingProjects) {
          cache.writeQuery({
            query: getProjects,
            data: {
              projects: existingProjects.projects.filter(project => project.id !== id)
            }
          });
        }
      }
    });
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw new Error('Failed to delete project');
  }
}

// Task Functions
export async function getAllTasks(
  client: ApolloClient<NormalizedCacheObject>
): Promise<Task[]> {
  try {
    const { data } = await client.query({
      query: getTasks,
      fetchPolicy: 'network-only'
    });
    return data.tasks;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

export async function getTasksByProject(
  client: ApolloClient<NormalizedCacheObject>,
  projectId: string
): Promise<Task[]> {
  try {
    const { data } = await client.query({
      query: getTaskByProject,
      variables: { projectId },
      fetchPolicy: 'network-only'
    });
    return data.tasksByProject;
  } catch (error) {
    console.error('Failed to fetch project tasks:', error);
    throw new Error('Failed to fetch project tasks');
  }
}

export async function createNewTask(
  client: ApolloClient<NormalizedCacheObject>,
  input: CreateTaskInput
): Promise<Task> {
  try {
    const taskInput = {
      title: input.title,
      description: input.description,
      status: input.status,
      projectId: input.projectId,
      ...(input.assignedTo ? { assignedTo: input.assignedTo } : {})
    };

    const { data } = await client.mutate({
      mutation: createTask,
      variables: { input: taskInput },
      update: (cache, { data }) => {
        const existingTasks = cache.readQuery({ 
          query: getTaskByProject,
          variables: { projectId: input.projectId }
        });
        if (existingTasks) {
          cache.writeQuery({
            query: getTaskByProject,
            variables: { projectId: input.projectId },
            data: {
              tasksByProject: [...existingTasks.tasksByProject, data.createTask]
            }
          });
        }
      }
    });
    return data.createTask;
  } catch (error) {
    console.error('Failed to create task:', error);
    throw new Error('Failed to create task');
  }
}

export async function updateExistingTask(
  client: ApolloClient<NormalizedCacheObject>,
  id: string,
  input: UpdateTaskInput,
  projectId: string
): Promise<Task> {
  try {
    const { data } = await client.mutate({
      mutation: updateTask,
      variables: { id, input },
      update: (cache, { data }) => {
        const existingTasks = cache.readQuery({
          query: getTaskByProject,
          variables: { projectId }
        });
        if (existingTasks) {
          const updatedTasks = existingTasks.tasksByProject.map(task =>
            task.id === id ? data.updateTask : task
          );
          cache.writeQuery({
            query: getTaskByProject,
            variables: { projectId },
            data: { tasksByProject: updatedTasks }
          });
        }
      }
    });
    return data.updateTask;
  } catch (error) {
    console.error('Failed to update task:', error);
    throw new Error('Failed to update task');
  }
}

export async function deleteExistingTask(
  client: ApolloClient<NormalizedCacheObject>,
  id: string,
  projectId: string
): Promise<void> {
  try {
    await client.mutate({
      mutation: deleteTask,
      variables: { id },
      update: (cache) => {
        const existingTasks = cache.readQuery<{ tasksByProject: Task[] }>({
          query: getTaskByProject,
          variables: { projectId }
        });
        
        if (existingTasks) {
          cache.writeQuery({
            query: getTaskByProject,
            variables: { projectId },
            data: {
              tasksByProject: existingTasks.tasksByProject.filter(task => task.id !== id)
            }
          });
        }
      }
    });
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw new Error('Failed to delete task');
  }
}
