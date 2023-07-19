import { Request, Response } from "express";
import service from "../services/index";
import CourseService from "../services/course.service";
import { RequestHasLogin } from "../types/request";
import { createCourseSchema, updateCourseSchema } from "../validations/course";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons";
import services from "../services";
import { ResponseError, ResponseSuccess } from "../commons/response";
import { MESSAGE_ERROR_INTERNAL_SERVER } from "../utils/constant";

class CourseController {
    async editCourse(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = updateCourseSchema.validate(req.body).error;

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
    
    async searchMyCourses(req: RequestHasLogin, res: Response): Promise<Response> {
        try {
            const { pageIndex, keyword } = req.query;
            const parsedPageIndex = parseInt(pageIndex as string, 10);
            const parsedKeyword = keyword as string;
            const userId = req.user_id || 0; // Gán giá trị mặc định là 0 nếu không có giá trị user_id

            const result = await CourseService.searchMyCourses(parsedPageIndex, parsedKeyword, userId);

            if (result instanceof ResponseSuccess) {
                return res.json(result);
            } else if (result instanceof ResponseError) {
                return res.status(result.getStatusCode()).json(result);
            } else {
                // Handle unexpected response
                return res.status(500).json(new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false));
        }
    }

    async deleteMyCourse(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const courseId = parseInt(id, 10);

            const result = await CourseService.deleteMyCourse(courseId);

            if (result instanceof ResponseSuccess) {
                return res.status(result.getStatusCode()).json(result);
            } else if (result instanceof ResponseError) {
                return res.status(result.getStatusCode()).json(result);
            } else {
                // Handle unexpected response
                return res.status(500).json(new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false));
        }
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