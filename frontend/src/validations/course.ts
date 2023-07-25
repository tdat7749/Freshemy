import i18n from "../utils/i18next";
import * as Yup from "yup";

export const editCourseValidationSchema = Yup.object({
    categories: Yup.array()
        .min(1, i18n.t("errorMessages.categoriesIsRequired"))
        .max(4, i18n.t("errorMessages.categoriesMaxAllowed")),
    title: Yup.string().trim().required(i18n.t("errorMessages.titleIsRequired")),
    summary: Yup.string().trim().required(i18n.t("errorMessages.summaryIsRequired")),
    description: Yup.string().trim().required(i18n.t("errorMessages.descriptionIsRequired")),
});

export const createValidationSchema = Yup.object({
    thumbnail: Yup.mixed()
        .nullable()
        .required(i18n.t("errorMessages.thumbnailIsRequired"))
        .test(
            "FILE_SIZE",
            i18n.t("errorMessages.thumbnailTooBig"),
            (value: any) => !value || (value && value.size <= 1024 * 1024 * 4)
        ),
    categories: Yup.array()
        .min(1, i18n.t("errorMessages.categoriesIsRequired"))
        .max(4, i18n.t("errorMessages.categoriesMaxAllowed")),
    title: Yup.string().trim().required(i18n.t("errorMessages.titleIsRequired")),
    summary: Yup.string().trim().required(i18n.t("errorMessages.summaryIsRequired")),
    description: Yup.string().trim().required(i18n.t("errorMessages.descriptionIsRequired")),
});
