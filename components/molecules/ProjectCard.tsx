import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import type { Project } from '@/types/project';
import ProgressBar from '../atoms/ProgressBar';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  
  const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const taskStats = {
    completed: project.tasks.filter(task => task.status === 'completed').length,
    inProgress: project.tasks.filter(task => task.status === 'in_progress').length,
    pending: project.tasks.filter(task => task.status === 'pending').length
  };

  return (
    <Card 
      onClick={() => router.push(`/projects/${project.id}`)}
      sx={{
        bgcolor: '#2A2A2A',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        },
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
            {project.name}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <ProgressBar value={progress} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', mb: 0.5 }}>
              Tasks Status
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={`${taskStats.completed} Done`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(76, 175, 80, 0.1)',
                  color: '#4CAF50',
                  fontSize: '0.75rem'
                }}
              />
              <Chip 
                label={`${totalTasks - taskStats.completed} Left`}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255, 152, 0, 0.1)',
                  color: '#FFA726',
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', mb: 0.5 }}>
              Tasks
            </Typography>
            <Typography sx={{ color: 'white', fontSize: '0.875rem', textAlign: 'right' }}>
              {completedTasks}/{totalTasks}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
} 