import DialogHeader from "../atoms/DialogHeader";
import ProjectDialogContent from "../molecules/ProjectDialogContent";
import StyledDialog from "../atoms/StyledDialog";
import AddIcon from "@mui/icons-material/Add";

interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { name: string }) => void;
}

const NewProjectDialog = ({ open, onClose, onAdd }: NewProjectDialogProps) => (
  <StyledDialog open={open} onClose={onClose}>
    <DialogHeader
      icon={AddIcon}
      title="Create New Project"
      subtitle="Add a new project to your workspace"
    />

    <ProjectDialogContent
      onSubmit={(data) => {
        onAdd(data);
        onClose();
      }}
    />
  </StyledDialog>
);

export default NewProjectDialog; 