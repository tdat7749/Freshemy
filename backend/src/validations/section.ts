import Joi, { ObjectSchema } from "joi";

import i18n from "../utils/i18next";

type Section = {
    title: string;
    course_id: number;
};

export const SectionSchema: ObjectSchema<Section> = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.courseTitleIsRequired"),
            "string.base": i18n.t("errorMessages.courseTitleMustBeString"),
        }),

    course_id: Joi.number()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.courseTitleIsRequired"),
        }),
});

type UpdateSection = {
    title: string;
};

export const UpdateSectionSchema: ObjectSchema<UpdateSection> = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.courseTitleIsRequired"),
            "string.base": i18n.t("errorMessages.courseTitleMustBeString"),
        }),
    course_id: Joi.number(),
});
