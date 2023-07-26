import { Course, CourseInfo, RequestHasLogin, ResponseData } from "../types/request";
import { Request } from "express";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import { db } from "../configs/db.config";
import { CourseDetail, Lesson, Section, Category, CourseEdit, OutstandingCourse } from "../types/courseDetail";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import cloudinary from "../configs/cloudinary.config";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import configs from "../configs";
import {
    MESSAGE_SUCCESS_GET_DATA,
    MESSAGE_ERROR_GET_DATA,
    MESSAGE_SUCCESS_REGISTER_COURSE,
    MESSAGE_ERROR_BAD_REQUEST,
    MESSAGE_SUCCESS_UN_REGISTER_COURSE,
    MESSAGE_ERROR_INTERNAL_SERVER,
    MESSAGE_ERROR_MISSING_REQUEST_BODY,
    MESSAGE_SUCCESS_COURSE_CREATED,
    MESSAGE_ERROR_COURSE_CREATE_FAILED,
    MESSAGE_SUCCESS_SEARCH_MY_COURSE,
    MESSAGE_ERROR_COURSE_NOT_FOUND,
    MESSAGE_SUCCESS_DELETED_COURSE,
    MESSAGE_ERROR_COURSE_SLUG_IS_USED,
    MESSAGE_SUCCESS_UPDATE_DATA,
} from "../utils/constant";
import {courses_categories} from "../types/courseCategory"
const getCourseDetail = async (req: Request): Promise<ResponseBase> => {
    try {
        const { slug } = req.params;
        const course = await db.course.findFirst({
            where: {
                slug: slug,
            },
            include: {
                courses_categories: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
                sections: {
                    select: {
                        title: true,
                        updated_at: true,
                        id: true,
                        lessons: {
                            select: {
                                id: true,
                                title: true,
                                url_video: true,
                            },
                        },
                    },
                    where: {
                        is_delete: false,
                    },
                },
                user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        id: true,
                    },
                },
            },
        });

        if (course) {
            if (course.is_delete) {
                return new ResponseError(404, MESSAGE_ERROR_GET_DATA, false);
            } else {
                const categories: Category[] = [];
                course.courses_categories.forEach((category) => {
                    categories.push(category.category);
                });
                const sections: Section[] = course.sections;
                const courseData: CourseDetail = {
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
                    status: course.status,
                };
                return new ResponseSuccess(200, MESSAGE_SUCCESS_GET_DATA, true, courseData);
            }
        }
        return new ResponseError(404, MESSAGE_ERROR_GET_DATA, false);
    } catch (error) {
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const getCourseDetailById = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const course = await db.course.findFirst({
            where: {
                id: parseInt(id),
            },
            include: {
                courses_categories: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });

        if (course) {
            if (course.is_delete) {
                return new ResponseError(404, MESSAGE_ERROR_GET_DATA, false);
            } else {
                const categories: Category[] = [];
                course.courses_categories.forEach((category) => {
                    categories.push(category.category);
                });
                const courseData: CourseEdit = {
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    categories: categories,
                    summary: course.summary,
                    thumbnail: course.thumbnail,
                    description: course.description,
                    created_at: course.created_at,
                    updated_at: course.updated_at,
                    status: course.status,
                };
                return new ResponseSuccess(200, MESSAGE_SUCCESS_GET_DATA, true, courseData);
            }
        }
        return new ResponseError(404, MESSAGE_ERROR_GET_DATA, false);
    } catch (error) {
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const registerCourse = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const { course_id } = req.body;
        if (user_id && course_id) {
            const checkRegisted = await db.enrolled.findFirst({
                where: {
                    user_id: user_id,
                    course_id: course_id,
                },
            });
            if (checkRegisted) {
                return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
            } else {
                const register = await db.enrolled.create({
                    data: {
                        user_id: user_id,
                        course_id: course_id,
                    },
                });
                if (register) {
                    return new ResponseSuccess(200, MESSAGE_SUCCESS_REGISTER_COURSE, true);
                } else {
                    return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
                }
            }
        } else {
            return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
        }
    } catch (error) {
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};
const unsubcribeCourse = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const { course_id } = req.body;
        if (user_id && course_id) {
            const checkRegisted = await db.enrolled.findFirst({
                where: {
                    user_id: user_id,
                    course_id: course_id,
                },
            });
            if (!checkRegisted) {
                return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
            } else {
                const unsubcribe = await db.enrolled.delete({
                    where: {
                        id: checkRegisted.id,
                    },
                });
                if (unsubcribe) {
                    return new ResponseSuccess(200, MESSAGE_SUCCESS_UN_REGISTER_COURSE, true);
                } else {
                    return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
                }
            }
        } else {
            return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
        }
    } catch (error) {
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const editCourse = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id, title, slug, summary, description, categories, status } = req.body;
        const course_id = parseInt(id)
        
        const isFoundDuplicateSlug = await db.course.findUnique({
            where: {
                slug: slug,
            },
        })
        if(isFoundDuplicateSlug) return new ResponseError(400, MESSAGE_ERROR_COURSE_SLUG_IS_USED, false) 

        const isFoundCourse = await db.course.findUnique({
            where: {
                id: course_id,
            },
        });

        if (isFoundCourse) {
            const isUpdateCourse = await db.course.update({
            where: {
                id: course_id,
            },
            data: {
                title: title,
                summary: summary,
                description: description,
                status: status,
                slug: slug
                },
            });
            if (!isUpdateCourse) return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
        }

        const currentCategories = await configs.db.courseCategory.findMany({
            where: {
                course_id: course_id,
            },
            select: {
                category_id: true,
            },
        });

        const isDelete = await configs.db.courseCategory.deleteMany({
            where: {
                course_id: course_id,
            },
        });
        if (!isDelete) return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
        
        let extractCategories: number[] = [];
        currentCategories.forEach(currentCategories => {
            extractCategories.push(currentCategories.category_id);
        });
        
        var resultDuplicate = categories.filter((value: number) => extractCategories.includes(value));
        var resultUnique = categories.filter(function (val: number) {
            return extractCategories.indexOf(val) == -1;
        });
        const finalResult = resultDuplicate.concat(resultUnique);
        let data: courses_categories[] = [];
        finalResult.forEach(async (category_id: number) => {
            data.push(
                {course_id,
                category_id}
            )
        });

        await db.courseCategory.createMany({
            data
        })
        return new ResponseSuccess(200, MESSAGE_SUCCESS_UPDATE_DATA, true);
    } catch (error: any) {
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
};

