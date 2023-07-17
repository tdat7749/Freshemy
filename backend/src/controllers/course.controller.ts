import { RequestHasLogin } from "../types/request";
import { createCourseSchema } from '../validations/course'
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons";
import { Response } from "express";

class CourseController {
    async createCourse(req: RequestHasLogin, res: Response) {
        const errorValidate: ValidationError | undefined = createCourseSchema.validate(req.body).error;

        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
    }
}

export default CourseController