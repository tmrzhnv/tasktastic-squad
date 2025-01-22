import React from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TaskColumn from "./TaskColumn";
import { PlusCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateTaskDialog from "./CreateTaskDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialColumns = {
  scheduled: {
    id: "scheduled",
    title: "Scheduled",
    taskIds: ["1", "2"],
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    taskIds: ["3"],
  },
  completed: {
    id: "completed",
    title: "Completed",
    taskIds: ["4"],
  },
};

const initialTasks = {
  "1": {
    id: "1",
    title: "Design new landing page",
    description: "Create a modern and engaging landing page design",
    priority: "high",
    dueDate: "2024-03-20",
    assignee: "John Doe",
  },
  "2": {
    id: "2",
    title: "Update user documentation",
    description: "Review and update the user guide",
    priority: "medium",
    dueDate: "2024-03-25",
    assignee: "Jane Smith",
  },
  "3": {
    id: "3",
    title: "Fix navigation bug",
    description: "Debug and fix the navigation menu issue",
    priority: "high",
    dueDate: "2024-03-18",
    assignee: "Mike Johnson",
  },
  "4": {
    id: "4",
    title: "Optimize database queries",
    description: "Improve database performance",
    priority: "low",
    dueDate: "2024-03-15",
    assignee: "Sarah Wilson",
  },
};

const TaskBoard = () => {
  const [tasks, setTasks] = React.useState(initialTasks);
  const [columns, setColumns] = React.useState(initialColumns);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>("all");

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
  };

  const handleCreateTask = (newTask: any) => {
    const taskId = Date.now().toString();
    setTasks({
      ...tasks,
      [taskId]: { ...newTask, id: taskId },
    });
    setColumns({
      ...columns,
      scheduled: {
        ...columns.scheduled,
        taskIds: [...columns.scheduled.taskIds, taskId],
      },
    });
    setIsCreateDialogOpen(false);
  };

  const getFilteredTasks = (columnTasks: any[]) => {
    return columnTasks.filter((task) => {
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesAssignee =
        assigneeFilter === "all" || task.assignee === assigneeFilter;
      return matchesPriority && matchesAssignee;
    });
  };

  const uniqueAssignees = Array.from(
    new Set(Object.values(tasks).map((task) => task.assignee))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Task Board</h1>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Add Task
          </Button>
        </div>

        <div className="mb-6 flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {uniqueAssignees.map((assignee) => (
                <SelectItem key={assignee} value={assignee}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(columns).map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={getFilteredTasks(
                  column.taskIds.map((taskId) => tasks[taskId])
                )}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

export default TaskBoard;
