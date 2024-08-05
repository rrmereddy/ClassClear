import Sidebar from "../components/SideBarComp/Sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import AuthContext from "@/utils/AuthContext"
import { useAuth } from "@/utils/AuthContext"
import axios from "axios"

const Courses = () => {
  const [click, setClick] = useState(false)
  const [courseName, setCourseName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courses, setCourses] = useState([]); //courses is an array of JSONs. Each JSON represents one course

  const { handleAddCourse, getCourses } = useAuth();

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

  function handleCourseName(e) {
    setCourseName(e.target.value);
  }

  function handleUniversityName(e) {
    setUniversityName(e.target.value);
  }

  function handleCourseInstructor(e) {
    setCourseInstructor(e.target.value);
  }

  function handleCourseDescription(e) {
    setCourseDescription(e.target.value);
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!courseName || !universityName || !courseInstructor || !courseDescription) {
      alert("Please fill in all fields");
      return;
    }

    const course = { courseName, universityName, courseInstructor, courseDescription };
    setCourses([...courses, course]);
    await handleAddCourse(course);
  }

  return (
      <section className="min-h-screen flex gap-6">
        <Sidebar />
        <div className="m-3 text-2xl text-primary_color font-semibold">
          <button onClick={() => setClick(!click)} className="bg-green-700 p-4 rounded-xl">
            <FontAwesomeIcon icon={faPlus} className="text-white mr-2" />
            Add Course
          </button>
        </div>
        {click && (
          <div className="m-3 bg-[#171717] border rounded-xl size-fit p-10 text-2xl text-primary_color font-semibold">
            <form onSubmit={handleFormSubmit} className="flex text-black flex-col gap-4">
              <input value={courseName} onChange={handleCourseName} type="text" placeholder="Course Name" className="p-2 rounded-md bg-black" />
              <input value={universityName} onChange={handleUniversityName} type="text" placeholder="University Name" className="p-2 rounded-md bg-black" />
              <input value={courseInstructor} onChange={handleCourseInstructor} type="text" placeholder="Course Instructor" className="p-2 rounded-md bg-black" />
              <input value={courseDescription} onChange={handleCourseDescription} type="text" placeholder="Course Description" className="p-2 rounded-md bg-black" />
              <button type='submit' className="bg-green-700 p-2 rounded-md text-white">Add Course</button>
            </form>
          </div>
        )}
      </section>
  )
}

export default Courses