import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  column: {
    id: string;
    title: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    assignee: string;
  }>;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ column, tasks }) => {
  return (
    <div className="glass-panel p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4 min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;