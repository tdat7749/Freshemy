import apiCaller from "../api-config/apiCaller";
import {
    ChangeThumbnail as ChangeThumbnailType,
    NewCourse as CreateCourseType,
    GetMyCourses as GetMyCoursesType,
    CourseChangeInformation as CourseChangeInformationType,
} from "../types/course";

import { HTTP_GET, HTTP_POST, HTTP_DELETE, HTTP_PATCH, HTTP_PUT } from "../utils/contants";

const createCourse = async (values: CreateCourseType) => {
    const path = "courses/";

    const response = await apiCaller(HTTP_POST, path, values);
    return response;
};

const getCategories = async () => {
    const path = "categories/";
    const response = await apiCaller(HTTP_GET, path);
    return response;
};

const getMyCourses = async (values: GetMyCoursesType) => {
    const path = `courses/search-my-courses?pageIndex=${values.pageIndex}&keyword=${values.keyword}`;

    const response = await apiCaller(HTTP_GET, path);

    return response;
};

const deleteCourse = async (courseId: number) => {
    const path = `courses/${courseId}`;

    const response = await apiCaller(HTTP_DELETE, path);

    return response;
};

const getCourseDetail = async (slug: string) => {
    const path = `courses/${slug}`;

    const response = await apiCaller(HTTP_GET, path);

    return response;
};

const getCourseDetailById = async (id: number) => {
    const path = `courses/detail/${id}`;

    const response = await apiCaller(HTTP_GET, path);

    return response;
};

const changeThumbnail = async (values: ChangeThumbnailType) => {
    const path = `courses/change-thumbnail`;

    const response = await apiCaller(HTTP_PATCH, path, values);

    return response;
};

const changeInformation = async (values: CourseChangeInformationType) => {
    const path = `courses/change-information`;

    const response = await apiCaller(HTTP_PUT, path, values);

    return response;
};

const getTop10Courses = async () => {
    const path = `courses/top-10`;

    const response = await apiCaller(HTTP_GET, path);

    return response;
};

const CourseApis = {
    createCourse,
    getCategories,
    getMyCourses,
    deleteCourse,
    getCourseDetail,
    getCourseDetailById,
    changeThumbnail,
    changeInformation,
    getTop10Courses,
};

export default CourseApis;
