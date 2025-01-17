import React, { useState } from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Add as AddIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Button } from '@/components/atoms/Button';
import AddTaskForm from '@/components/molecules/AddTaskForm';

const StyledAppBar = styled(AppBar)`
  && {
    background-color: #ffffff;
    color: #000000;
  }
`;

const StyledToolbar = styled(Toolbar)`
  && {
    justify-content: space-between;
  }
`;

interface HeaderProps {
  selectedProject: string | null;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedProject, onAddTask, onToggleSidebar }) => {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    onAddTask(task);
  };

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onToggleSidebar}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              {selectedProject || 'Select a Project'}
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddTaskDialogOpen(true)}
            disabled={!selectedProject}
          >
            Add New Task
          </Button>
        </StyledToolbar>
      </StyledAppBar>

      <AddTaskForm
        open={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  );
};

export default Header;

