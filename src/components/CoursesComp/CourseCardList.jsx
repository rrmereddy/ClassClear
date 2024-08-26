import { Trash2 } from "lucide-react";

function CourseCardList({ courses }) {
    return (
        <div className="flex flex-wrap justify-between gap-4">
            {courses.map((course, index) => (
                <div
                    key={index}
                    className="relative w-44 h-52 flex flex-col items-start justify-center rounded-lg border border-secondary_color whitespace-normal p-4 group"
                >
                    <div className="mb-2 font-bold">Course: {course.name}</div>
                    <div className="mb-2">University: {course.university_name}</div>
                    <div className="mb-2">Instructor: {course.course_instructor}</div>
                    <button
                        onClick={() => console.log("Delete")}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 absolute bottom-2 right-2"
                    >
                        <Trash2 size={20} className="text-red-500" />
                    </button>
                </div>
            ))}
        </div>
    );
}

export default CourseCardList;
