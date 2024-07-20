import Sidebar from "../components/SideBarComp/Sidebar"

const Dashboard = () => {
  return (
    <section className="min-h-screen flex gap-6">
      <Sidebar />
      <div className="m-3 text-2xl text-primary_color font-semibold">
        <h1>Dashboard</h1>
      </div>
    </section>

  )
}

export default Dashboard