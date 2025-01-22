import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import TaskColumn from "./TaskColumn";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateTaskDialog from "./CreateTaskDialog";
import FilterPanel from "./FilterPanel";
import { useTaskBoard } from "@/hooks/useTaskBoard";

const TaskBoard = () => {
  const {
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
  } = useTaskBoard();

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

        <FilterPanel
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          assigneeFilter={assigneeFilter}
          setAssigneeFilter={setAssigneeFilter}
          uniqueAssignees={uniqueAssignees}
        />

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