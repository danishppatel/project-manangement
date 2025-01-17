export interface Project {
    id: string;
    name: string;
    tasksCompleted: number;
    totalTasks: number;
  }
  
  export const fakeProjects: Project[] = [
    { id: '1', name: 'Website Redesign', tasksCompleted: 3, totalTasks: 8 },
    { id: '2', name: 'Mobile App Development', tasksCompleted: 5, totalTasks: 12 },
    { id: '3', name: 'Marketing Campaign', tasksCompleted: 2, totalTasks: 6 },
    { id: '4', name: 'Database Migration', tasksCompleted: 7, totalTasks: 10 },
    { id: '5', name: 'User Research', tasksCompleted: 1, totalTasks: 5 },
  ];
  
  