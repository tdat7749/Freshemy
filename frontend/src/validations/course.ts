import i18n from "../utils/i18next";
import * as Yup from "yup";
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
export const editCourseValidationSchema = Yup.object({
    categories: Yup.array()
        .min(1, i18n.t("errorMessages.categoriesIsRequired"))
        .max(4, i18n.t("errorMessages.categoriesMaxAllowed")),
    title: Yup.string()
        .trim()
        .required(i18n.t("errorMessages.titleIsRequired"))
        .max(200, i18n.t("errorMessages.titleTooLong")),
    summary: Yup.string()
        .trim()
        .required(i18n.t("errorMessages.summaryIsRequired"))
        .max(200, i18n.t("errorMessages.summaryTooLong")),
    description: Yup.string()
        .trim()
        .required(i18n.t("errorMessages.descriptionIsRequired"))
        .max(200, i18n.t("errorMessages.descriptionTooLong")),
});

export const createValidationSchema = Yup.object({
    thumbnail: Yup.mixed()
        .nullable()
        .required(i18n.t("errorMessages.thumbnailIsRequired"))
        .test("fileFormat", i18n.t("errorMessages.fileIsNotSupport"), (value: any) => {
            return value && SUPPORTED_FORMATS.includes(value.type);
        })
        .test("fileSize", i18n.t("errorMessages.thumbnailTooBig"), (value: any) => {
            return value && value.size <= 1024 * 1024 * 4;
        }),
    categories: Yup.array()
        .min(1, i18n.t("errorMessages.categoriesIsRequired"))
        .max(4, i18n.t("errorMessages.categoriesMaxAllowed")),
    title: Yup.string()
        .trim()
        .required(i18n.t("errorMessages.titleIsRequired"))
        .max(200, i18n.t("errorMessages.titleTooLong")),
    summary: Yup.string()
        .trim()
        .required(i18n.t("errorMessages.summaryIsRequired"))
        .max(200, i18n.t("errorMessages.summaryTooLong")),
    description: Yup.string()
        .trim()
        .required(i18n.t("errorMessages.descriptionIsRequired"))
        .max(200, i18n.t("errorMessages.descriptionTooLong")),
});
