import Joi, { ObjectSchema } from "joi";

import i18n from "../utils/i18next";

type enrolledCourse = {
    course_id: number;
};
export const enrolledCourseSchema: ObjectSchema<enrolledCourse> = Joi.object({
    course_id: Joi.number()
        .required()
        .messages({
            "number.base": i18n.t("errorMessages.courseIdMustBeNumber"),
            "any.required": i18n.t("errorMessages.courseIdIsRequired"),
        }),
});

type CreateCourse = {
    title: string;
    slug: string;
    summary: string;
    description: string;
    // thumbnail: Express.Multer.File;
    categories: Array<number>;
    status: boolean;
};

export const createCourseSchema: ObjectSchema<CreateCourse> = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.courseTitleIsRequired"),
            "string.base": i18n.t("errorMessages.courseTitleMustBeString"),
        }),
    slug: Joi.string()
        .required()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .messages({
            "any.required": i18n.t("errorMessages.courseSlugIsRequired"),
            "string.base": i18n.t("errorMessages.courseSlugMustBeString"),
            "string.regex": i18n.t("errorMessages.courseSlugMalformed"),
        }),

    status: Joi.required().messages({

        "any.required": i18n.t("errorMessages.statusIsRequired"),
        //"bool.base": MESSAGE_ERROR_STATUS_BOOLEAN,

        "any.required": MESSAGE_ERROR_STATUS_REQUIRED,
        "bool.base": MESSAGE_ERROR_STATUS_BOOLEAN,

    }),

    description: Joi.string()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.descriptionIsRequired"),
            "string.base": i18n.t("errorMessages.descriptionMustBeString"),
        }),

    summary: Joi.string()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.summaryIsRequired"),
            "string.base": i18n.t("errorMessages.summaryMustBeString"),
        }),

    categories: Joi.array<number[]>()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.categoryIsRequired"),
        }),

    thumbnail: Joi.required().messages({
        "any.required": MESSAGE_ERROR_THUMBNAIL_REQUIRED,
    }),
});

type UpdateCourse = {
    id: number;
    title: string;
    slug: string;
    summary: string;
    description: string;
    thumbnail: Express.Multer.File;
    categories: Array<number>;
    status: boolean;
};

export const updateCourseSchema: ObjectSchema<UpdateCourse> = Joi.object({
    id: Joi.number()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.courseIdIsRequired"),
        }),
    title: Joi.string()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.courseIdIsRequired"),
            "string.base": i18n.t("errorMessages.courseTitleIsRequired"),
        }),
    slug: Joi.string()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.courseSlugIsRequired"),
            "string.base": i18n.t("errorMessages.courseSlugMustBeString"),
            "string.regex": i18n.t("errorMessages.courseSlugMalformed"),
        }),

    status: Joi.required().messages({
        "any.required": i18n.t("errorMessages.statusIsRequired"),
    }),

    description: Joi.string()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.descriptionIsRequired"),
            "string.base": i18n.t("errorMessages.descriptionMustBeString"),
        }),

    summary: Joi.string()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.summaryIsRequired"),
            "string.base": i18n.t("errorMessages.summaryMustBeString"),
        }),


    categories: Joi.array<number[]>()
        .required()
        .messages({
            "any.required": i18n.t("errorMessages.categoryIsRequired"),
        }),

    categories: Joi.array<number[]>().required().messages({
        "any.required": MESSAGE_ERROR_CATEGORIES_REQUIRED,
    }),
    thumbnail: Joi.string(),

});
