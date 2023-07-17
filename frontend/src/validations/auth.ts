import {
    MESSAGE_ERROR_EMAIL_INVALID,
    MESSAGE_ERROR_EMAIL_REQUIRED,
    MESSAGE_ERROR_PASSWORD_REQUIRED,
    MESSAGE_ERROR_FIRST_NAME_REQUIRED,
    MESSAGE_ERROR_LAST_NAME_REQUIRED,
    MESSAGE_ERROR_CONFIRM_PASSWORD_REQUIRED,
    MESSAGE_ERROR_WRONG_CONFIRM_PASSWORD_REQUIRED,
    MESSAGE_ERROR_WEAK_PASSWORD,
    MESSAGE_ERROR_TOO_LONG_PASSWORD,
} from "../utils/contants";
import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
    email: Yup.string().email(MESSAGE_ERROR_EMAIL_INVALID).required(MESSAGE_ERROR_EMAIL_REQUIRED),
    password: Yup.string().required(MESSAGE_ERROR_PASSWORD_REQUIRED),
});

export const registerValidationSchema = Yup.object({
    first_name: Yup.string().required(MESSAGE_ERROR_FIRST_NAME_REQUIRED).trim(),
    last_name: Yup.string().required(MESSAGE_ERROR_LAST_NAME_REQUIRED).trim(),
    email: Yup.string().email(MESSAGE_ERROR_EMAIL_INVALID).required(MESSAGE_ERROR_EMAIL_REQUIRED).trim(),
    password: Yup.string()
        .required(MESSAGE_ERROR_PASSWORD_REQUIRED)
        .min(8, MESSAGE_ERROR_WEAK_PASSWORD)
        .max(32, MESSAGE_ERROR_TOO_LONG_PASSWORD)
        .trim(),
    confirm_password: Yup.string()
        .required(MESSAGE_ERROR_CONFIRM_PASSWORD_REQUIRED)
        .oneOf([Yup.ref("password")], MESSAGE_ERROR_WRONG_CONFIRM_PASSWORD_REQUIRED)
        .trim(),
});
