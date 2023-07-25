import {
    MESSAGE_ERROR_DESCRIPTION_REQUIRED,
    MESSAGE_ERROR_SUMMARY_REQUIRED,
    MESSAGE_ERROR_TITLE_REQUIRED,
} from "../utils/contants";
import * as Yup from "yup";

export const editCourseValidationSchema = Yup.object({
    categories: Yup.array().min(1, "Categories is required").max(4, "Categories allow 4"),
    title: Yup.string().trim().required(MESSAGE_ERROR_TITLE_REQUIRED),
    summary: Yup.string().trim().required(MESSAGE_ERROR_SUMMARY_REQUIRED),
    description: Yup.string().trim().required(MESSAGE_ERROR_DESCRIPTION_REQUIRED),
});

export const createValidationSchema = Yup.object({
    thumbnail: Yup.mixed()
        .nullable()
        .required()
        .test("FILE_SIZE", "Image is too big", (value: any) => !value || (value && value.size <= 1024 * 1024 * 4)),
    categories: Yup.array().min(1, "Categories is required").max(4, "Categories allow 4"),
    title: Yup.string().trim().required(MESSAGE_ERROR_TITLE_REQUIRED),
    summary: Yup.string().trim().required(MESSAGE_ERROR_SUMMARY_REQUIRED),
    description: Yup.string().trim().required(MESSAGE_ERROR_DESCRIPTION_REQUIRED),
});
