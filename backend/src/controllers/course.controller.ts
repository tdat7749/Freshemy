import { Request, Response } from "express";
import { RequestHasLogin } from "../types/request";
import { createCourseSchema, updateCourseSchema, enrolledCourseSchema } from "../validations/course";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import services from "../services";
import { ResponseError, ResponseSuccess } from "../commons/response";

import i18n from "../utils/i18next";

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

            const result = await services.CourseService.searchMyCourses(parsedPageIndex, parsedKeyword, userId);

            if (result instanceof ResponseSuccess) {
                return res.json(result);
            } else if (result instanceof ResponseError) {
                return res.status(result.getStatusCode()).json(result);
            } else {
                // Handle unexpected response
                return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
        }
    }

    async deleteMyCourse(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const courseId = parseInt(id, 10);

            const result = await services.CourseService.deleteMyCourse(courseId);

            if (result instanceof ResponseSuccess) {
                return res.status(result.getStatusCode()).json(result);
            } else if (result instanceof ResponseError) {
                return res.status(result.getStatusCode()).json(result);
            } else {
                // Handle unexpected response
                return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
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

    async getCourseDetail(req: Request, res: Response) {
        const response = await services.CourseService.getCourseDetail(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async getCourseDetailById(req: Request, res: Response) {
        const response = await services.CourseService.getCourseDetailById(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async registerCourse(req: Request, res: Response) {
        const errorValidate: ValidationError | undefined = enrolledCourseSchema.validate(req.body).error;
        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response = await services.CourseService.registerCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async unsubcribeCourse(req: Request, res: Response) {
        const errorValidate: ValidationError | undefined = enrolledCourseSchema.validate(req.body).error;

        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response = await services.CourseService.unsubcribeCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async editThumbnail(req: RequestHasLogin, res: Response) {
        const response = await services.CourseService.editThumbnail(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async getTop10Courses(req: Request, res: Response) {
        const response = await services.CourseService.getTop10Courses(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async getAllCourses(req: Request, res: Response): Promise<Response> {
        try {
            const pageIndex: number = parseInt(req.query.pageIndex as string, 10);
            const keyword: string = req.query.keyword as string;
            const categories: string[] = Array.isArray(req.query.categories)
                ? (req.query.categories as string[])
                : [req.query.categories as string];
            const sortBy: string = (req.query.sortBy as string) || "newest";
            const filterByRatings: "asc" | "desc" | undefined = req.query.filterByRatings as "asc" | "desc" | undefined;

            const response = await services.CourseService.getAllCourses(
                pageIndex,
                keyword,
                categories,
                sortBy,
                filterByRatings,
            );
            console.log("response:", pageIndex, keyword, categories, sortBy);

            if (response instanceof ResponseSuccess) {
                return res.json(response);
            } else if (response instanceof ResponseError) {
                return res.status(response.getStatusCode()).json(response);
            } else {
                return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
        }
    }
}

export default CourseController;
