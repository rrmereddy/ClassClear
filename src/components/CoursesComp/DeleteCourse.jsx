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
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react";
import { useState } from "react";


const DeleteCourse = ({ course, onDeleteCourse }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const  handleDeleteCourseCallback = async () => {

    setIsDeleting(true);
    await onDeleteCourse(course);
    setIsDeleting(false);
  }


  return (
    <AlertDialog>

      <AlertDialogTrigger className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 absolute bottom-2 right-2">
          <Trash2 size={20} className="text-red-500" />
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
          <AlertDialogAction onClick={() => handleDeleteCourseCallback()} disabled={isDeleting} >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>
  )
}

export default DeleteCourse;
