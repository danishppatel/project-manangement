export interface Task {
  projectId: string;
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks?: Array<{
    id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    assignedTo: string;
  }>;
}

export interface ProjectCardStats {
  completed: number;
  inProgress: number;
  pending: number;
} 