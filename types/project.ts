export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
}

export interface Project {
  id: string;
  name: string;
  tasks: Task[];
}

export interface ProjectCardStats {
  completed: number;
  inProgress: number;
  pending: number;
} 