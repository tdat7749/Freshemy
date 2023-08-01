import { RequestHasLogin } from "../types/request.type";
import { Request } from "express";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import { db } from "../configs/db.config";
import { CourseDetail, Category, CourseEdit, OutstandingCourse, CourseInfo } from "../types/course.type";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import configs from "../configs";
import { CourseCategory } from "@prisma/client";
import i18n from "../utils/i18next";
import { generateUniqueSlug } from "../utils/helper";
import services from ".";
import { RatingResponse } from "../types/ratings.type";
import { PagingResponse } from "../types/response.type";
import { Section } from "../types/section.type";

const createCourse = async (req: RequestHasLogin): Promise<ResponseBase> => {
    const { title, slug, description, summary, categories, status, thumbnail } = req.body;
    const user_id = req.user_id;
    try {
        const listCategoryId = categories.map((item: number) => ({
            category_id: item,
        }));

        const uniqueSlug = generateUniqueSlug(slug);

        if (user_id) {
            const isCreateCourse = await db.course.create({
                data: {
                    title: title,
                    slug: uniqueSlug,
                    description: description,
                    summary: summary,
                    thumbnail: thumbnail,
                    user_id: user_id,
                    status: status,
                    courses_categories: {
                        create: listCategoryId,
                    },
                },
            });

            if (isCreateCourse) {
                return new ResponseSuccess(201, i18n.t("successMessages.createDataSuccess"), true);
            } else {
                return new ResponseError(400, i18n.t("errorMessages.createCourseFailed"), false);
            }
        }

        return new ResponseError(400, i18n.t("errorMessages.createCourseFailed"), false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const getCourseDetail = async (req: Request): Promise<ResponseBase> => {
    try {
        const { slug } = req.params;
        const course = await db.course.findUnique({
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
                            where: {
                                is_delete: false,
                            },
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
                ratings: {
                    include: {
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                url_avatar: true,
                            },
                        },
                    },
                },
            },
        });

        if (course) {
            if (course.is_delete) {
                return new ResponseError(404, i18n.t("errorMessages.getDataFailed"), false);
            } else {
                const categories: Category[] = [];
                course.courses_categories.forEach((category) => {
                    categories.push(category.category);
                });
                const sections: Section[] = course.sections;
                let averageRating: number = 0;
                if (course.ratings.length > 0) {
                    const ratingsSum = course.ratings.reduce((total, rating) => total + rating.score, 0);
                    averageRating = Number((ratingsSum / course.ratings.length).toFixed(1));
                }
                const courseData: CourseDetail = {
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    categories: categories,
                    summary: course.summary,
                    author: course.user,
                    rating: averageRating,
                    thumbnail: course.thumbnail,
                    description: course.description,
                    sections: sections,
                    created_at: course.created_at,
                    updated_at: course.updated_at,
                    status: course.status,
                };
                return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccess"), true, courseData);
            }
        }
        return new ResponseError(404, i18n.t("errorMessages.getDataFailed"), false);
    } catch (error) {
        return new ResponseError(500, error as string, false);
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
                return new ResponseError(404, i18n.t("errorMessages.getDataFailed"), false);
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
                return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccess"), true, courseData);
            }
        }
        return new ResponseError(404, i18n.t("errorMessages.getDataFailed"), false);
    } catch (error) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
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
                return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
            } else {
                const register = await db.enrolled.create({
                    data: {
                        user_id: user_id,
                        course_id: course_id,
                    },
                });
                if (register) {
                    return new ResponseSuccess(200, i18n.t("successMessages.registerCourseSuccess"), true);
                } else {
                    return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
                }
            }
        } else {
            return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
        }
    } catch (error) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
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
                return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
            } else {
                const unsubcribe = await db.enrolled.delete({
                    where: {
                        id: checkRegisted.id,
                    },
                });
                if (unsubcribe) {
                    return new ResponseSuccess(200, i18n.t("successMessages.unRegisterCourseSuccess"), true);
                } else {
                    return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
                }
            }
        } else {
            return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
        }
    } catch (error) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const editCourse = async (req: Request): Promise<ResponseBase> => {
    try {
        const { course_id, title, summary, description, categories, status, thumbnail } = req.body;
        const courseId = parseInt(course_id);

        const isFoundCourseById = await db.course.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!isFoundCourseById) {
            return new ResponseError(404, i18n.t("errorMessages.courseNotFound"), false);
        }

        const course: any = {
            where: {
                id: courseId,
            },
            data: {
                title: title,
                summary: summary,
                description: description,
                status: status,
            },
        };

        if (thumbnail) {
            course.data.thumbnail = thumbnail;
        }

        const isUpdateCourse = await db.course.update(course);

        if (!isUpdateCourse) return new ResponseError(400, i18n.t("errorMessages.missingRequestBody"), false);

        //destroy thumbnail in cloudinary
        await services.FileStorageService.destroyImageInCloudinary(isFoundCourseById.thumbnail as string);

        const isDelete = await configs.db.courseCategory.deleteMany({
            where: {
                course_id: courseId,
            },
        });
        if (!isDelete) return new ResponseError(400, i18n.t("errorMessages.missingRequestBody"), false);

        const data: CourseCategory[] = categories.map((category: number) => {
            return {
                course_id: courseId,
                category_id: category,
            };
        });

        const isUpdateCategory = await db.courseCategory.createMany({
            data,
        });

        if (!isUpdateCategory) return new ResponseError(400, i18n.t("errorMessages.missingRequestBody"), false);
        return new ResponseSuccess(200, i18n.t("successMessages.updateDataSuccess"), true);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        } else if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const searchMyCourses = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { page_index: pageIndex, keyword } = req.query;
        const { user_id: userId } = req;

        const parsedPageIndex = Number(pageIndex);
        const parsedKeyword = keyword as string;

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
            let averageRating: number = 0;
            if (course.ratings.length > 0) {
                const ratingsSum = course.ratings.reduce((total, rating) => total + rating.score, 0);
                averageRating = Number((ratingsSum / course.ratings.length).toFixed(1));
            }

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

        const responseData: PagingResponse<CourseInfo[]> = {
            total_page: totalPage,
            total_record: totalRecord,
            data: myCoursesData,
        };

        return new ResponseSuccess(200, i18n.t("successMessages.searchMyCourseSuccess"), true, responseData);
    } catch (error: any) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
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
            return new ResponseError(404, i18n.t("errorMessages.courseNotFound"), false);
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

        return new ResponseSuccess(200, i18n.t("successMessages.deleteCourseSuccess"), true);
    } catch (error: any) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
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
        return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccessfully"), true, result);
    } catch (error) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const ratingCourse = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { content, course_id, ratings } = req.body;
        const user_id = req.user_id;
        const isFindCourse = await db.course.findFirst({
            where: {
                id: course_id,
            },
        });
        if (!isFindCourse) {
            return new ResponseError(404, i18n.t("errorMessages.courseNotFound"), false);
        }
        const isAlreadyRated = await db.rating.findFirst({
            where: {
                user_id: user_id,
                course_id: course_id,
            },
        });
        if (isAlreadyRated) {
            return new ResponseError(400, i18n.t("errorMessages.ratingError"), false);
        }
        const create_rating = await db.rating.create({
            data: {
                content: content,
                user_id: Number(user_id),
                course_id: course_id,
                score: ratings,
            },
        });

        return new ResponseSuccess(200, i18n.t("successMessages.ratingSuccess"), true);
    } catch (error: any) {
        return new ResponseError(500, error.message, false);
    }
};
const getRightOfCourse = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const course_id = parseInt(req.params.course_id);
        const isAuthor = await configs.db.course.findFirst({
            where: {
                id: course_id,
                user_id: user_id,
            },
        });
        if (isAuthor) {
            return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccess"), true, { role: "Author" });
        }
        const isEnrolled = await configs.db.enrolled.findFirst({
            where: {
                course_id: course_id,
                user_id: user_id,
            },
        });
        if (isEnrolled) {
            return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccess"), true, { role: "Enrolled" });
        }
        return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccess"), true, { role: "Unenrolled" });
    } catch (error) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const getListRatingsOfCourseBySlug = async (req: Request): Promise<ResponseBase> => {
    const { slug } = req.params;
    const { page_index: pageIndex } = req.query;
    const pageSize = configs.general.PAGE_SIZE;

    const isFoundCourse = await configs.db.course.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
        },
    });

    if (!isFoundCourse) {
        return new ResponseError(404, i18n.t("errorMessages.courseNotFound"), false);
    }

    const listRatings = await configs.db.rating.findMany({
        skip: pageSize * (Number(pageIndex) - 1),
        take: pageSize,
        where: {
            course_id: isFoundCourse.id,
        },
        include: {
            user: {
                select: {
                    url_avatar: true,
                    first_name: true,
                    last_name: true,
                },
            },
        },
        orderBy: {
            created_at: "desc",
        },
    });

    const totalRecord = await configs.db.rating.count({
        where: {
            course_id: isFoundCourse.id,
        },
    });

    const totalPage = Math.ceil(totalRecord / configs.general.PAGE_SIZE);

    const formatListRatings: RatingResponse[] = [];

    listRatings.map((item) => {
        let rating: RatingResponse = {
            id: item.id,
            content: item.content,
            created_at: item.created_at.toString(),
            ratings: item.score,
            url_avatar: item.user.url_avatar,
            first_name: item.user.first_name,
            last_name: item.user.last_name,
            user_id: item.user_id,
        };
        return formatListRatings.push(rating);
    });

    const responseData: PagingResponse<RatingResponse[]> = {
        total_record: totalRecord,
        total_page: totalPage,
        data: formatListRatings,
    };

    return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccess"), true, responseData);
};

const CourseService = {
    getRightOfCourse,
    getCourseDetail,
    registerCourse,
    unsubcribeCourse,
    createCourse,
    editCourse,
    searchMyCourses,
    deleteMyCourse,
    getCourseDetailById,
    getTop10Courses,
    ratingCourse,
    getListRatingsOfCourseBySlug,
};
export default CourseService;
