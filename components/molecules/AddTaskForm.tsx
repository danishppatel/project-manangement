import React, { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';
import { Button } from '@/components/atoms/Button';
import { Task } from './TaskCard';

interface AddTaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'>) => void;
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 300px;
`;

const AddTaskForm: React.FC<AddTaskFormProps> = ({ open, onClose, onSubmit }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('TODO');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: taskName,
      description,
      status,
    });
    setTaskName('');
    setDescription('');
    setStatus('TODO');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            label="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            required
            fullWidth
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
            fullWidth
          >
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </StyledForm>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskForm; 