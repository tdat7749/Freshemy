import { Request } from "express";
import configs from "../configs";
import { RequestHasLogin } from "../types/request";
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

        let newCategories = []
        for (let i = 0; i < categories.length; i++) {
            newCategories.push(categories[i])
        }
        const currentCategories = await configs.db.courseCategory.findMany({
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

        let extractCategories: number[] = []
        for (let i = 0; i < currentCategories.length; i++) extractCategories.push(currentCategories[i].category_id);

        var resultDuplicate = newCategories.filter(value => extractCategories.includes(value));
        var resultUnique = newCategories.filter(function(val) {
            return extractCategories.indexOf(val) == -1;
        });
        const finalResult = resultDuplicate.concat(resultUnique);
        
        let data = []
        for (let i = 0; i < finalResult.length; i++) {
            data.push({
                course_id: id,
                category_id: finalResult[i]
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

export const searchMyCourses = async (pageIndex: number, keyword: string, userId: number): Promise<any> => {
    try {
        const parsedPageIndex = parseInt(pageIndex.toString(), 10);
        const parsedKeyword = keyword;

        const skip = (parsedPageIndex - 1) * 10;
        const take = 10;

        const courses = await db.course.findMany({
            skip,
            take,
            where: {
                title: {
                    contains: parsedKeyword,
                },
                user_id: userId,
                is_delete: false, // Exclude deleted courses
            },
            include: {
                user: true,
                courses_categories: {
                    include: {
                        category: true,
                    },
                },
                ratings: {
                    include: {
                        user: true,
                    },
                },
                sections: true,
            },
        });

        const totalRecord = await db.course.count({
            where: {
                title: {
                    contains: parsedKeyword,
                },
                user_id: userId,
                is_delete: false,
            },
        });

        const totalPage = Math.ceil(totalRecord / take);

        const myCoursesData = courses.map((course) => {
            const ratingsSum = course.ratings.reduce((total, rating) => total + rating.score, 0);
            const averageRating = course.ratings.length > 0 ? ratingsSum / course.ratings.length : 0;

            return {
                id: course.id,
                title: course.title,
                summary: course.summary,
                thumbnail: course.thumbnail,
                rate: averageRating,
                author: `${course.user?.first_name} ${course.user?.last_name}`,
                category: course.courses_categories.map((cc) => cc.category.title),
                number_section: course.sections.length,
                slug: course.slug,
            };
        });

        return {
            success: true,
            message: "Get data successfully",
            status_code: 200,
            data: {
                total_page: totalPage,
                total_record: totalRecord,
                courses: myCoursesData,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Internal Server Error",
            status_code: 500,
        };
    }
};

export const deleteMyCourse = async (courseId: number): Promise<any> => {
    try {
        // Check if the course exists
        const existingCourse = await db.course.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!existingCourse) {
            return {
                success: false,
                message: "Course not found",
                status_code: 404,
            };
        }

        // Set is_delete field to true to mark the course as deleted
        await db.course.update({
            where: {
                id: courseId,
            },
            data: {
                is_delete: true,
            },
        });

        return {
            success: true,
            message: "Delete successfully",
            status_code: 200,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Internal Server Error",
            status_code: 500,
        };
    }
};

export default {
    createCourse,
    editCourse,
    editThumbnail,
    searchMyCourses,
    deleteMyCourse,
}