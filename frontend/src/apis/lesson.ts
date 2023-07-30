import { apiCaller } from "@src/api-config";
import { AddLesson as AddLessonType, UpdateLesson as UpdateLessonType } from "../types/lesson";

import i18n from "../utils/i18next";

const addLesson = async (values: AddLessonType) => {
    const path = "/lessons";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, values);

    return response;
};

const updateLesson = async (values: UpdateLessonType) => {
    const path = `/lesson/${values.id}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_PUT"), path, values);

    return response;
};

const deleteLesson = async (id: number) => {
    const path = `/lessons/${id}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_DELETE"), path);

    return response;
};

const getLessonOrder = async (id: number) => {
    const path = `/lessons/${id}/lessonOrder`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const reOrderLesson = async (values: any) => {
    const path = `/lessons/reOrderLesson`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_PUT"), path, values);

    return response;
};

const LessonApis = {
    reOrderLesson,
    getLessonOrder,
    addLesson,
    updateLesson,
    deleteLesson,
};

export default LessonApis;
