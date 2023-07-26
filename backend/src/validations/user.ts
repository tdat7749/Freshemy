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
