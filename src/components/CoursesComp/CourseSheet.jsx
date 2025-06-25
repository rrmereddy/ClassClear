import { Sheet, SheetContent, SheetHeader, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet"; // Import your sheet from wherever needed
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function CourseSheet({ isOpen, onClose, course }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col space-y-4 p-6">
        <SheetHeader>
          <SheetTitle>
            <div className="text-xl font-bold text-secondary_color">
              {course ? course.course_name : "No Course Selected"}
            </div>
          </SheetTitle>
          <SheetDescription className="text-sm text-muted">
            Information about the course
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col space-y-2">
          <Label>
            <strong className="text-secondary_color">Instructor:</strong> {course?.instructor_name}
          </Label>
          <Label>
            <strong className="text-secondary_color">University:</strong> {course?.university_name}
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="grading">
            <strong className="text-secondary_color">Grading Policy:</strong>
            <p className="text-sm">{course?.grading_policy}</p>
          </Label>
        </div>
        <div>
          <Label htmlFor="attendance">
            <strong className="text-secondary_color">Attendance Policy:</strong>
            <p className="text-sm">{course?.attendance_policy}</p>
          </Label>
        </div>

        <Label htmlFor="additional_info">
          <strong className="text-secondary_color">Additional Information:</strong>
          <div className="space-y-1">
            {course?.additional_info &&
              Object.entries(course.additional_info).map(([key, value], index) => (
                <div key={index} className="text-sm">
                  <strong>{key}:</strong> {value}
                </div>
              ))}
          </div>
        </Label>

        {/* Close button */}
        <SheetClose asChild>
          <Button variant="outline" onClick={onClose} className="mt-4 self-end">
            Close
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

export default CourseSheet;
