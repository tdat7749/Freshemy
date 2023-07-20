import apiCaller from "../api-config/apiCaller";
import {
    NewCourse as CreateCourseType,
    getMyCourses as getMyCoursesType,
    deleteCourse as deleteCourseType,
} from "../types/course";

import { HTTP_GET, HTTP_POST, HTTP_DELETE } from "../utils/contants";

export const createCourse = async (values: CreateCourseType) => {
    const path = "courses/";

    const response = await apiCaller(HTTP_POST, path, values);
    return response;
};

export const getCategories = async () => {
    const path = "/categories";
    const response = await apiCaller(HTTP_GET, path);
    return response;
};

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

export const getCourseDetail = async (slug: string) => {
    const path = `courses/${slug}`;

    const response = await apiCaller(HTTP_GET, path);

    return response;
};
