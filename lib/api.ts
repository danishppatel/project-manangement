import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '@/graphql/queries/query';
import type { Project } from '@/types/project';

// Project Types
interface CreateProjectInput {
  name: string;
  description?: string;
}

interface UpdateProjectInput {
  name?: string;
  description?: string;
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
        const updatedProjects = existingProjects.projects.map(project => 
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
