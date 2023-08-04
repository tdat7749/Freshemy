import Joi, { ObjectSchema } from "joi";

import i18n from "../utils/i18next";

type enrolledCourse = {
    course_id: number;
};
export const ratingSchema: ObjectSchema<enrolledCourse> = Joi.object({
    ratings: Joi.number()
        .required()
        .integer()
        .min(1)
        .max(5)
        .messages({
            "number.integer": i18n.t("errorMessages.ratingScoreMustBeAnInt"),
            "number.base": i18n.t("errorMessages.ratingScoreType"),
            "any.required": i18n.t("errorMessages.ratingScoreRequired"),
            "number.min": i18n.t("errorMessages.ratingScoreMinError"),
            "number.max": i18n.t("errorMessages.ratingScoareMaxError"),
        }),
    content: Joi.string()
        .min(0)
        .max(100)
        .messages({
            "string.base": i18n.t("errorMessages.contentRatingType"),
            "string.max": i18n.t("errorMessages.contentRatingTooLong"),
        }),
    course_id: Joi.number()
        .required()
        .integer()
        .messages({
            "number.integer": i18n.t("errorMessages.courseIdMustBeAnInt"),
            "number.base": i18n.t("errorMessages.courseIdMustBeNumber"),
            "any.required": i18n.t("errorMessages.courseIdIsRequired"),
        }),
});
