import ProjectsHeader from '@/components/molecules/ProjectsHeader';
import ProjectsGrid from '@/components/organisms/ProjectsGrid';
import type { Project } from '@/types/project';

interface ProjectsContentProps {
  projects: Project[];
  onAddProject: () => void;
}

const ProjectsContent = ({ projects, onAddProject }: ProjectsContentProps) => (
  <>
    <ProjectsHeader 
      projectCount={projects.length}
      onAddProject={onAddProject}
    />
    <ProjectsGrid projects={projects} />
  </>
);

export default ProjectsContent; 