import { Request, Response } from "express";
import CourseService from "../services/course.service";
import { RequestHasLogin } from "../types/request";
import { createCourseSchema } from "../validations/course";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons";
import services from "../services";

class CourseController {
    async searchMyCourses(req: RequestHasLogin, res: Response): Promise<Response> {
        try {
            const { pageIndex, keyword } = req.query;
            const parsedPageIndex = parseInt(pageIndex as string, 10);
            const parsedKeyword = keyword as string;
            const userId = req.user_id || 0; // Gán giá trị mặc định là 0 nếu không có giá trị user_id

            const result = await CourseService.searchMyCourses(parsedPageIndex, parsedKeyword, userId);

            return res.status(result.status_code).json(result);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error",
                status_code: 500,
            });
        }
    }

    async deleteMyCourse(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const courseId = parseInt(id, 10);

            const result = await CourseService.deleteMyCourse(courseId);

            return res.status(result.status_code).json(result);
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error",
                status_code: 500,
            });
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
}

export default CourseController;
