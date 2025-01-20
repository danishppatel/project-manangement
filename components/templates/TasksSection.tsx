import ProjectHeader from "../molecules/ProjectHeader";
import { TaskStatus } from "@/types";

import { Project } from "@/types";
import { TaskType } from "@/types";
import { Box, Typography } from "@mui/material";
import Task from "../Task";

interface TasksSectionProps {
  selectedProject?: Project;
  groupedTasks: {
    pending: TaskType[];
    in_progress: TaskType[];
    completed: TaskType[];
  };
  statusHeaders: {
    [key: string]: { title: string; color: string };
  };
  onAddTask: () => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (taskId: string) => void;
}

const TasksSection = ({
  selectedProject,
  groupedTasks,
  statusHeaders,
  onAddTask,
  onStatusChange,
  onEditTask,
  onDeleteTask,
}: TasksSectionProps) => (
  <Box
    sx={{
      flexGrow: 1,
      p: { xs: 2, sm: 3 },
      width: { xs: "100%", md: "65%" },
      bgcolor: "#1E1F21",
      overflowY: "auto",
    }}
  >
    <ProjectHeader
      name={selectedProject?.name}
      taskCount={selectedProject?.tasks?.length}
      onAddTask={onAddTask}
    />

    {/* <DragDropClient
      onDragEnd={({ source, destination, draggableId }) => {
        if (!destination) return;

        onDragEnd({
            source: { droppableId: source, index: 0 },
            destination: { droppableId: destination, index: 0 },
            draggableId,
            mode: "FLUID",
            reason: "DROP",
            combine: null,
            type: ""
        });
      }}
    > */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",            // 1 column for mobile (<768px)
            md: "repeat(3, 3fr)"  // 3 columns for screens >= 768px
          },
        }}
      >
        {(Object.keys(groupedTasks) as Array<keyof typeof groupedTasks>).map(
          (status) => (
            <Box
              key={status}
              sx={{
                minWidth: 0,
              }}
            >
              {/* Status Header */}
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  backgroundColor: `${statusHeaders[status].color}10`,
                  borderRadius: "8px",
                  border: `1px solid ${statusHeaders[status].color}30`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: statusHeaders[status].color,
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    {statusHeaders[status].title}
                  </Typography>
                  <Typography
                    sx={{
                      ml: "auto",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {groupedTasks[status].length}
                  </Typography>
                </Box>
              </Box>

              {/* <DroppableClient status={status}> */}
                {groupedTasks[status].map((task, index) => (
                  <Task
                    key={task.id}
                    index={index}
                    {...task}
                    onStatusChange={onStatusChange}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              {/* </DroppableClient> */}
            </Box>
          )
        )}
      </Box>
    {/* </DragDropClient> */}
  </Box>
);

export default TasksSection;
