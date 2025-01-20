import ProjectsHeader from '@/components/molecules/ProjectsHeader';
import ProjectsGrid from '@/components/organisms/ProjectsGrid';
import type { Project } from '@/types/project';

interface ProjectsContentProps {
  projects: Project[];
  onAddProject: () => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

const ProjectsContent = ({ 
  projects, 
  onAddProject,
  onUpdateProject,
  onDeleteProject 
}: ProjectsContentProps) => (
  <>
    <ProjectsHeader 
      projectCount={projects.length}
      onAddProject={onAddProject}
    />
    <ProjectsGrid 
      projects={projects}
      onEdit={onUpdateProject}
      onDelete={onDeleteProject}
    />
  </>
);

export default ProjectsContent; 