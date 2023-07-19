import { Request, Response } from 'express'
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import { RequestHasLogin } from "../types/request";
import services from "../services";

class LessonController {
    async createLesson(req: RequestHasLogin, res: Response) {
        const response = await services.LessonService.createLesson(req);
        return res.status(response.getStatusCode()).json(response);
    }
}

export default LessonController;