import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface ProjectsHeaderProps {
  projectCount: number;
  onAddProject: () => void;
}

export default function ProjectsHeader({ projectCount, onAddProject }: ProjectsHeaderProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 4 
    }}>
      <Box>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
          Projects
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
          {projectCount} Total Projects
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddProject}
        sx={{
          bgcolor: '#1976D2',
          '&:hover': { bgcolor: '#1565C0' },
          textTransform: 'none',
          borderRadius: '8px',
        }}
      >
        Add New Project
      </Button>
    </Box>
  );
} 