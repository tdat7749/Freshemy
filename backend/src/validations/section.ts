import Joi, { ObjectSchema } from "joi";

import i18n from "../utils/i18next";

type Section = {
    title: string;
    course_id: number;
};

export const SectionSchema: ObjectSchema<Section> = Joi.object({
    title: Joi.string()
        .required()
        .max(100)
        .messages({
            "any.required": i18n.t("errorMessages.courseTitleIsRequired"),
            "string.base": i18n.t("errorMessages.courseTitleMustBeString"),
            "string.max": i18n.t("errorMessages.courseTitleIsTooLong"),
        }),

    course_id: Joi.number()
        .integer()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.courseIdIsRequired"),
            "number.base": i18n.t("errorMessages.courseIdMustBeNumber"),
            "number.integer": i18n.t("errorMessages.courseIdMustBeAnInt"),
        }),
});

type UpdateSection = {
    title: string;
};

export const UpdateSectionSchema: ObjectSchema<UpdateSection> = Joi.object({
    title: Joi.string()
        .required()
        .max(100)
        .messages({
            "any.required": i18n.t("errorMessages.courseTitleIsRequired"),
            "string.base": i18n.t("errorMessages.courseTitleMustBeString"),
            "string.max": i18n.t("errorMessages.courseTitleIsTooLong"),
        }),
    course_id: Joi.number(),
});
