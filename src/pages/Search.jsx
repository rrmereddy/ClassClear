import Sidebar from "../components/SideBarComp/Sidebar"

function Search() {
  return (
    <section className="min-h-screen flex gap-6">
    <Sidebar />
    <div className="m-3 text-2xl text-primary_color font-semibold">
      <h1>Search</h1>
    </div>
  </section>
  )
}

export default Search