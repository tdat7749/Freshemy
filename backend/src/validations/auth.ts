import Joi, { ObjectSchema } from "joi";
import {
    MESSAGE_ERROR_EMAIL_STRING,
    MESSAGE_ERROR_EMAIL_INCORRECT,
    MESSAGE_ERROR_PASSWORD_STRING,
    MESSAGE_ERROR_PASSWORD_REQUIRED,
    MESSAGE_ERROR_EMAIL_REQUIRED,
    MESSAGE_ERROR_FIRST_NAME_STRING,
    MESSAGE_ERROR_LAST_NAME_STRING,
    MESSAGE_ERROR_FIRST_NAME_REQUIRED,
    MESSAGE_ERROR_LAST_NAME_REQUIRED,
    MESSAGE_ERROR_CONFIRM_PASSWORD_REQUIRED,
    MESSAGE_ERROR_PASSOWRD_CONFIRM_PASSWORD_MUST_BE_SAME_REQUIRED,
} from "../utils/constant";

type Login = {
    email: string;
    password: string;
};

export const loginSchema: ObjectSchema<Login> = Joi.object({
    email: Joi.string()
        .regex(/^\S+@\S+\.\S+$/)
        .required()
        .messages({
            "string.base": MESSAGE_ERROR_EMAIL_STRING,
            "any.required": MESSAGE_ERROR_EMAIL_REQUIRED,
            "string.regex": MESSAGE_ERROR_EMAIL_INCORRECT,
        }),

    password: Joi.string().required().messages({
        "string.base": MESSAGE_ERROR_PASSWORD_STRING,
        "any.required": MESSAGE_ERROR_PASSWORD_REQUIRED,
    }),
});

type Registration = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    token: string;
};

export const registrationSchema: ObjectSchema<Registration> = Joi.object({
    email: Joi.string()
        .regex(/^\S+@\S+\.\S+$/)
        .required()
        .messages({
            "string.base": MESSAGE_ERROR_EMAIL_STRING,
            "any.required": MESSAGE_ERROR_EMAIL_REQUIRED,
            "string.regex": MESSAGE_ERROR_EMAIL_INCORRECT,
        }),

    password: Joi.string().required().messages({
        "string.base": MESSAGE_ERROR_PASSWORD_STRING,
        "any.required": MESSAGE_ERROR_PASSWORD_REQUIRED,
    }),

    first_name: Joi.string().required().messages({
        "string.base": MESSAGE_ERROR_FIRST_NAME_STRING,
        "any.required": MESSAGE_ERROR_FIRST_NAME_REQUIRED,
    }),

    last_name: Joi.string().required().messages({
        "string.base": MESSAGE_ERROR_LAST_NAME_STRING,
        "any.required": MESSAGE_ERROR_LAST_NAME_REQUIRED,
    }),

    // confirmPassword: Joi.string().valid(Joi.ref("password")).required().strict(),

    confirm_password: Joi.string().valid(Joi.ref("password")).required().messages({
        "any.only": MESSAGE_ERROR_PASSOWRD_CONFIRM_PASSWORD_MUST_BE_SAME_REQUIRED,
        "any.required": MESSAGE_ERROR_CONFIRM_PASSWORD_REQUIRED,
    }),
});
