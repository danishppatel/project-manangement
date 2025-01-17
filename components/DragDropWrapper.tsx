'use client';

import { DragDropContext, Droppable, DropResult, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { Box } from '@mui/material';
import { TaskStatus } from './Task';

interface DragDropWrapperProps {
  children: React.ReactNode;
  onDragEnd: (result: DropResult) => void;
}

const DragDropWrapper = ({ children, onDragEnd }: DragDropWrapperProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  );
};

export const DroppableWrapper = ({ 
  status, 
  children 
}: { 
  status: TaskStatus; 
  children: React.ReactNode;
}) => {
  return (
    <Droppable droppableId={status}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            minHeight: 200,
            backgroundColor: snapshot.isDraggingOver 
              ? 'rgba(255,255,255,0.05)' 
              : 'transparent',
            transition: 'background-color 0.2s ease',
            borderRadius: 2,
            p: 1
          }}
        >
          {children}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default DragDropWrapper; 