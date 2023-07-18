import Joi, { ObjectSchema } from "joi";
import {    
    MESSAGE_ERROR_MISSING_DATA,
    MESSAGE_ERROR_WRONG_DATA_TYPE,
} from "../utils/constant";
type enrolledCourse = {
    course_id: number
}
export const enrolledCourseSchema: ObjectSchema<enrolledCourse> = Joi.object({
    course_id: Joi.number().required().messages({
        "number.base": MESSAGE_ERROR_WRONG_DATA_TYPE,
        "any.required": MESSAGE_ERROR_MISSING_DATA,
    })
});