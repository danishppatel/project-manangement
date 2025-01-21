'use client';

import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { DraggableClient } from './DragDropClient';

interface DraggableProjectProps {
  project: {
    id: string;
    name: string;
    tasks?: unknown[];
  };
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const DraggableProject = ({ project, index, isSelected, onSelect }: DraggableProjectProps) => {
  return (
    <DraggableClient id={project.id} status="project" index={index}>
      <ListItem disablePadding>
        <ListItemButton 
          selected={isSelected}
          onClick={onSelect}
          sx={{
            borderRadius: 1,
            mb: 1,
            color: 'white',
            '&.Mui-selected': {
              backgroundColor: '#0052CC',
              '&:hover': {
                backgroundColor: '#0047B3',
              }
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          <ListItemText 
            primary={project?.name}
            secondary={`${project?.tasks?.length || 0} tasks`}
            primaryTypographyProps={{
              fontWeight: 500,
              color: 'inherit'
            }}
            secondaryTypographyProps={{
              color: 'rgba(255,255,255,0.7)'
            }}
          />
        </ListItemButton>
      </ListItem>
    </DraggableClient>
  );
};

export default DraggableProject; 