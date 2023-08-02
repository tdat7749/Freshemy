import Joi, { ObjectSchema } from "joi";

import i18n from "../utils/i18next";

type Lesson = {
    title: string;
    section_id: number;
};

export const LessonSchema: ObjectSchema<Lesson> = Joi.object({
    title: Joi.string()
        .required()
        .max(100)
        .messages({
            "any.required": i18n.t("errorMessages.courseTitleIsRequired"),
            "string.base": i18n.t("errorMessages.courseTitleMustBeString"),
            "string.max": i18n.t("errorMessages.courseTitleIsTooLong"),
        }),

    section_id: Joi.number()
        .integer()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.sectionIdIsRequired"),
            "number.base": i18n.t("errorMessages.sectionIdMustBeNumber"),
            "number.integer": i18n.t("errorMessages.sectionIdMustBeAnInt"),
        }),
});

type UpdateLesson = {
    title: string;
};

export const UpdateLessonSchema: ObjectSchema<UpdateLesson> = Joi.object({
    title: Joi.string()
        .required()
        .max(100)
        .messages({
            "any.required": i18n.t("errorMessages.courseTitleIsRequired"),
            "string.base": i18n.t("errorMessages.courseTitleMustBeString"),
            "string.max": i18n.t("errorMessages.courseTitleIsTooLong"),
        }),
});
