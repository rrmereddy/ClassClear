import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import './CoursesComp.css';

// Define the schema for validation using zod
const schema = z.object({
  course_name: z.string().max(50, "Course name should not exceed 50 characters").nonempty("Required"),
  university_name: z.string().max(50, "University name should not exceed 50 characters").nonempty("Required"),
  instructor_name: z.string().max(50, "Instructor name should not exceed 50 characters").nonempty("Required"),
  syllabus_file: z.any().optional(),
  syllabus_text: z.string().optional(),
});

const AddCourse = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState("Upload PDF");
  const { toast } = useToast();
  const { handleAddCourse } = useAuth();

  // Integrate react-hook-form and zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = async (data) => {
    const { syllabus_file, syllabus_text, ...rest } = data;

    // Validate syllabus file type if PDF is uploaded
    if (tabValue === "Upload PDF" && syllabus_file?.[0]?.type !== "application/pdf") {
      toast({
        title: "Error",
        description: "Only PDF files are allowed.",
        status: "error",
        style: { borderColor: 'red' },
      });
      return;
    }

    const courseData = {
      ...rest,
      syllabus_file: tabValue === "Upload PDF" ? syllabus_file?.[0] : null,
      syllabus_text: tabValue === "Upload Text" ? syllabus_text : "",
    };

    const result = await handleAddCourse(courseData);
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
        style: { borderColor: 'green' },
      });
      setIsDialogOpen(false);
      reset();
    }
  };

  const handleDialogClose = () => {
    reset();
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) {
        handleDialogClose();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Course</DialogTitle>
          <DialogDescription>
            Be as specific as possible when adding a course.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">
                Course
              </Label>
              <Input
                id="course"
                placeholder="CSCE-120"
                className="col-span-3"
                {...register("course_name")}
              />
              {errors.course_name && (
                <p className="text-red-500 col-span-3">{errors.course_name.message}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="university" className="text-right">
                University
              </Label>
              <Input
                id="university"
                placeholder="Texas A&M University"
                className="col-span-3"
                {...register("university_name")}
              />
              {errors.university_name && (
                <p className="text-red-500 col-span-3">{errors.university_name.message}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructor" className="text-right">
                Instructor
              </Label>
              <Input
                id="instructor"
                placeholder="Pedro Duarte"
                className="col-span-3"
                {...register("instructor_name")}
              />
              {errors.instructor_name && (
                <p className="text-red-500 col-span-3">{errors.instructor_name.message}</p>
              )}
            </div>

            {/* Tab component for choosing between PDF upload or text */}
            <div className="grid grid-cols-6 items-center gap-4">
              <Tabs defaultValue="Upload PDF" className="col-span-6">
                <TabsList>
                  <TabsTrigger value="Upload PDF" onClick={() => setTabValue("Upload PDF")}>Upload PDF</TabsTrigger>
                  <TabsTrigger value="Upload Text" onClick={() => setTabValue("Upload Text")}>Upload Text</TabsTrigger>
                </TabsList>
                <TabsContent value="Upload PDF">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    className="col-span-3 file-input h-12"
                    {...register("syllabus_file")}
                  />
                </TabsContent>
                <TabsContent value="Upload Text">
                  <Textarea
                    id="syllabus"
                    placeholder="Enter syllabus details"
                    className="col-span-3 input-textarea"
                    {...register("syllabus_text")}
                    rows={4}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourse;
