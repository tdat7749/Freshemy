import { MESSAGE_ERROR_TITLE_REQUIRED, MESSAGE_ERROR_TITLE_TOO_LONG } from "../utils/contants";
import * as Yup from "yup";

export const addLessonValidationSchema = Yup.object({
    title: Yup.string().trim().required(MESSAGE_ERROR_TITLE_REQUIRED).max(100, MESSAGE_ERROR_TITLE_TOO_LONG),
});
