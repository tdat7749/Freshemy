import { apiCaller } from "@src/api-config";
import {
    ChangeThumbnail as ChangeThumbnailType,
    NewCourse as CreateCourseType,
    GetMyCourses as GetMyCoursesType,
    CourseChangeInformation as CourseChangeInformationType,
    SelectCourse,
    RatingCourse as RatingCourseType,
    EnrollCourse as EnrollCourseType,
    GetRating as GetRatingType,
} from "../types/course";

import i18n from "../utils/i18next";

const createCourse = async (values: CreateCourseType) => {
    const path = "courses/";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, values);

    return response;
};

const getCategories = async () => {
    const path = "categories/";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const getMyCourses = async (values: GetMyCoursesType) => {
    const path = `courses/my-courses?page_index=${values.pageIndex}&keyword=${values.keyword}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const getEnrolledCourses = async (values: GetMyCoursesType) => {
    const path = `courses/enrolled-courses?page_index=${values.pageIndex}&keyword=${values.keyword}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const deleteCourse = async (courseId: number) => {
    const path = `courses/${courseId}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_DELETE"), path);

    return response;
};

const getCourseDetail = async (slug: string) => {
    const path = `courses/${slug}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const getCourseDetailById = async (id: number) => {
    const path = `courses/detail/${id}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const changeThumbnail = async (values: ChangeThumbnailType) => {
    const path = `courses/change-thumbnail`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_PATCH"), path, values);

    return response;
};

const changeInformation = async (values: CourseChangeInformationType) => {
    const path = `courses/information`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_PUT"), path, values);

    return response;
};

const getTop10Courses = async () => {
    const path = `courses/top-10`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const selectCourses = async (values: SelectCourse) => {
    let pathBase = `/courses/all-courses?pageIndex=${values.pageIndex}`;
    if (values.rating) {
        pathBase = pathBase + `&ratings=${values.rating}`;
    }

    if (values.keyword) {
        pathBase = pathBase + `&keyword=${values.keyword}`;
    }

    if (values.sortBy) {
        pathBase = pathBase + `&sortBy=${values.sortBy}`;
    }

    if (values.category) {
        values.category.map((cate) => (pathBase = pathBase + `&categories=${cate}`));
    }

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), pathBase);
    return response;
};

const ratingCourse = async (values: RatingCourseType) => {
    const path = `courses/rating`;
    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, values);
    return response;
};

const subscribeCourse = async (values: EnrollCourseType) => {
    const path = `courses/registration`;
    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, values);
    return response;
};
const unsubcribeCourse = async (values: EnrollCourseType) => {
    const path = `courses/unsubcribe`;
    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_DELETE"), path, values);
    return response;
};
const getRightOfCourse = async (courseId: number) => {
    const path = `courses/right/${courseId}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};
const getListRatingsOfCourseBySlug = async (values: GetRatingType) => {
    const path = `courses/${values.slug}/ratings?page_index=${values.page_index}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

export {
    createCourse,
    getCategories,
    getMyCourses,
    deleteCourse,
    getCourseDetail,
    getCourseDetailById,
    changeThumbnail,
    changeInformation,
    getTop10Courses,
    selectCourses,
    ratingCourse,
    subscribeCourse,
    unsubcribeCourse,
    getRightOfCourse,
    getListRatingsOfCourseBySlug,
    getEnrolledCourses,
};
