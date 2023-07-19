import apiCaller from "../api-config/apiCaller";
import { HTTP_GET, HTTP_DELETE } from "../utils/contants";
import { getMyCourses as getMyCoursesType, deleteCourse as deleteCourseType } from "../types/course";

export const getMyCourses = async (values: getMyCoursesType) => {
    const path = `courses/search-my-courses?pageIndex=${values.pageIndex}&keyword=${values.keyword}`;

    const response = await apiCaller(HTTP_GET, path);

    return response;
};

export const deleteCourse = async (values: deleteCourseType) => {
    const path = `courses/${values.courseId}`;

    const response = await apiCaller(HTTP_DELETE, path);

    return response;
};
