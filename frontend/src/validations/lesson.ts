import { 
    MESSAGE_ERROR_TITLE_REQUIRED,
} from "../utils/contants";
import * as Yup from "yup";

export const addLessonValidationSchema = Yup.object({
    title: Yup.string().trim().required(MESSAGE_ERROR_TITLE_REQUIRED),
});
