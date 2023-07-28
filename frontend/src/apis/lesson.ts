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

const LessonApis = {
    addLesson,
    updateLesson,
    deleteLesson,
};

export default LessonApis;
