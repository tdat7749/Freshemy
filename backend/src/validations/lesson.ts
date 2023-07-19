import Joi, { ObjectSchema } from "joi";
import {
    MESSAGE_ERROR_SECTION_ID_REQUIRED,
    MESSAGE_ERROR_COURSE_TITLE_REQUIRED,
    MESSAGE_ERROR_COURSE_TITLE_STRING,
} from "../utils/constant";

type Lesson = {
    title: string;
    section_id: number
};


export const LessonSchema: ObjectSchema<Lesson> = Joi.object({
    title: Joi.string().required().messages({
        "any.required": MESSAGE_ERROR_COURSE_TITLE_REQUIRED,
        "string.base": MESSAGE_ERROR_COURSE_TITLE_STRING,
    }),

    section_id: Joi.number().required().messages({
        "any.required": MESSAGE_ERROR_SECTION_ID_REQUIRED,
    }),
});