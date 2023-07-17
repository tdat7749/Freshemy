import Joi, { ObjectSchema } from "joi"
import {
    MESSAGE_ERROR_NEW_PASSWORD_REQUIRED,
    MESSAGE_ERROR_CONFIRM_PASSWORD_REQUIRED,
    MESSAGE_ERROR_PASSWORD_IS_STRING,
    MESSAGE_ERROR_CURRENT_PASSWORD_REQUIRED,
    MESSAGE_ERROR_PASSWORD_WEAK,
    MESSAGE_ERROR_PASSWORD_LONG
} from "../utils/constant"
type ChangePassword = {
    current_password : string,
    new_password : string, 
    confirm_password : string
}

export const changePasswordSchema:ObjectSchema<ChangePassword> = Joi.object({
    current_password: Joi.string()
        .required()
        .messages({
            "string.base": MESSAGE_ERROR_PASSWORD_IS_STRING,
            "any.required": MESSAGE_ERROR_CURRENT_PASSWORD_REQUIRED,
        }),

    new_password: Joi.string()
        .required()
        .min(8)
        .max(32)
        .messages({
            "string.base": MESSAGE_ERROR_PASSWORD_IS_STRING,
            "any.required": MESSAGE_ERROR_NEW_PASSWORD_REQUIRED,
            "string.min":MESSAGE_ERROR_PASSWORD_WEAK,
            "string.max":MESSAGE_ERROR_PASSWORD_LONG,
        }),
        confirm_password: Joi.string()
        .required()
        .min(8)
        .max(32)
        .messages({
            "string.base": MESSAGE_ERROR_PASSWORD_IS_STRING,
            "any.required": MESSAGE_ERROR_CONFIRM_PASSWORD_REQUIRED,
        })
})