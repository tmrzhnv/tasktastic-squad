import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const EditTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  // This is temporary state until we implement backend
  const [task, setTask] = useState({
    title: "Design new landing page",
    description: "Create a modern and engaging landing page design",
    priority: "high",
    dueDate: "2024-03-20",
    assignee: "John Doe",
    status: "scheduled"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement task update logic
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-6">Edit Task</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                placeholder="Task title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                placeholder="Task description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={task.priority}
                  onValueChange={(value) => setTask({ ...task, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assignee</label>
              <Input
                value={task.assignee}
                onChange={(e) => setTask({ ...task, assignee: e.target.value })}
                placeholder="Assignee name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={task.status}
                onValueChange={(value) => setTask({ ...task, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTask;