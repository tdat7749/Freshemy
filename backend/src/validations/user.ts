import Joi, { ObjectSchema } from "joi";

import i18n from "../utils/i18next";

type ChangePassword = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};

export const changePasswordSchema: ObjectSchema<ChangePassword> = Joi.object({
    current_password: Joi.string()
        .required()
        .messages({
            "string.base": i18n.t("errorMessages.passwordMustBeString"),
            "any.required": i18n.t("errorMessages.currentPasswordIsRequired"),
        }),

    new_password: Joi.string()
        .required()
        .min(8)
        .max(32)
        .messages({
            "string.base": i18n.t("errorMessages.passwordMustBeString"),
            "any.required": i18n.t("errorMessages.newPasswordIsRequired"),
            "string.min": i18n.t("errorMessages.weakPassword"),
            "string.max": i18n.t("errorMessages.tooLongPassword"),
        }),
    confirm_password: Joi.string()
        .required()
        .min(8)
        .max(32)
        .messages({
            "string.base": i18n.t("errorMessages.passwordMustBeString"),
            "any.required": i18n.t("errorMessages.confirmPasswordIsRequired"),
        }),
});

type ChangeUserInformation = {
    first_name: string;
    last_name: string;
    description: string;
};

export const ChangeUserInformation: ObjectSchema<ChangePassword> = Joi.object({
    first_name: Joi.string()
        .required()
        .max(32)
        .messages({
            "string.base": i18n.t("errorMessages.firstNameMustBeString"),
            "any.required": i18n.t("errorMessages.firstNameIsRequired"),
            "string.max": i18n.t("errorMessages.tooLongFirstName"),
        }),

    last_name: Joi.string()
        .required()
        .max(32)
        .messages({
            "string.base": i18n.t("errorMessages.lastNameMustBeString"),
            "any.required": i18n.t("errorMessages.lastNameIsRequired"),
            "string.max": i18n.t("errorMessages.tooLongLastName"),
        }),
    description: Joi.string()
        .required()
        .min(8)
        .max(32)
        .messages({
            "string.base": i18n.t("errorMessages.descriptionMustBeString"),
            "any.required": i18n.t("errorMessages.descriptionIsRequired"),
            "string.min": i18n.t("errorMessages.tooShortDescription"),
            "string.max": i18n.t("errorMessages.tooLongDescription"),
        }),
});