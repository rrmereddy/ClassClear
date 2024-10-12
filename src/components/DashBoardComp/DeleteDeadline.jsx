import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Trash2 } from "lucide-react";
  import { useAuth } from "@/utils/AuthContext";
  import { useToast } from "@/components/ui/use-toast";
  import { useState } from "react";
  
  const DeleteDeadline = (deadline) => { 
    
    const [deadlineData, setDeadlineData] = useState({
      course_name: deadline['deadline']['course_name'],
      category: deadline['deadline']['category'],
      dueDate: deadline['deadline']['due_date'],
    });
    const { toast } = useToast();
    const { handleDeleteDeadline } = useAuth();
  
    const handleDeleteDeadlineCallback = async () => {
      const response = await handleDeleteDeadline(deadlineData);
      if (response.success) {
        toast({
          title: "Course Deleted",
          description: response.success,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Course Not Deleted",
          description: response.error,
        });
      }
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger className="flex justify-center text-red-500 p-2">
          <Trash2 size={20} className="ml-2" />
        </AlertDialogTrigger>
  
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDeadlineCallback}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default DeleteDeadline;
  