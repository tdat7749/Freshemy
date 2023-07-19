import { Request } from "express";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response"
import { db } from '../configs/db.config'
import { 
    CourseDetailResponseData,
    Lesson,
    Section,
    Category
 } from "../types/courseDetail";
import { RequestHasLogin } from "../types/request";
import { 
    MESSAGE_SUCCESS_GET_DATA,
    MESSAGE_ERROR_GET_DATA,
    MESSAGE_ERROR_INTERNAL_SERVER,
    MESSAGE_SUCCESS_REGISTER_COURSE,
    MESSAGE_ERROR_BAD_REQUEST,
    MESSAGE_SUCCESS_UN_REGISTER_COURSE,
    MESSAGE_ERROR_COURSE_SLUG_IS_USED,
    MESSAGE_SUCCESS_COURSE_CREATED,
    MESSAGE_ERROR_COURSE_CREATE_FAILED
} from "../utils/constant"
import cloudinary from "../configs/cloudinary.config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {UploadApiErrorResponse, UploadApiResponse} from 'cloudinary'

const getCourseDetail = async (req: Request): Promise<ResponseBase>=>{
    try {
        const {slug} = req.params
        const course = await db.course.findFirst({
            where: {
                slug: slug,
            },
            include:{
                courses_categories:{
                    include:{
                        category:{
                            select:{
                                id:true,
                                title:true
                            }
                        }
                    }
                },
                sections:{
                    select:{
                        title:true,
                        updated_at:true,
                        lessions:{
                            select:{
                                title:true,
                                url_video:true
                            }
                        }
                    }
                },
                user:{
                    select:{
                        first_name:true,
                        last_name:true,
                        id:true,
                    }
                }
            }
        });   
        
        if(course) {
            if(course.is_delete) {
                return new ResponseError(404,MESSAGE_ERROR_GET_DATA,false) 
            } else {
                const categories: Category[]= []
                const sections: Section[]=[]
                course.courses_categories.forEach(category => {
                    categories.push( category.category )
                })
                course.sections.forEach(section=> {
                    const lessons: Lesson[]= []
                    section.lessions.forEach(lesson => {
                        lessons.push(lesson)
                    })
                    section.lessions=lessons;
                    sections.push(section)
                })
                const courseData : CourseDetailResponseData = {
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    categories: categories,
                    summary: course.summary,
                    author: course.user,
                    ratings: 5,
                    thumbnail: course.thumbnail,
                    description: course.description,
                    sections: sections,
                    created_at: course.created_at,
                    updated_at: course.updated_at,
                }
                    return new ResponseSuccess(200,MESSAGE_SUCCESS_GET_DATA, true, courseData)
            }                     
        }
        return new ResponseError(404,MESSAGE_ERROR_GET_DATA,false)
    } catch (error) {
        console.log(error)
        return new ResponseError(500,MESSAGE_ERROR_INTERNAL_SERVER,false)
    }
}
const registerCourse = async (req: RequestHasLogin): Promise<ResponseBase>=>{
    try {
        const user_id = req.user_id
        const { course_id } = req.body
        if(user_id && course_id) {
            const checkRegisted = await db.enrolled.findFirst({
                where: {
                    user_id: user_id,
                    course_id: course_id
                }
            })
            if(checkRegisted) {
                return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false)
            } else {
                const register = await db.enrolled.create({
                    //@ts-ignore
                    data: {
                        user_id: user_id,
                        course_id: course_id,
                    }
                })
                if(register) {
                    return new ResponseSuccess(200, MESSAGE_SUCCESS_REGISTER_COURSE, true)
                } else {
                    return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false)
                }
            }
        }
        else {
            return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false)
        }
    } catch (error) {
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false)
    }
}
const unsubcribeCourse = async (req: RequestHasLogin): Promise<ResponseBase>=>{
    try {
        const user_id = req.user_id
        const { course_id } = req.body
        if(user_id && course_id) {
            const checkRegisted = await db.enrolled.findFirst({
                where: {
                    user_id: user_id,
                    course_id: course_id
                }
            })
            if(!checkRegisted) {
                return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false)
            } else {
                const unsubcribe = await db.enrolled.delete({
                    where:{
                        id: checkRegisted.id
                    }
                })
                if(unsubcribe) {
                    return new ResponseSuccess(200, MESSAGE_SUCCESS_UN_REGISTER_COURSE, true)
                } else {
                    return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false)
                }
            }
        }
        else {
            return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false)
        }
    } catch (error) {
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false)
    }
}
const createCourse = async (req: RequestHasLogin): Promise<ResponseBase> => {
    const { title, slug, description, summary, categories, status } = req.body;
    const user_id = req.user_id;
    const thumbnail = req.file as Express.Multer.File;

    try {
        const isFoundCourse = await db.course.findUnique({
            where: {
                slug: slug,
            },
        });

        if (isFoundCourse) {
            return new ResponseError(400, MESSAGE_ERROR_COURSE_SLUG_IS_USED, false);
        }

        const uploadFileResult = await new Promise<undefined | UploadApiResponse>((resolve, rejects) => {
            cloudinary.uploader.upload(thumbnail.path, (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                if (error) {
                    rejects(undefined);
                } else {
                    resolve(result);
                }
            });
        });

        if (uploadFileResult) {
            const listCategoryId = categories.map((item: number) => ({
                category_id: item,
            }));

            if (user_id) {
                const isCreateCourse = await db.course.create({
                    data: {
                        title: title,
                        slug: slug,
                        description: description,
                        summary: summary,
                        thumbnail: uploadFileResult.url,
                        user_id: user_id,
                        status: status,
                        courses_categories: {
                            create: listCategoryId,
                        },
                    },
                });

                if (isCreateCourse) {
                    return new ResponseSuccess(201, MESSAGE_SUCCESS_COURSE_CREATED, true);
                } else {
                    await cloudinary.uploader.destroy(uploadFileResult.public_id);
                }
            }
            return new ResponseError(400, MESSAGE_ERROR_COURSE_CREATE_FAILED, false);
        }
        return new ResponseError(400, MESSAGE_ERROR_COURSE_CREATE_FAILED, false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};


const CourseService = {
    getCourseDetail,
    registerCourse,
    unsubcribeCourse,
    createCourse,
};
export default CourseService;








