import {
    MESSAGE_ERROR_PASSWORD_WEAK,
    MESSAGE_ERROR_NEW_PASSWORD_REQUIRED, 
    MESSAGE_ERROR_CONFIRM_PASSWORD_REQUIRED,
    MESSAGE_ERROR_CURRENT_PASSWORD_REQUIRED,
    MESSAGE_ERROR_PASSWORD_LONG,
    MESSAGE_ERROR_PASSWORD_NEW_DIFFERENT_FROM_CONFIRM,
} from "../utils/contants";
import * as Yup from "yup";

export const changePasswordValidationSchema = Yup.object({
        current_password: Yup.string().trim().required(MESSAGE_ERROR_CURRENT_PASSWORD_REQUIRED),
        new_password: Yup.string()
            .trim()
            .min(8, MESSAGE_ERROR_PASSWORD_WEAK)
            .max(32, MESSAGE_ERROR_PASSWORD_LONG)
            .required(MESSAGE_ERROR_NEW_PASSWORD_REQUIRED),
        confirm_password: Yup.string()
            .trim()
            .min(8, MESSAGE_ERROR_PASSWORD_WEAK)
            .max(32, MESSAGE_ERROR_PASSWORD_LONG)
            .required(MESSAGE_ERROR_CONFIRM_PASSWORD_REQUIRED)
            .oneOf([Yup.ref("new_password")], MESSAGE_ERROR_PASSWORD_NEW_DIFFERENT_FROM_CONFIRM),
});
