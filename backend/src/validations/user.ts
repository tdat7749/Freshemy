import Joi, { ObjectSchema } from "joi"

type ChangePassword = {
    current_password : string,
    new_password : string, 
    confirm_password : string
}

export const changePasswordSchema:ObjectSchema<ChangePassword> = Joi.object({
    current_password: Joi.string()
        .required()
        .messages({
            "string.base": "Current password must be a string",
            "any.required": "Current password is required",
        }),

    new_password: Joi.string()
        .required()
        .min(8)
        .max(32)
        .messages({
            "string.base": "Password must be a string",
            "any.required": "Password is required",
        }),
        confirm_password: Joi.string()
        .required()
        .min(8)
        .max(32)
        .messages({
            "string.base": "Password must be a string",
            "any.required": "Password is required",
        })
})