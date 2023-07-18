import {
    MESSAGE_ERROR_DESCRIPTION_REQUIRED,
    MESSAGE_ERROR_SUMMARY_REQUIRED,
    MESSAGE_ERROR_TITLE_REQUIRED,
} from "../utils/contants";
import * as Yup from "yup";

export const editCourseValidationSchema = Yup.object({
    title: Yup.string().trim().required(MESSAGE_ERROR_TITLE_REQUIRED),
    summary: Yup.string().trim().required(MESSAGE_ERROR_SUMMARY_REQUIRED),
    description: Yup.string().trim().required(MESSAGE_ERROR_DESCRIPTION_REQUIRED),
});
