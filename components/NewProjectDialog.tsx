'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (project: { name: string }) => void;
}

const NewProjectDialog = ({ open, onClose, onAdd }: NewProjectDialogProps) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({ name: name.trim() });
      setName('');
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: '#2C2C2C',
          color: 'white',
          minWidth: { xs: '90%', sm: '400px' },
          maxWidth: '90vw',
          borderRadius: '12px',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <AddIcon sx={{ color: '#0052CC', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            New Project
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Add a new project to your dashboard
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <TextField
          autoFocus
          label="Project Name"
          placeholder="Enter project name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.05)',
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0052CC',
              }
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255,255,255,0.7)',
            },
          }}
        />
      </DialogContent>

      <DialogActions 
        sx={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          p: 3,
          gap: 1
        }}
      >
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            color: 'white',
            borderColor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim()}
          sx={{
            bgcolor: '#0052CC',
            '&:hover': {
              bgcolor: '#0047B3'
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(0, 82, 204, 0.5)'
            }
          }}
        >
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewProjectDialog; 