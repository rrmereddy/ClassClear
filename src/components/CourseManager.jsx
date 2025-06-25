import { useState, useCallback } from 'react';
import { useAuth } from "@/utils/AuthContext";
import PaginatedCourses from '@/components/CoursesComp/PaginatedCourses';
import AddCourse from '@/components/CoursesComp/AddCourse';
import { useToast } from "@/components/ui/use-toast";

function CoursesManager({ count }) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { handleAddCourse, handleDeleteCourse } = useAuth();
    const { toast } = useToast();

    const refreshCourses = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    const addCourse = useCallback(async (courseData) => {
        const result = await handleAddCourse(courseData);
        if (result.success) {
            toast({
                title: "Success",
                description: result.success,
                status: "success",
            });
            refreshCourses();
        } else {
            toast({
                title: "Error",
                variant: "destructive",
                description: result.error,
                status: "error",
            });
        }
        return result;
    }, [handleAddCourse, toast, refreshCourses]);

    const deleteCourse = useCallback(async (course) => {
        const response = await handleDeleteCourse(course);
        if (response.success) {
            toast({
                title: "Course Deleted",
                description: response.success,
            });
            refreshCourses();
        } else {
            toast({
                variant: "destructive",
                title: "Course Not Deleted",
                description: response.error,
            });
        }
        return response;
    }, [handleDeleteCourse, toast, refreshCourses]);

    return (
        <div>
            <div className='absolute top-2 right-2'>
                <AddCourse onAddCourse={addCourse} />
            </div>
            <PaginatedCourses 
                coursesPerPage={count} 
                refreshTrigger={refreshTrigger} 
                onDeleteCourse={deleteCourse}
            />
        </div>
    );
}

export default CoursesManager;