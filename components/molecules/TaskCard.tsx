import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, Select, MenuItem, SelectChangeEvent } from '@mui/material';

export interface Task {
  id: string;
  name: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const StyledCard = styled(Card)`
  && {
    margin: 16px 0;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
`;

const StatusSelect = styled(Select)`
  && {
    min-width: 120px;
    margin-top: 8px;
  }
`;

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  const handleStatusChange = (event: SelectChangeEvent) => {
    onStatusChange(task.id, event.target.value as Task['status']);
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {task.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {task.description}
        </Typography>
        <StatusSelect
          value={task.status}
          onChange={handleStatusChange}
          size="small"
        >
          <MenuItem value="TODO">To Do</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
        </StatusSelect>
      </CardContent>
    </StyledCard>
  );
};

export default TaskCard; 