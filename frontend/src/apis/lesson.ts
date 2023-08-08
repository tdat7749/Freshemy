import { apiCaller } from "@src/api-config";
import { AddLesson as AddLessonType, deteleLessonType } from "../types/lesson";

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
    const path = `/lessons/${values.get("id")}`;
    values.delete("id");
    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_PUT"), path, values);

    return response;
};

const deleteLesson = async (values: deteleLessonType) => {
    const path = `/lessons/${values.id}/${values.course_id}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_DELETE"), path);

    return response;
};

const getLessonOrder = async (id: number) => {
    const path = `/lessons/${id}/lessonOrder`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const LessonApis = {
    getLessonOrder,
    addLesson,
    getLessonById,
    updateLesson,
    deleteLesson,
};

export default LessonApis;
