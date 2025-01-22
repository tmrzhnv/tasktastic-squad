import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPanelProps {
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  assigneeFilter: string;
  setAssigneeFilter: (value: string) => void;
  uniqueAssignees: string[];
}

const FilterPanel = ({
  priorityFilter,
  setPriorityFilter,
  assigneeFilter,
  setAssigneeFilter,
  uniqueAssignees,
}: FilterPanelProps) => {
  return (
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
  );
};

export default FilterPanel;