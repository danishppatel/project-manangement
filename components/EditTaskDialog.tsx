'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { TaskStatus } from './Task';

interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: { id: string; title: string; description: string; assignedTo: string; status: TaskStatus }) => void;
  task: { id: string; title: string; description: string; assignedTo: string; status: TaskStatus } | null;
}

const teamMembers = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Williams' }
];

const EditTaskDialog = ({ open, onClose, onSave, task }: EditTaskDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'pending' as TaskStatus
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (task && open) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assignedTo: task.assignedTo || '',
        status: task.status || 'pending'
      });
    } else {
      // Reset form when dialog closes
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        status: 'pending'
      });
    }
  }, [task, open]);

  const handleSubmit = () => {
    if (task) {
      onSave({
        id: task.id,
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        status: formData.status
      });
      onClose();
    }
  };

  const handleChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: '#2C2C2C',
          color: 'white',
          minWidth: { xs: '90%', sm: '500px' },
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
        <EditIcon sx={{ color: '#0052CC', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Task
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Update task details
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <TextField
          autoFocus
          label="Task Title"
          placeholder="Enter task title"
          fullWidth
          value={formData.title}
          onChange={handleChange('title')}
          sx={{
            mb: 3,
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

        <TextField
          label="Description"
          placeholder="Enter task description"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange('description')}
          sx={{
            mb: 3,
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

        <FormControl 
          fullWidth 
          sx={{ 
            mb: 3,
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
            '& .MuiMenuItem-root': {
              color: 'black'
            }
          }}
        >
          <InputLabel>Assigned To</InputLabel>
          <Select
            value={formData.assignedTo}
            label="Assigned To"
            onChange={handleChange('assignedTo')}
          >
            {teamMembers.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl 
          fullWidth
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
            '& .MuiMenuItem-root': {
              color: 'black'
            }
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            label="Status"
            onChange={handleChange('status')}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
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
          disabled={!formData.title || !formData.description || !formData.assignedTo || !formData.status}
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
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskDialog; 