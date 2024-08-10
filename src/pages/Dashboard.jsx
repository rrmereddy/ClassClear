import Sidebar from "../components/SideBarComp/Sidebar"
import Deadlines from "../components/DashBoardComp/Deadlines"
import AddCourse from "@/components/CoursesComp/AddCourse"
import CourseCard from "@/components/CoursesComp/CourseCard"
import AddDeadline from "@/components/CoursesComp/AddDeadline"

const Dashboard = () => {
  
  return (
      <section className="h-screen w-full flex">
        <Sidebar />
        <div className="size-full grid gap-4 grid-rows-4 grid-cols-10 p-4">
          <div className="col-span-5 row-span-3 center glass rounded-3xl p-4">
            <div className="absolute top-0 right-0 p-2">
              <AddCourse />
            </div>
            <CourseCard />
          </div>
          <div className="flex flex-col col-span-5 row-span-2 center glass rounded-3xl p-2">
            <div className="absolute top-5 left-auto">Deadlines</div> 
            <div className="absolute top-0 right-0 p-2">
              <AddDeadline />
            </div>
              <div className="w-full mt-10">
                <Deadlines />
              </div>
          </div>
          <div className="col-span-5 row-span-1 center glass rounded-3xl p-4">Other Features</div>
          <div className="col-span-10 row-span-4 center glass rounded-3xl p-4">Other Features</div>
        </div>
      </section>

  )
}

export default Dashboard