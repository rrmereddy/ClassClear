import DeleteCourse from "./DeleteCourse";

function CourseCardList({ courses }) {
    return (
        <div className="flex flex-wrap justify-between gap-4">
            {courses.map((course, index) => (
                <div
                    key={index}
                    className="relative w-44 h-52 flex flex-col items-start justify-center rounded-lg border border-secondary_color whitespace-normal p-4 group"
                >
                    <div className="mb-2 flex flex-col"> <span className="font-bold text-secondary_color">Course:</span> {course.course_name}</div>
                    <div className="mb-2 flex flex-col"><span className="font-bold text-secondary_color">University:</span> {course.university_name}</div>
                    <div className="mb-2 flex flex-col"><span className="font-bold text-secondary_color">Instructor:</span> {course.instructor_name}</div>
                    <DeleteCourse course={course} />
                </div>
            ))}
        </div>
    );
}

export default CourseCardList;
