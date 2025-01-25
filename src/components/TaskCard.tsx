import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type Task = Database['public']['Tables']['tasks']['Row'] & {
  profile?: Database['public']['Tables']['profiles']['Row'];
};

interface TaskCardProps {
  task: Task;
  index: number;
}

const getPriorityColor = (priority: Database['public']['Enums']['task_priority']) => {
  switch (priority) {
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
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging ? `${provided.draggableProps.style?.transform} rotate(2deg)` : provided.draggableProps.style?.transform,
            zIndex: snapshot.isDragging ? 9999 : 'auto',
            position: snapshot.isDragging ? 'relative' : 'static'
          }}
        >
          <Link to={`/tasks/${task.id}`} className="block hover:no-underline">
            <Card className={`mb-4 hover:shadow-md transition-all duration-200 ${
              snapshot.isDragging ? "shadow-xl ring-2 ring-primary/20" : ""
            }`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{task.description}</h3>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{task.profile?.name || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(task.deadline).toLocaleDateString()}</span>
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