import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '@/graphql/queries/query';
import type { Project } from '@/types/project';

interface CreateProjectInput {
  name: string;
  description?: string;
}

interface UpdateProjectInput {
  name?: string;
  description?: string;
}

export class ProjectService {
  private client: ApolloClient<NormalizedCacheObject>;

  constructor(client: ApolloClient<NormalizedCacheObject>) {
    this.client = client;
  }

  async getAllProjects(): Promise<Project[]> {
    try {
      const { data } = await this.client.query({
        query: getProjects,
        fetchPolicy: 'network-only'
      });
      return data.projects;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  async createNewProject(input: CreateProjectInput): Promise<Project> {
    try {
      const { data } = await this.client.mutate({
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

  async updateExistingProject(id: string, input: UpdateProjectInput): Promise<Project> {
    try {
      const { data } = await this.client.mutate({
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

  async deleteExistingProject(id: string): Promise<Project> {
    try {
      const { data } = await this.client.mutate({
        mutation: deleteProject,
        variables: { id },
        update: (cache) => {
          const existingProjects = cache.readQuery({ query: getProjects });
          cache.writeQuery({
            query: getProjects,
            data: {
              projects: existingProjects.projects.filter(project => project.id !== id)
            }
          });
        }
      });
      return data.deleteProject;
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw new Error('Failed to delete project');
    }
  }
}

// Create a singleton instance
let projectService: ProjectService | null = null;

export function getProjectService(client: ApolloClient<NormalizedCacheObject>): ProjectService {
  if (!projectService) {
    projectService = new ProjectService(client);
  }
  return projectService;
} 