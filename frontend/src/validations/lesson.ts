import i18n from "../utils/i18next";
import * as Yup from "yup";

export const addLessonValidationSchema = Yup.object({
    title: Yup.string()
        .trim()
        .required(i18n.t("errorMessages.titleIsRequired"))
        .max(100, i18n.t("errorMessages.titleTooLong")),
});
