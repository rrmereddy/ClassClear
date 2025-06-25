import { useState } from "react";
import DeleteCourse from "./DeleteCourse";
import CourseSheet from "./CourseSheet";
import { Expand } from "lucide-react";

function CourseCardList({ courses, onDeleteCourse }) {
  // State to manage the sheet open/close state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // Optionally track the selected course

  // Function to open the sheet and set the selected course (optional)
  const handleOpenSheet = (course) => {
    setSelectedCourse(course);
    setIsSheetOpen(true);
    console.log(course)
  };

  return (
    <div className="flex flex-wrap justify-between gap-4">
      {courses.map((course, index) => (
        <div
          key={index}
          className="relative w-44 h-52 flex flex-col items-start justify-center rounded-lg border border-secondary_color whitespace-normal p-4 group"
        >
          <div className="mb-2 flex flex-col">
            <span className="font-bold text-secondary_color">Course:</span> {course.course_name}
          </div>
          <div className="mb-2 flex flex-col">
            <span className="font-bold text-secondary_color">University:</span> {course.university_name}
          </div>
          <div className="mb-2 flex flex-col">
            <span className="font-bold text-secondary_color">Instructor:</span> {course.instructor_name}
          </div>
          <DeleteCourse course={course} onDeleteCourse={onDeleteCourse} />
          {/* Add a button or trigger to open the sheet */}
          <button
            onClick={() => handleOpenSheet(course)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 absolute top-2 right-2"
          >
            <Expand size={20} />
          </button>
        </div>
      ))}
      {/* Sheet component */}
      <CourseSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        course={selectedCourse} // Pass selected course if needed
      />
    </div>
  );
}

export default CourseCardList;
