import { Request, Response } from 'express'
import service from "../services";

class CourseController {
    async getCourseDetail(req:Request,res:Response){
        const response = await service.CourseService.getCourseDetail(req)        
        return res.status(response.getStatusCode()).json(response)
    }

}

export default CourseController