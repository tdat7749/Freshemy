import { RequestHasLogin } from "../types/request";
import { createCourseSchema } from "../validations/course";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons";
import { Response } from "express";
import services from "../services";

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

        const response = await services.CourseService.createCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
}

export default CourseController;
