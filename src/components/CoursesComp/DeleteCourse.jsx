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
import { useAuth } from "@/utils/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const DeleteCourse = (courseToDelete) => {
  const [course, setCourse] = useState({
    courseName: courseToDelete['course']['name'],
    universityName: courseToDelete['course']['university_name'],
    courseInstructor: courseToDelete['course']['course_description'],
    courseDescription: courseToDelete['course']['course_instructor']
  });

  const { toast } = useToast();
  const { handleDeleteCourse } = useAuth();

  const  handleDeleteCourseCallback = async () => {

    const response = await handleDeleteCourse(course);
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
          <AlertDialogAction onClick={() => handleDeleteCourseCallback()} >Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>
  )
}

export default DeleteCourse;
