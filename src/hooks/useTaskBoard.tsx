import React from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assignee: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface TaskState {
  [key: string]: Task;
}

interface ColumnState {
  [key: string]: Column;
}

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

export const useTaskBoard = () => {
  const [tasks, setTasks] = React.useState<TaskState>(initialTasks);
  const [columns, setColumns] = React.useState<ColumnState>(initialColumns);
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

  return {
    tasks,
    columns,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    handleDragEnd,
    handleCreateTask,
    getFilteredTasks,
    uniqueAssignees,
  };
};