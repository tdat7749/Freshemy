import { RequestHasLogin } from "../types/request";
import { db } from "../configs/db.config";
import cloudinary from "../configs/cloudinary.config";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import {
    MESSAGE_ERROR_INTERNAL_SERVER,
    MESSAGE_ERROR_COURSE_SLUG_IS_USED,
    MESSAGE_SUCCESS_COURSE_CREATED,
    MESSAGE_ERROR_COURSE_CREATE_FAILED,
} from "../utils/constant";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";


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

const CourseService = {
    createCourse,
    searchMyCourses,
    deleteMyCourse,
};

export default CourseService;
