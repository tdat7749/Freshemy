import { Request, Response } from "express";
import service from "../services/index";
import { RequestHasLogin } from "../types/request";
import { createCourseSchema } from "../validations/course";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons";
import services from "../services";
class CourseController {
    async editCourse(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = createCourseSchema.validate(req.body).error;

        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }

        const response = await services.CourseService.editCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    
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

    async editThumbnail(req: RequestHasLogin, res: Response) {
        const response = await service.CourseService.editThumbnail(req);

        return res.status(response.getStatusCode()).json(response)
    }
}
export default CourseController;