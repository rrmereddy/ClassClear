import { useEffect, useState } from "react";
import { useAuth } from "@/utils/AuthContext";
import CourseCardList from "./CourseCardList";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

function PaginatedCourses({ coursesPerPage, refreshTrigger, onDeleteCourse }) {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { getCourses } = useAuth();

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
    }, [getCourses, refreshTrigger]);

    const totalPages = Math.ceil(courses.length / coursesPerPage);
    const currentCourses = courses.slice(
        (currentPage - 1) * coursesPerPage,
        currentPage * coursesPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="flex flex-col items-center p-5 mt-10">
            <CourseCardList courses={currentCourses} onDeleteCourse={onDeleteCourse} />

            {currentCourses.length > 0 ? (
                <Pagination className={"ml-2"}>
                    <PaginationContent className="flex items-center justify-center space-x-2 mt-2 mr-2">
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                                className={`px-2 py-1 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>

                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="px-2 py-1 rounded hover:bg-gray-700"
                                >
                                    {currentPage - 1}
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        <PaginationItem>
                            <PaginationLink
                                onClick={() => handlePageChange(currentPage)}
                                className="px-2 py-1 rounded bg-secondary_color text-white font-bold mt-2"
                            >
                                {currentPage}
                            </PaginationLink>
                        </PaginationItem>

                        {currentPage < totalPages && (
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="px-2 py-1 rounded hover:bg-gray-700"
                                >
                                    {currentPage + 1}
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {currentPage < totalPages - 1 && <PaginationEllipsis className="px-2 py-1">...</PaginationEllipsis>}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                className={`px-2 py-1 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
                                disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            ) : (
                <span className="mt-4 text-primary_color">Add Some Courses</span>
            )}
        </div>
    );
}

export default PaginatedCourses;
