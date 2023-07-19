import apiCaller from "../api-config/apiCaller";
import { NewCourse as CreateCourseType } from "../types/course";

import { HTTP_GET, HTTP_POST } from "../utils/contants";

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