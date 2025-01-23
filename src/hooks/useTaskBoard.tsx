import { useState, useCallback } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

type Task = Database['public']['Tables']['tasks']['Row'] & {
  profile?: Database['public']['Tables']['profiles']['Row'];
};

type TaskStatus = Database['public']['Enums']['task_status'];

type Column = {
  id: TaskStatus;
  title: string;
  taskIds: string[];
};

export const useTaskBoard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          description,
          status,
          priority,
          deadline,
          user_id,
          created_at,
          updated_at,
          profile:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  // Organize tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task.id);
    return acc;
  }, {} as Record<TaskStatus, string[]>);

  const columns: Record<TaskStatus, Column> = {
    scheduled: {
      id: 'scheduled',
      title: "Scheduled",
      taskIds: tasksByStatus.scheduled || [],
    },
    in_progress: {
      id: 'in_progress',
      title: "In Progress",
      taskIds: tasksByStatus.in_progress || [],
    },
    completed: {
      id: 'completed',
      title: "Completed",
      taskIds: tasksByStatus.completed || [],
    },
  };

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Database['public']['Tables']['tasks']['Insert'], 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('tasks')
        .insert([newTask]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { draggableId: taskId, destination } = result;
      const newStatus = destination.droppableId as TaskStatus;

      updateTaskMutation.mutate({ taskId, status: newStatus });
    },
    [updateTaskMutation]
  );

  const handleCreateTask = useCallback(
    (newTask: Omit<Database['public']['Tables']['tasks']['Insert'], 'id' | 'created_at' | 'updated_at'>) => {
      createTaskMutation.mutate(newTask);
    },
    [createTaskMutation]
  );

  const getFilteredTasks = useCallback(
    (columnTasks: Task[]) => {
      return columnTasks.filter((task) => {
        const matchesPriority =
          priorityFilter === "all" || task.priority === priorityFilter;
        const matchesAssignee =
          assigneeFilter === "all" || task.profile?.name === assigneeFilter;
        return matchesPriority && matchesAssignee;
      });
    },
    [priorityFilter, assigneeFilter]
  );

  const uniqueAssignees = Array.from(
    new Set(tasks.map((task) => task.profile?.name).filter(Boolean))
  );

  return {
    tasks: tasks.reduce((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {} as Record<string, Task>),
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
    isLoading,
  };
};