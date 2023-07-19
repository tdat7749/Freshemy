import apiCaller from "../api-config/apiCaller";
import { AddLesson as AddLessonType } from "../types/lesson";
import { HTTP_POST } from "../utils/contants";

export const addLesson = async (values: AddLessonType) => {
    const path = "/lessons";

    const response = await apiCaller(HTTP_POST, path, values);

    return response;
};
