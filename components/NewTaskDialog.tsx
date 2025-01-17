import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { TaskStatus } from './Task';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface NewTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: { title: string; description: string; assignedTo: string; status: TaskStatus }) => void;
}

// Dummy team members data
const teamMembers = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Sarah Williams' }
];

const NewTaskDialog = ({ open, onClose, onAdd }: NewTaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = () => {
    if (title && description && assignedTo) {
      onAdd({
        title,
        description,
        assignedTo,
        status: 'pending' // Always pending for new tasks
      });
      // Reset form
      setTitle('');
      setDescription('');
      setAssignedTo('');
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
          minWidth: '500px',
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
        <AssignmentIcon sx={{ color: '#0052CC', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create New Task
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Add a new task to your project
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <TextField
          autoFocus
          label="Task Title"
          placeholder="Enter task title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
            value={assignedTo}
            label="Assigned To"
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            {teamMembers.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.name}
              </MenuItem>
            ))}
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
          disabled={!title || !description || !assignedTo}
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
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTaskDialog; 