const editThumbnail = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const thumbnail = req.file as Express.Multer.File;
        const { course_id } = req.body;
        const idConvert = +course_id;
        const isFoundCourse = await db.course.findUnique({
            where: {
                id: idConvert,
            },
        });

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
                    id: idConvert,
                },
                data: {
                    thumbnail: uploadFileResult.url,
                },
            });
            if (isUpdate) return new ResponseSuccess(200, MESSAGE_SUCCESS_UPDATE_DATA, true);
            else {
                await cloudinary.uploader.destroy(uploadFileResult.public_id);
            }
            return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
        }
        return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }

        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const createCourse = async (req: RequestHasLogin): Promise<ResponseBase> => {
    const { title, slug, description, summary, categories, status, upload_preset } = req.body;

    const statusConvert = status === "0" ? false : true;

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
            const listCategoryId = categories.map((item: string) => ({
                category_id: parseInt(item),
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
                        status: statusConvert,
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

const searchMyCourses = async (pageIndex: number, keyword: string, userId: number): Promise<ResponseBase> => {
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

        const myCoursesData: CourseInfo[] = courses.map((course) => {
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

        const responseData: ResponseData = {
            total_page: totalPage,
            total_record: totalRecord,
            courses: myCoursesData,
        };

        return new ResponseSuccess<ResponseData>(200, MESSAGE_SUCCESS_SEARCH_MY_COURSE, true, responseData);
    } catch (error: any) {
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const deleteMyCourse = async (courseId: number): Promise<ResponseBase> => {
    try {
        // Check if the course exists
        const existingCourse = await db.course.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!existingCourse) {
            return new ResponseError(404, MESSAGE_ERROR_COURSE_NOT_FOUND, false);
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

        return new ResponseSuccess<ResponseData>(200, MESSAGE_SUCCESS_DELETED_COURSE, true);
    } catch (error: any) {
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const getTop10Courses = async (req: Request): Promise<ResponseBase> => {
    try {
        const courses = await db.enrolled.groupBy({
            by: ["course_id"],
            orderBy: {
                _count: {
                    user_id: "desc",
                },
            },
            take: 10,
        });

        const courseList = [];

        for (const course of courses) {
            const courseItem = await db.course.findFirst({
                where: {
                    id: course.course_id,
                    is_delete: false,
                },
                include: {
                    courses_categories: {
                        include: {
                            category: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                        },
                    },
                },
            });
            if (courseItem !== null) courseList.push(courseItem);
        }

        const result: OutstandingCourse[] = [];

        courseList.map((course) => {
            const data: OutstandingCourse = {
                id: course.id,
                thumbnail: course.thumbnail,
                title: course.title,
                slug: course.slug,
                categories: course.courses_categories.map((cate) => cate.category),
                author: course.user.last_name + " " + course.user.first_name,
                created_at: course.created_at,
                updated_at: course.updated_at,
            };
            result.push(data);
        });
        return new ResponseSuccess(200, MESSAGE_SUCCESS_GET_DATA, true, result);
    } catch (error) {
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const CourseService = {
    getCourseDetail,
    registerCourse,
    unsubcribeCourse,
    createCourse,
    editCourse,
    editThumbnail,
    searchMyCourses,
    deleteMyCourse,
    getCourseDetailById,
    getTop10Courses,
};
export default CourseService;
