import { apiCaller } from "@src/api-config";
import { AddLesson as AddLessonType } from "../types/lesson";

import i18n from "../utils/i18next";

const getLessonById = async (id: number) => {
    const path = `/lessons/${id}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const addLesson = async (values: AddLessonType) => {
    const path = "/lessons";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, values);

    return response;
};

const updateLesson = async (values: FormData) => {
    const data = {
        title: values.get("title"),
    };
    
    const path = `/lessons/${values.get("id")}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_PUT"), path, data);

    return response;
};

const deleteLesson = async (id: number) => {
    const path = `/lessons/${id}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_DELETE"), path);

    return response;
};

const LessonApis = {
    addLesson,
    getLessonById,
    updateLesson,
    deleteLesson,
};

export default LessonApis;
