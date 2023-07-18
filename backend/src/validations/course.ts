import Joi, { ObjectSchema } from "joi";
import {
    MESSAGE_ERROR_CATEGORIES_REQUIRED,
    MESSAGE_ERROR_COURSE_SLUG_REQUIRED,
    MESSAGE_ERROR_COURSE_TITLE_REQUIRED,
    MESSAGE_ERROR_COURSE_TITLE_STRING,
    MESSAGE_ERROR_DESCRIPTION_REQUIRED,
    MESSAGE_ERROR_DESCRIPTION_STRING,
    MESSAGE_ERROR_SLUG_STRING,
    MESSAGE_ERROR_STATUS_BOOLEAN,
    MESSAGE_ERROR_STATUS_REQUIRED,
    MESSAGE_ERROR_SUMMARY_REQUIRED,
    MESSAGE_ERROR_SUMMARY_STRING,
    MESSAGE_ERROR_THUMBNAIL_REQUIRED,
    MESSSAGE_ERROR_SLUG_MALFORMED,
} from "../utils/constant";

type CreateCourse = {
    title: string;
    slug: string;
    summary: string;
    description: string;
    thumbnail: Express.Multer.File;
    categories: Array<number>;
    status: boolean;
};

export const createCourseSchema: ObjectSchema<CreateCourse> = Joi.object({
    title: Joi.string().required().messages({
        "any.required": MESSAGE_ERROR_COURSE_TITLE_REQUIRED,
        "string.base": MESSAGE_ERROR_COURSE_TITLE_STRING,
    }),
    slug: Joi.string()
        .required()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .messages({
            "any.required": MESSAGE_ERROR_COURSE_SLUG_REQUIRED,
            "string.base": MESSAGE_ERROR_SLUG_STRING,
            "string.regex": MESSSAGE_ERROR_SLUG_MALFORMED,
        }),

    status: Joi.bool().required().messages({
        "any.required": MESSAGE_ERROR_STATUS_REQUIRED,
        "bool.base": MESSAGE_ERROR_STATUS_BOOLEAN,
    }),

    description: Joi.string().required().messages({
        "any.required": MESSAGE_ERROR_DESCRIPTION_REQUIRED,
        "string.base": MESSAGE_ERROR_DESCRIPTION_STRING,
    }),

    summary: Joi.string().required().messages({
        "any.required": MESSAGE_ERROR_SUMMARY_REQUIRED,
        "string.base": MESSAGE_ERROR_SUMMARY_STRING,
    }),

    categories: Joi.array<number[]>().required().messages({
        "any.required": MESSAGE_ERROR_CATEGORIES_REQUIRED,
    }),

    thumbnail: Joi.required().messages({
        "any.required": MESSAGE_ERROR_THUMBNAIL_REQUIRED,
    }),
});
