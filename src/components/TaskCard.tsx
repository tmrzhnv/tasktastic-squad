import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    assignee: string;
  };
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task-card"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-800">{task.title}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.priority === "high"
                  ? "priority-high"
                  : task.priority === "medium"
                  ? "priority-medium"
                  : "priority-low"
              }`}
            >
              {task.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{task.assignee}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(task.dueDate), "MMM d")}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;