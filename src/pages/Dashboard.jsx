import Sidebar from "../components/SideBarComp/Sidebar"
import Deadlines from "../components/DashBoardComp/Deadlines"

const Dashboard = () => {
  return (
      <section className="h-screen w-full flex">
        <Sidebar />
        <div className="size-full grid gap-4 grid-rows-4 grid-cols-10 p-4">
          <div className="col-span-5 row-span-3 center glass rounded-3xl p-4">Courses</div>
          <div className="col-span-5 row-span-2 center glass rounded-3xl p-4">
            <Deadlines />
          </div>
          <div className="col-span-5 row-span-1 center glass rounded-3xl p-4">Other Features</div>
          <div className="col-span-10 row-span-4 center glass rounded-3xl p-4">Other Features</div>
        </div>
      </section>

  )
}

export default Dashboard