import { Request, Response } from "express";
import service from "../services/index";

class CourseController {
    async editCourse(req: Request, res: Response): Promise<Response> {
        const response = await service.CourseService.editCourse(req);

        return res.status(response.getStatusCode()).json(response);
    }
}

export default CourseController;