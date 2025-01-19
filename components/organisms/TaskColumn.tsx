import { TaskStatus, TaskType } from "@/types";

import Task from "../Task";

import { DroppableClient } from "../DragDropClient";
import StatusColumnHeader from "../molecules/StatusColumnHeader";

import { Box } from "@mui/material";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: TaskType[];
  headerColor: string;
  headerTitle: string;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEdit: (task: TaskType) => void;
  onDelete: (taskId: string) => void;
}

const TaskColumn = ({
  status,
  tasks,
  headerColor,
  headerTitle,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskColumnProps) => (
  <Box sx={{ flex: 1, minWidth: 0 }}>
    <StatusColumnHeader
      title={headerTitle}
      color={headerColor}
      count={tasks.length}
    />
    <DroppableClient status={status}>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          index={index}
          {...task}
          onStatusChange={onStatusChange}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </DroppableClient>
  </Box>
);

export default TaskColumn;
