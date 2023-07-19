import { Request } from "express";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response"
import { db } from '../configs/db.config'
import { RequestHasLogin } from "../types/request";
import cloudinary from "../configs/cloudinary.config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {UploadApiErrorResponse, UploadApiResponse} from 'cloudinary'

const createLesson = async (req: RequestHasLogin): Promise<ResponseBase> => {
    const { video, title, section_id } = req.body
    const createLesson = await db.lesson.create({
        //@ts-ignore
        data:{
            title:title,
            url_video: video,
            section_id:section_id
        }
    })
    
    console.log(createLesson)
    return new ResponseSuccess(200, 'Gửi thành công', true, createLesson)
}

const LessonService = {
    createLesson,
}

export default LessonService;