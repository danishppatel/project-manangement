"use client";

import { DialogContent, MenuItem } from "@mui/material";
import { useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { TaskStatus } from "./Task";
import StyledDialog from "./atoms/StyledDialog";
import DialogHeader from "./atoms/DialogHeader";
import DialogFooter from "./atoms/DialogFooter";
import StyledTextField from "./atoms/StyledTextField";
import StyledSelect from "./atoms/StyledSelect";

interface NewTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: {
    title: string;
    description: string;
    assignedTo?: string;
    status: TaskStatus;
  }) => void;
}

// Dummy team members data
const teamMembers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
  { id: "4", name: "Sarah Williams" },
];

const NewTaskDialog = ({ open, onClose, onAdd }: NewTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const handleSubmit = () => {
    if (title && description) {
      onAdd({
        title,
        description,
        ...(assignedTo ? { assignedTo } : {}),
        status: "PENDING", // Always pending for new tasks
      });
      // Reset form
      setTitle("");
      setDescription("");
      setAssignedTo("");
      onClose();
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogHeader
        icon={AssignmentIcon}
        title="Create New Task"
        subtitle="Add a new task to your project"
      />

      <DialogContent sx={{ p: 3 }}>
        <StyledTextField
          autoFocus
          label="Task Title"
          placeholder="Enter task title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <StyledTextField
          label="Description"
          placeholder="Enter task description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <StyledSelect
          label="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value as string)}
        >
          {teamMembers.map((member) => (
            <MenuItem key={member.id} value={member.id}>
              {member.name}
            </MenuItem>
          ))}
        </StyledSelect>
      </DialogContent>

      <DialogFooter
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Create Task"
        isSubmitDisabled={!title || !description }
      />
    </StyledDialog>
  );
};

export default NewTaskDialog;
