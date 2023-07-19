import * as Yup from "yup";

import {
    MESSAGE_ERROR_DESCRIPTION_REQUIRED,
    MESSAGE_ERROR_TITLE_REQUIRED,
    MESSAGE_ERROR_SUMMARY_REQUIRED
} from "../utils/contants";

export const createValidationSchema = Yup.object({
    // thumbnail: Yup.mixed().required("Thumbnail is required"),
    // categories: Yup.string().required("Categories is required"),
    title: Yup.string().trim().required(MESSAGE_ERROR_TITLE_REQUIRED),
    summary: Yup.string().trim().required(MESSAGE_ERROR_SUMMARY_REQUIRED),
    description: Yup.string().trim().required(MESSAGE_ERROR_DESCRIPTION_REQUIRED),
});
