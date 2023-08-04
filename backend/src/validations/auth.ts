import Joi, { ObjectSchema } from "joi";

import i18n from "../utils/i18next";

type Login = {
    email: string;
    password: string;
};

export const loginSchema: ObjectSchema<Login> = Joi.object({
    email: Joi.string()
        .trim()
        .regex(/^\S+@\S+\.\S+$/)
        .required()
        .messages({
            "string.base": i18n.t("errorMessages.emailMustBeString"),
            "any.required": i18n.t("errorMessages.emailIsRequired"),
            "string.regex": i18n.t("errorMessages.inCorrectEmail"),
        }),

    password: Joi.string()
        .trim()
        .required()
        .messages({
            "string.base": i18n.t("errorMessages.passwordMustBeString"),
            "any.required": i18n.t("errorMessages.passwordIsRequired"),
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
        .trim()
        .regex(/^\S+@\S+\.\S+$/)
        .required()
        .messages({
            "string.base": i18n.t("errorMessages.emailMustBeString"),
            "any.required": i18n.t("errorMessages.emailIsRequired"),
            "string.regex": i18n.t("errorMessages.inCorrectEmail"),
        }),

    password: Joi.string()
        .trim()
        .required()
        .messages({
            "string.base": i18n.t("errorMessages.passwordMustBeString"),
            "any.required": i18n.t("errorMessages.passwordIsRequired"),
        }),

    first_name: Joi.string()
        .trim()
        .required()
        .messages({
            "string.base": i18n.t("errorMessages.firstNameMustBeString"),
            "any.required": i18n.t("errorMessages.firstNameIsRequired"),
        }),

    last_name: Joi.string()
        .trim()
        .required()
        .messages({
            "string.base": i18n.t("errorMessages.lastNameMustBeString"),
            "any.required": i18n.t("errorMessages.lastNameIsRequired"),
        }),

    // confirmPassword: Joi.string().valid(Joi.ref("password")).required().strict(),

    confirm_password: Joi.string()
        .trim()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": i18n.t("errorMessages.newPasswordDiiferentOldPassword"),
            "any.required": i18n.t("errorMessages.confirmPasswordIsRequired"),
        }),
});
