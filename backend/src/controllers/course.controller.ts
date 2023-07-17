import { Request, Response, NextFunction, RequestHandler } from 'express';
import { CreateCourseDTO } from '../DTOS/course.dto';
import { ResponseError, ResponseSuccess } from '../commons/response';
import { CourseService } from '../services/course.service';
import { RequestCreateCourseWithUserId } from '../types/request';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export class CourseController {
    private courseService: CourseService;

    constructor() {
        this.courseService = new CourseService();
    }


    public createCourse = async (req: RequestCreateCourseWithUserId, res: Response) => {
        try {
            const createCourseDTO: CreateCourseDTO = req.body;
            const userId: number = req.user.id;
            const thumbnail = req.file;

            if (!thumbnail) {
                return res.status(400).json(new ResponseError(400, 'Thumbnail file is required', false));
            }

            const course = await this.courseService.createCourse(createCourseDTO, userId, thumbnail);

            if (course) {
                return res.status(200).json(new ResponseSuccess(200, 'Create course successfully', true));
            } else {
                return res.status(500).json(new ResponseError(500, 'Failed to create course', false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, 'Internal Server Error', false));
        }
    };
}

export default CourseController;
