import Sidebar from "../components/SideBarComp/Sidebar"
import AddCourse  from '../components/CoursesComp/AddCourse';
import CourseCardList from "@/components/CoursesComp/CourseCardList";
import { useEffect, useState } from "react";
import { useAuth } from "@/utils/AuthContext";


const Courses = () => {
    const [courses, setCourses] = useState([]);
    const { getCourses } = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const coursesData = await getCourses();
                setCourses(coursesData);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, [getCourses]);
  return (
    <section className="min-h-screen flex gap-6">
    <Sidebar />
    <div className="flex flex-col items-center flex-grow">
        <div className="w-full flex justify-end p-4">
        <AddCourse />
        </div>
        <div className="w-full flex justify-center">
        <CourseCardList courses={courses} />
        </div>
    </div>
    </section>



  )
}

export default Courses;