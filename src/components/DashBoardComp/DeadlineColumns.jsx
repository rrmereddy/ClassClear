import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteDeadline from "./DeleteDeadline";

const DeadlineColumn = [
  {
    accessorKey: "course_name", 
    header: "Course Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <span>Due date</span>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-5 w-5"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
              <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const dueDate = new Date(row.original.due_date);
      return dueDate.toISOString().split('T')[0]; 
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
          <DeleteDeadline deadline={row.original} />
      );
    },
  },
];

export default DeadlineColumn;
