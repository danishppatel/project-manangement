export interface TaskType {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  tasks?: TaskType[];
  createdAt?: string;
}

export type TaskStatus = "PENDING" | "INPROGRESS" | "COMPLETED";
