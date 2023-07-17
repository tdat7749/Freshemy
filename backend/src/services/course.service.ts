import { RequestHasLogin } from "../types/request";
// import { ResponseBase } from "../commons/response";
import { db } from "../configs/db.config";
import cloudinary from "../configs/cloudinary.config";
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import { ResponseBase, ResponseError, ResponseSuccess } from "src/commons/response";
import { MESSAGE_ERROR_INTERNAL_SERVER, MESSAGE_ERROR_COURSE_SLUG_IS_USED, MESSAGE_SUCCESS_COURSE_CREATED, MESSAGE_ERROR_COURSE_CREATE_FAILED } from "src/utils/constant";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const createCourse = async (req: RequestHasLogin): Promise<ResponseBase> => {
    const { title, slug, status, description, summary, categories } = req.body;
    const user_id = req.user_id
    const thumbnail = req.file

    try {
        const isFoundCourse = await db.course.findUnique({
            where: {
                slug: slug
            }
        })

        if (!isFoundCourse) {
            return new ResponseError(400, MESSAGE_ERROR_COURSE_SLUG_IS_USED, false)
        }

        if (thumbnail) {
            const uploadThumbnailResult = await cloudinary.uploader.upload(thumbnail.path, (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                if (error) {
                    return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false)
                }

                return result
            })

            const listCategoryId = categories.map((item: number) => ({
                category_id: item
            }))

            if (user_id) {
                const isCreateCourse = await db.course.create({
                    data: {
                        title: title,
                        slug: slug,
                        status: status,
                        description: description,
                        summary: summary,
                        thumbnail: uploadThumbnailResult.url,
                        user_id: user_id,
                        courses_categories: {
                            create: listCategoryId,
                        },
                    },
                });

                if (isCreateCourse) {
                    return new ResponseSuccess(201, MESSAGE_SUCCESS_COURSE_CREATED, true)
                }

                return new ResponseError(400, MESSAGE_ERROR_COURSE_CREATE_FAILED, false)
            }
        }
        return new ResponseError(400, MESSAGE_ERROR_COURSE_CREATE_FAILED, false)
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false)
        }
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false)
    }
};
