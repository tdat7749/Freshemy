import apiCaller from "../api-config/apiCaller";
import { CreateCourse as CreateCourseType} from "../types/course";

import { HTTP_GET, HTTP_POST } from "../utils/contants";

export const createCourse = async (values: CreateCourseType) => {
    const path = "/courses";
    const data = {
        title: values.title,
        categories:  values.categories,
        status:  values.status,
        summary:  values.summary,
        description:  values.description,
    };

    const response = await apiCaller(HTTP_POST, path, data);
    return response;
};

export const getCategories = async () => {
    const path = "/courses";
    const response = await apiCaller(HTTP_GET, path);
    return response;
};