import Sidebar from "../components/SideBarComp/Sidebar"
import AddCourse  from '../components/CoursesComp/AddCourse';


const Courses = () => {
  return (
    <section className="min-h-screen flex gap-6">
    <Sidebar />
    <div className="m-3 text-2xl text-primary_color font-semibold">
      <AddCourse />
    </div>
  </section>

  )
}

export default Courses;