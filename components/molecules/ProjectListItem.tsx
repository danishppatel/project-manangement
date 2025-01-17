import React from 'react';
import styled from 'styled-components';
import { ListItem, ListItemText, ListItemButton } from '@mui/material';
import { Project } from '@/lib/fakeData';

interface ProjectListItemProps {
  project: Project;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const StyledListItem = styled(ListItem)<{ isselected: string }>`
  && {
    padding: 0;
    background-color: ${(props) => (props.isselected === 'true' ? '#e3f2fd' : 'transparent')};
  }
`;

const StyledListItemButton = styled(ListItemButton)`
  && {
    padding: 16px;
  }
`;

const ProjectListItem: React.FC<ProjectListItemProps> = ({ project, isSelected, onClick }) => {
  return (
    <StyledListItem isselected={isSelected.toString()}>
      <StyledListItemButton onClick={() => onClick(project.id)}>
        <ListItemText
          primary={project.name}
          secondary={`${project.tasksCompleted}/${project.totalTasks} tasks completed`}
        />
      </StyledListItemButton>
    </StyledListItem>
  );
};

export default ProjectListItem;

