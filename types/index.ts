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
  tasks: TaskType[];
}

export type TaskStatus = "pending" | "in_progress" | "completed";
