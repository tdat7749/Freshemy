import { Request } from "express";
import configs from "../configs";
import { db } from "../configs/db.config";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import {
    MESSAGE_ERROR_LOGIN_FAILED,
    MESSAGE_ERROR_SEND_EMAIL,
    MESSAGE_ERROR_LOGIN_UNVERIFIED,
    MESSAGE_SUCCESS_LOGIN,
    MESSAGE_ERROR_INTERNAL_SERVER,
    MESSAGE_ERROR_MISSING_REQUEST_BODY,
} from "../utils/constant";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
const editCourse = async (req: Request) : Promise<ResponseBase> => {
    try{
        const {
            id,
            title,
            slug,
            summary,
            description,
            categories
        } = req.body;

        const isUpdateCourse = await configs.db.course.update({
            where: {
                id: id
            },
            data: {
                title: title,
                slug: slug,
                summary: summary,
                description: description,
            }
        })
        if(!isUpdateCourse) return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);

        let afterCategories = []
        for (let i = 0; i < categories.length; i++) {
            afterCategories.push(categories[i])
        }
        const beforeCategories = await configs.db.courseCategory.findMany({
            where: {
                course_id: id
            },
            select: {
                category_id: true
            }
        })

        const isDelete = await configs.db.courseCategory.deleteMany({
            where: {
                course_id: id
            }
        })
        if(!isDelete) return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);

        let oldCategories = []
        for (let i = 0; i < beforeCategories.length; i++) oldCategories.push(beforeCategories[i].category_id);
        var result = afterCategories.filter(value => oldCategories.includes(value));
        var result1 = afterCategories.filter(function(val) {
            return oldCategories.indexOf(val) == -1;
        });
        result = result.concat(result1);
        
        let data = []
        for (let i = 0; i < result.length; i++) {
            data.push({
                course_id: id,
                category_id: result[i]
            })
        }

        const isUpdate = await configs.db.courseCategory.createMany({
            data: data,
        })

        if(!isUpdate) return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
        return new ResponseSuccess(200, MESSAGE_SUCCESS_LOGIN, true);
    } catch (error: any){
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, "Internal Server", false);
    }
}

const CourseService = {
    editCourse,
}
export default CourseService;