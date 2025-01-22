import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";

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

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const TaskCard = ({ task, index }: TaskCardProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Link to={`/tasks/${task.id}`} className="block hover:no-underline">
            <Card className="mb-4 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;