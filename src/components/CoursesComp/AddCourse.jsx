import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAuth } from "@/utils/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const AddCourse = () => {
  const [course, setCourse] = useState({
    courseName: '',
    universityName: '',
    courseInstructor: '',
    courseDescription: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { handleAddCourse } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!course.courseName || !course.universityName || !course.courseInstructor || !course.courseDescription) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        style: { borderColor: 'red' } // Custom border color for error
      });
      return;
    }


    const result = await handleAddCourse(course);
    if (result.error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: result.error,
        status: "error",
      });
    } else {
      toast({
        title: "Success",
        description: result.success,
        status: "success",
        style: { borderColor: 'green' } // Custom border color for success
      });
      setIsDialogOpen(false);
    }
  }

  const handleCourseChange = (e) => {
    setCourse(prev=>({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleDialogClose = () => {
    setCourse({
      courseName: '',
      universityName: '',
      courseInstructor: '',
      courseDescription: ''
    });
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) {
        handleDialogClose();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Add Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Course</DialogTitle>
          <DialogDescription>
            Be as specific as possible when adding a course. Other users can also add the same course.
          </DialogDescription>
        </DialogHeader>
        <form action="submit" onSubmit={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">
                Course
              </Label>
              <Input
                id="course"
                placeholder="CSCE-120"
                className="col-span-3"
                name="courseName"
                onChange={handleCourseChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="university" className="text-right">
                University
              </Label>
              <Input
                id="university"
                placeholder="Texas A&M University"
                className="col-span-3"
                name="universityName"
                onChange={handleCourseChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Instructor" className="text-right">
                Instructor
              </Label>
              <Input
                id="instructor"
                placeholder="Pedro Duarte"
                className="col-span-3"
                name="courseInstructor"
                onChange={handleCourseChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="This is a course about computer science."
                className="col-span-3"
                name="courseDescription"
                onChange={handleCourseChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddCourse;
