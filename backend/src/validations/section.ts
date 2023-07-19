import Joi, { ObjectSchema } from "joi";
import {
    MESSAGE_ERROR_COURSE_ID_REQUIRED,
    MESSAGE_ERROR_COURSE_TITLE_REQUIRED,
    MESSAGE_ERROR_COURSE_TITLE_STRING,
} from "../utils/constant";

type Section = {
    title: string;
    course_id: number;
};

export const SectionSchema: ObjectSchema<Section> = Joi.object({
    title: Joi.string().required().messages({
        "any.required": MESSAGE_ERROR_COURSE_TITLE_REQUIRED,
        "string.base": MESSAGE_ERROR_COURSE_TITLE_STRING,
    }),

    course_id: Joi.number().required().messages({
        "any.required": MESSAGE_ERROR_COURSE_ID_REQUIRED,
    }),
});

type UpdateSection = {
    title: string;
};


export const UpdateSectionSchema: ObjectSchema<UpdateSection> = Joi.object({
    title: Joi.string().required().messages({
        "any.required": MESSAGE_ERROR_COURSE_TITLE_REQUIRED,
        "string.base": MESSAGE_ERROR_COURSE_TITLE_STRING,
    })
});
