'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Drawer, List} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Button } from '@/components/atoms/Button';
import ProjectListItem from '@/components/molecules/ProjectListItem';
import { fakeProjects, Project } from '@/lib/fakeData';

const SidebarContainer = styled.div`
  width: 100%;
  max-width: 300px;
`;


const SidebarContent = styled.div`
  padding: 16px;
`;

interface SidebarProps {
  onSelectProject: (projectId: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectProject, isOpen }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    onSelectProject(projectId);
  };

  const sidebarContent = (
    <SidebarContainer>
      
      <SidebarContent>
        <Button variant="contained" startIcon={<AddIcon />}>
          New Project
        </Button>
        <List>
          {fakeProjects.map((project: Project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              isSelected={project.id === selectedProjectId}
              onClick={handleProjectClick}
            />
          ))}
        </List>
      </SidebarContent>
    </SidebarContainer>
  );

  return (
    <>
      {/* Mobile view */}
      <Drawer anchor="right" open={isOpen} onClose={() => onSelectProject('')}>
        {sidebarContent}
      </Drawer>

      {/* Desktop view */}
      <div className="hidden md:block">
        {sidebarContent}
      </div>

      {/* Mobile accordion */}
      
    </>
  );
};

export default Sidebar;

