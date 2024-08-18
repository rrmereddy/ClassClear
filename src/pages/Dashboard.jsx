import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/SideBarComp/Sidebar";
import Deadlines from "../components/DashBoardComp/Deadlines";
import AddCourse from "@/components/CoursesComp/AddCourse";
import CourseCard from "@/components/CoursesComp/CourseCard";
import AddDeadline from "@/components/CoursesComp/AddDeadline";

const Dashboard = () => {
  const deadlinesRef = useRef(null);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default value

  useEffect(() => {
    const updateRowsPerPage = () => {
      if (deadlinesRef.current) {
        const elementHeight = deadlinesRef.current.clientHeight;
        const rowHeight = 100; // Adjust this value according to your row height
        const calculatedRows = Math.floor(elementHeight / rowHeight);

        setRowsPerPage(calculatedRows);
      }
    };

    // Initial calculation
    updateRowsPerPage();

    // Add a resize listener to update rows per page when the window size changes
    window.addEventListener("resize", updateRowsPerPage);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", updateRowsPerPage);
  }, []);

  return (
    <section className="h-screen w-full flex">
      <Sidebar />
      <div className="size-full grid gap-4 grid-rows-4 grid-cols-10 p-4">
        <div className="col-span-5 row-span-2 center glass rounded-3xl p-4">
          <div className="absolute top-0 right-0 p-2">
            <AddCourse />
          </div>
          <CourseCard />
        </div>
        <div className="flex flex-col col-span-5 row-span-3 center glass rounded-3xl p-2" ref={deadlinesRef}>
          <div className="absolute top-5 left-auto">Deadlines</div> 
          <div className="absolute top-0 right-0 p-2">
            <AddDeadline />
          </div>
          <div className="w-full mt-10">
            <Deadlines rowsPerPage={rowsPerPage} />
          </div>
        </div>
        <div className="col-span-5 row-span-1 center glass rounded-3xl p-4">Other Features</div>
        <div className="col-span-10 row-span-4 center glass rounded-3xl p-4">Other Features</div>
      </div>
    </section>
  )
}

export default Dashboard;
