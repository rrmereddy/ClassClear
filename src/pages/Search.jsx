import Sidebar from "../components/SideBarComp/Sidebar"
import { Button } from "@/components/ui/button"


function Search() {
  return (
    <section className="min-h-screen flex gap-6">
    <Sidebar />
    <div className="m-3 text-2xl text-primary_color font-semibold">
      <h1>Search</h1>
      <Button variant='secondary'>Click Me</Button>

    </div>
  </section>
  )
}

export default Search