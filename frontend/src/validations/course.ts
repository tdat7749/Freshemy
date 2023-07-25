import {
    MESSAGE_ERROR_DESCRIPTION_REQUIRED,
    MESSAGE_ERROR_SUMMARY_REQUIRED,
    MESSAGE_ERROR_TITLE_REQUIRED,
} from "../utils/contants";
import * as Yup from "yup";
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
export const editCourseValidationSchema = Yup.object({
    categories: Yup.array().min(1, "Categories is required").max(4, "Categories allow 4"),
    title: Yup.string().trim().required(MESSAGE_ERROR_TITLE_REQUIRED),
    summary: Yup.string().trim().required(MESSAGE_ERROR_SUMMARY_REQUIRED),
    description: Yup.string().trim().required(MESSAGE_ERROR_DESCRIPTION_REQUIRED),
});

export const createValidationSchema = Yup.object({
    thumbnail: Yup.mixed()
        .required("A file is required")
        .test("fileFormat", "Unsupported Format", (value: any) => {
            return value && SUPPORTED_FORMATS.includes(value.type);
        })
        .test("fileSize", "File too large", (value: any) => {
            return value && value.size <= 1024 * 1024 * 4;
        }),
    categories: Yup.array().min(1, "Categories is required").max(4, "Categories allow 4"),
    title: Yup.string().trim().required(MESSAGE_ERROR_TITLE_REQUIRED),
    summary: Yup.string().trim().required(MESSAGE_ERROR_SUMMARY_REQUIRED),
    description: Yup.string().trim().required(MESSAGE_ERROR_DESCRIPTION_REQUIRED),
});
