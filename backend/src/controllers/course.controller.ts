import { Request, Response } from 'express'
import service from "../services";
import { ValidationError } from "joi";
import { convertJoiErrorToString } from "../commons/index";
import { RequestHasLogin } from "../types/request";
import services from "../services";
import { createCourseSchema } from "../validations/course";
import { enrolledCourseSchema } from "../validations/course";


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
    async getCourseDetail(req:Request, res:Response){
        const response = await service.CourseService.getCourseDetail(req)        
        return res.status(response.getStatusCode()).json(response)
    }

    async registerCourse(req:Request, res:Response){
        const errorValidate: ValidationError | undefined = enrolledCourseSchema.validate(req.body).error;
        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response = await service.CourseService.registerCourse(req)        
        return res.status(response.getStatusCode()).json(response)
    }

    
    async unsubcribeCourse(req:Request, res:Response){
        const errorValidate: ValidationError | undefined = enrolledCourseSchema.validate(req.body).error;

        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response = await service.CourseService.unsubcribeCourse(req)        
        return res.status(response.getStatusCode()).json(response)
    }
}


export default CourseController;
