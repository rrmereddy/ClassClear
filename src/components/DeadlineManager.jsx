import { useState, useCallback } from 'react';
import { useAuth } from "@/utils/AuthContext";
import AddDeadline from './DashBoardComp/AddDeadline';
import Deadlines from './DashBoardComp/Deadlines';
import DeleteDeadline from './DashBoardComp/DeleteDeadline';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";



function DeadlineManager({ count }) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { handleAddDeadline, handleDeleteDeadline } = useAuth();
    const { toast } = useToast();

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
          accessorKey: "refreshTrigger",
          header: () => {
            return (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="fixed right-1/6"
                  onClick={refreshDeadlines}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            );
          },
          cell: ({ row }) => {
            return row.original.refreshTrigger;
          }
        },
        {
          id: "actions",
          cell: ({ row }) => {
            return (
                <DeleteDeadline deadline={row.original} onDeleteDeadline={deleteDeadline} />
            );
          },
        },
      ];
      
    const refreshDeadlines = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    const addDeadline = useCallback(async (courseData) => {
        const result = await handleAddDeadline(courseData);
        if (result.success) {
            toast({
                title: "Success",
                description: result.success,
                status: "success",
            });
            refreshDeadlines();
        } else {
            toast({
                title: "Error",
                variant: "destructive",
                description: result.error,
                status: "error",
            });
        }
        return result;
    }, [handleAddDeadline, toast, refreshDeadlines]);

    const deleteDeadline = useCallback(async (course) => {
        console.log(course)
        const response = await handleDeleteDeadline(course);
        if (response.success) {
            toast({
                title: "Deadline Deleted",
                description: response.success,
            });
            refreshDeadlines();
        } else {
            toast({
                variant: "destructive",
                title: "Deadline Not Deleted",
                description: response.error,
            });
        }
        return response;
    }, [handleDeleteDeadline, toast, refreshDeadlines]);

    return (
        <div>
            <div className="absolute top-0 right-0 p-2">
                <AddDeadline onAddDeadline={addDeadline}/>
            </div>
            <Deadlines 
                deadlineColumns={DeadlineColumn}
                deadlinesPerPage={count} 
                refreshTrigger={refreshTrigger} 
            />
        </div>
    );
}

export default DeadlineManager;