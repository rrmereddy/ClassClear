import DeleteCourse from "./DeleteCourse";

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
                    <DeleteCourse course={course} />
                </div>
            ))}
        </div>
    );
}

export default CourseCardList;
