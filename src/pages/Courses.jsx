import Sidebar from "../components/SideBarComp/Sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

const Courses = () => {
  const [click, setClick] = useState(false)

  const handleFormSubmit = (e) => {
    e.preventDefault()
    // Add course to the database
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
              <input type="text" placeholder="Course Name" className="p-2 rounded-md bg-black" />
              <input type="text" placeholder="Course Code" className="p-2 rounded-md bg-black" />
              <input type="text" placeholder="Course Instructor" className="p-2 rounded-md bg-black" />
              <input type="text" placeholder="Course Description" className="p-2 rounded-md bg-black" />
              <button type='submit' className="bg-green-700 p-2 rounded-md text-white">Add Course</button>
            </form>
          </div>
        )}
      </section>
  )
}

export default Courses