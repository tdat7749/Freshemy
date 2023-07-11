import Joi, { ObjectSchema } from "joi"

type Login = {
    email: string,
    password: string
}

export const loginSchema: ObjectSchema<Login> = Joi.object({
    email: Joi.string()
        .regex(/^\S+@\S+\.\S+$/)
        .required()
        .messages({
            "string.base": "Email must be a string",
            "any.required": "Email is required",
            "string.regex": "Incorrect email "
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.base": "Password must be a string",
            "any.required": "Password is required",
        })
})