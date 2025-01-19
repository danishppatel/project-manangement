import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface ProjectHeaderProps {
  name: string;
  taskCount: number;
  onAddTask: () => void;
}

const ProjectHeader = ({ name, taskCount, onAddTask }: ProjectHeaderProps) => (
  <Box
    sx={{
      mb: 4,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Box>
      <Typography
        variant="h5"
        sx={{
          color: "white",
          fontWeight: 600,
          mb: 1,
        }}
      >
        {name}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: "rgba(255,255,255,0.7)",
          fontWeight: 400,
        }}
      >
        {taskCount} Tasks
      </Typography>
    </Box>

    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onAddTask}
      sx={{
        bgcolor: "#0052CC",
        "&:hover": {
          bgcolor: "#0047B3",
        },
      }}
    >
      Add New Task
    </Button>
  </Box>
);

export default ProjectHeader;
