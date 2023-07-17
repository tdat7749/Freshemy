import {
    MESSAGE_ERROR_EMAIL_INVALID,
    MESSAGE_ERROR_EMAIL_REQUIRED,
    MESSAGE_ERROR_PASSWORD_REQUIRED,
} from "../utils/contants";
import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
    email: Yup.string().email(MESSAGE_ERROR_EMAIL_INVALID).required(MESSAGE_ERROR_EMAIL_REQUIRED),
    password: Yup.string().required(MESSAGE_ERROR_PASSWORD_REQUIRED),
});
