"use client";

import { DialogContent, MenuItem, SelectChangeEvent } from "@mui/material";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { TaskStatus } from "./Task";
import StyledDialog from "./atoms/StyledDialog";
import DialogHeader from "./atoms/DialogHeader";
import DialogFooter from "./atoms/DialogFooter";
import StyledTextField from "./atoms/StyledTextField";
import StyledSelect from "./atoms/StyledSelect";

interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    status: TaskStatus;
  }) => void;
  task: {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    status: TaskStatus;
  } | null;
}

const teamMembers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
  { id: "4", name: "Sarah Williams" },
];

const EditTaskDialog = ({
  open,
  onClose,
  onSave,
  task,
}: EditTaskDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "pending" as TaskStatus,
  });

  useEffect(() => {
    if (task && open) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        assignedTo: task.assignedTo || "",
        status: task.status || "pending",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        status: "pending",
      });
    }
  }, [task, open]);

  const handleSubmit = () => {
    if (task) {
      onSave({
        id: task.id,
        ...formData,
      });
      onClose();
    }
  };

  const handleChange =
    (field: string) =>
    (
      event:
        | SelectChangeEvent
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogHeader
        icon={EditIcon}
        title="Edit Task"
        subtitle="Update task details"
      />

      <DialogContent sx={{ p: 3 }}>
        <StyledTextField
          autoFocus
          label="Task Title"
          placeholder="Enter task title"
          fullWidth
          value={formData.title}
          onChange={handleChange("title")}
        />

        <StyledTextField
          label="Description"
          placeholder="Enter task description"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange("description")}
        />

        <StyledSelect
          label="Assigned To"
          value={formData.assignedTo}
          onChange={handleChange("assignedTo")}
          formControlProps={{ sx: { mb: 3 } }}
        >
          {teamMembers.map((member) => (
            <MenuItem key={member.id} value={member.id}>
              {member.name}
            </MenuItem>
          ))}
        </StyledSelect>

        <StyledSelect
          label="Status"
          value={formData.status}
          onChange={handleChange("status")}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </StyledSelect>
      </DialogContent>

      <DialogFooter
        onClose={onClose}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        isSubmitDisabled={
          !formData.title ||
          !formData.description ||
          !formData.assignedTo ||
          !formData.status
        }
      />
    </StyledDialog>
  );
};

export default EditTaskDialog;
