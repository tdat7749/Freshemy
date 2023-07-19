import { Request, Response } from "express";
import { loginSchema, registrationSchema } from "../validations/auth";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import { RequestHasLogin } from "../types/request";
import service from "../services/index";
import { LessonSchema } from "../validations/lesson";

class LessonController {
    async getLesson(req: Request, res: Response): Promise<Response> {
        const response = await service.LessonService.getLesson(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async createLesson(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = LessonSchema.validate(req.body).error;

        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response = await service.LessonService.createLesson(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async updateLesson(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = LessonSchema.validate(req.body).error;

        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }

        const response = await service.LessonService.updateLesson(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async deleteLesson(req: Request, res: Response): Promise<Response> {
        const response = await service.LessonService.deleteLesson(req);

        return res.status(response.getStatusCode()).json(response);
    }
}

export default LessonController;