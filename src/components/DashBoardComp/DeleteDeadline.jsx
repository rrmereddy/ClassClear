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
  import { useToast } from "@/components/ui/use-toast";
  
  const DeleteDeadline = ({ deadline, onDeleteDeadline }) => { 

    const { toast } = useToast();
  
    const handleDeleteDeadlineCallback = async () => {
      const response = await onDeleteDeadline(deadline);
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
  