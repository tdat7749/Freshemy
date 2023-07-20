import apiCaller from "../api-config/apiCaller";
import { HTTP_GET, HTTP_DELETE } from "../utils/contants";
import { GetMyCourses as GetMyCoursesType, DeleteCourse as DeleteCourseType } from "../types/course";

export const getMyCourses = async (values: GetMyCoursesType) => {
    const path = `courses/search-my-courses?pageIndex=${values.pageIndex}&keyword=${values.keyword}`;

    const response = await apiCaller(HTTP_GET, path);

    return response;
};

export const deleteCourse = async (values: DeleteCourseType) => {
    const path = `courses/${values.courseId}`;

    const response = await apiCaller(HTTP_DELETE, path);

    return response;
};
