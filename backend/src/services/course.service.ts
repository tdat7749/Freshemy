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
    MESSAGE_SUCCESS_COURSE_CREATED,
    MESSAGE_ERROR_COURSE_CREATE_FAILED,
    MESSAGE_ERROR_COURSE_SLUG_IS_USED,
    MESSAGE_SUCCESS_UPDATE_DATA,
} from "../utils/constant";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { RequestHasLogin } from "../types/request";
// import { ResponseBase } from "../commons/response";
import cloudinary from "../configs/cloudinary.config";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { Console } from "console";
const editCourse = async (req: Request) : Promise<ResponseBase> => {
    try{
        const {
            id,
            title,
            slug,
            summary,
            description,
            categories,
            status
        } = req.body;

        const isUpdateCourse = await configs.db.course.update({
            where: {
                id: id,
            },
            data: {
                title: title,
                slug: slug,
                summary: summary,
                description: description,
                status: status
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

const editThumbnail = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try{
        const thumbnail = req.file as Express.Multer.File;
        const { course_id } = req.body;
        const idConvert = +course_id
        const isFoundCourse = await db.course.findUnique({
            where: {
                id: idConvert,
            },
        });

        console.log(isFoundCourse)
        if (!isFoundCourse) {
            return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
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
            const isUpdate = await db.course.update({
                where: {
                    id: idConvert
                },
                data: {
                    thumbnail: uploadFileResult.url
                }
            })
            if(isUpdate) return new ResponseSuccess(200, MESSAGE_SUCCESS_UPDATE_DATA, true);
            else {
                await cloudinary.uploader.destroy(uploadFileResult.public_id);
            }
            return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
        }
        return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
    }catch(error:any){
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }

        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
}

export const createCourse = async (req: RequestHasLogin): Promise<ResponseBase> => {
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

export default {
    createCourse,
    editCourse,
    editThumbnail
};
