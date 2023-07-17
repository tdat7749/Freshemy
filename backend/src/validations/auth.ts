import Joi, { ObjectSchema } from "joi";
import {
    MESSAGE_ERROR_EMAIL_STRING,
    MESSAGE_ERROR_EMAIL_INCORRECT,
    MESSAGE_ERROR_PASSWORD_STRING,
    MESSAGE_ERROR_PASSWORD_REQUIRED,
    MESSAGE_ERROR_EMAIL_REQUIRED,
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
            "string.base": "Email must be a string",
            "any.required": "Email is required",
            "string.regex": "Incorrect email",
        }),

    password: Joi.string().required().messages({
        "string.base": "Password must be a string",
        "any.required": "Password is required",
    }),

    first_name: Joi.string().required().messages({
        "string.base": "First name must be a string",
        "any.required": "First name is required",
    }),

    last_name: Joi.string().required().messages({
        "string.base": "Last name must be a string",
        "any.required": "Last name is required",
    }),

    // confirmPassword: Joi.string().valid(Joi.ref("password")).required().strict(),

    confirm_password: Joi.string().valid(Joi.ref("password")).required().messages({
        "any.only": "Password and comfirm password must be same",
        "any.required": "Confirm password is required",
    }),
});
