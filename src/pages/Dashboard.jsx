import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/SideBarComp/Sidebar";
import Deadlines from "../components/DashBoardComp/Deadlines";
import AddCourse from "@/components/CoursesComp/AddCourse";
import PaginatedCourses from "@/components/CoursesComp/PaginatedCourses";
import AddDeadline from "@/components/CoursesComp/AddDeadline";
import MobileSidebar from "@/components/SideBarComp/MobileSidebar";

const Dashboard = () => {
  const deadlinesRef = useRef(null);
  const coursesRef = useRef(null);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default value
  const [coursesPerPage, setCoursesPerPage] = useState(4);
  const [desktop, setdesktop] = useState(false);
  useEffect(() => {
      if (window.innerWidth > 500) {
        console.log(window.innerWidth); 
        setdesktop(true);
      } else {
        setdesktop(false);
      }
  
    const updateRowsPerPage = () => {
      if (deadlinesRef.current) {
        const elementHeight = deadlinesRef.current.clientHeight;
        const rowHeight = 100; // Adjust this value according to your row height
        const calculatedRows = Math.floor(elementHeight / rowHeight);

        setRowsPerPage(calculatedRows);
      }

      if (coursesRef.current) {
        const elementWidth = coursesRef.current.clientWidth;
        const cardWidth = 200; // Adjust this value according to your row height
        const calculatedRows = Math.floor(elementWidth / cardWidth);

        setCoursesPerPage(calculatedRows);
        console.log(coursesPerPage);
      }
    };


    updateRowsPerPage();

    window.addEventListener("resize", updateRowsPerPage);


    return () => window.removeEventListener("resize", updateRowsPerPage);
  }, [coursesPerPage]);

  return desktop ? (
  <section className="h-screen w-full flex">
    <Sidebar />
    <div className="size-full grid gap-4 grid-rows-4 grid-cols-10 p-4">
      <div className="col-span-5 row-span-2 center glass rounded-3xl p-4" ref={coursesRef}>
        <div className="absolute top-0 right-0 p-2">
          <AddCourse />
        </div>
        <PaginatedCourses coursesPerPage={coursesPerPage} />
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
      <div className="col-span-5 row-span-1 center glass rounded-3xl p-4">
        Other Features
      </div>
      <div className="col-span-10 row-span-4 center glass rounded-3xl p-4">Other Features</div>
    </div>
  </section>) : (<MobileSidebar/>);
  
}

export default Dashboard;
