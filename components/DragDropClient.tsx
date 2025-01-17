'use client';

import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { TaskStatus } from './Task';

interface DragDropClientProps {
  children: React.ReactNode;
  onDragEnd: (result: { source: string; destination: string; draggableId: string }) => void;
}

export function DragDropClient({ children, onDragEnd }: DragDropClientProps) {
  return <>{children}</>;
}

interface DroppableClientProps {
  status: TaskStatus | 'project';
  children: React.ReactNode;
}

export function DroppableClient({ status, children }: DroppableClientProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    const sourceStatus = e.dataTransfer.getData('sourceStatus');
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex') || '0');
    
    // Get the target index based on the drop position
    const dropTarget = e.currentTarget;
    const children = Array.from(dropTarget.children);
    const targetIndex = children.findIndex(child => {
      const rect = child.getBoundingClientRect();
      return e.clientY < rect.top + rect.height / 2;
    });

    // If dropped at the end
    const finalTargetIndex = targetIndex === -1 ? children.length : targetIndex;

    if (status === 'project') {
      // Handle project reordering
      const event = new CustomEvent('projectDropped', {
        detail: {
          sourceIndex,
          targetIndex: finalTargetIndex
        }
      });
      window.dispatchEvent(event);
    } else if (sourceStatus === status) {
      // Handle task reordering within the same status
      const event = new CustomEvent('taskReordered', {
        detail: {
          taskId,
          status,
          sourceIndex,
          targetIndex: finalTargetIndex
        }
      });
      window.dispatchEvent(event);
    } else {
      // Handle task status change
      const event = new CustomEvent('taskDropped', {
        detail: {
          taskId,
          newStatus: status,
          targetIndex: finalTargetIndex
        }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        minHeight: status === 'project' ? 'auto' : 200,
        backgroundColor: isDraggingOver 
          ? 'rgba(255,255,255,0.05)' 
          : 'transparent',
        transition: 'background-color 0.2s ease',
        borderRadius: 2,
        p: 1,
        outline: isDraggingOver ? '2px dashed rgba(255,255,255,0.2)' : 'none'
      }}
    >
      {children}
    </Box>
  );
}

export function DraggableClient({ 
  id, 
  status,
  index,
  children 
}: { 
  id: string;
  status: TaskStatus | 'project';
  index: number;
  children: React.ReactNode;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('taskId', id);
    e.dataTransfer.setData('sourceStatus', status);
    e.dataTransfer.setData('sourceIndex', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        transform: isDragging ? 'rotate(2deg) scale(1.02)' : 'none',
        transition: 'all 0.2s ease',
        opacity: isDragging ? 0.6 : 1,
        cursor: 'grab'
      }}
    >
      {children}
    </div>
  );
} 