"use client";

import { DialogContent } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import StyledDialog from "./atoms/StyledDialog";
import DialogHeader from "./atoms/DialogHeader";
import DialogFooter from "./atoms/DialogFooter";
import StyledTextField from "./atoms/StyledTextField";

interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (project: { name: string }) => void;
}

const NewProjectDialog = ({ open, onClose, onAdd }: NewProjectDialogProps) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({ name: name.trim() });
      setName("");
      onClose();
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} width="400px">
      <DialogHeader
        icon={AddIcon}
        title="New Project"
        subtitle="Add a new project to your dashboard"
      />

      <DialogContent sx={{ p: 3 }}>
        <StyledTextField
          autoFocus
          label="Project Name"
          placeholder="Enter project name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>

      <DialogFooter
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Create Project"
        isSubmitDisabled={!name.trim()}
      />
    </StyledDialog>
  );
};

export default NewProjectDialog;
