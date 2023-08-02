import { CourseInfo, RequestHasLogin, ResponseData } from "../types/request";
import { Request } from "express";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import { db } from "../configs/db.config";
import {
    CourseDetail,
    Section,
    Category,
    CourseEdit,
    OutstandingCourse,
    FilteredCourseResult,
    AllCourseDetail,
    CourseOrderByWithRelationInput,
} from "../types/courseDetail";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import cloudinary from "../configs/cloudinary.config";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import configs from "../configs";
import { CourseCategory } from "@prisma/client";
import i18n from "../utils/i18next";
import { generateUniqueSlug } from "../utils/helper";
import services from ".";

const createCourse = async (req: RequestHasLogin): Promise<ResponseBase> => {
    const { title, slug, description, summary, categories, status, thumbnail } = req.body;
    const user_id = req.user_id;

    try {
        const isFoundCourse = await db.course.findUnique({
            where: {
                slug: slug,
            },
        });

        if (isFoundCourse) {
            return new ResponseError(400, i18n.t("errorMessages.slugIsUsed"), false);
        }

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
                    sections: {
                        include: {
                            lessons: true,
                        },
                    },
                },
            });

            // if (isCreateCourse) {
            //     // Fetch all courses after creating the new course
            //     const allCourses = await getAllCourses(1, "", 0, "newest");

            //     // Find the index of the newly created course in the sorted list
            //     const newCourseIndex = allCourses.data.courses.findIndex(
            //         (course: any) => course.id === isCreateCourse.id,
            //     );

            //     // Move the newly created course to the beginning of the list
            //     if (newCourseIndex !== -1) {
            //         allCourses.data.courses.unshift(allCourses.data.courses.splice(newCourseIndex, 1)[0]);
            //     }

            //     return allCourses;
            // } else {
            //     return new ResponseError(400, i18n.t("errorMessages.createCourseFailed"), false);
            // }

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
                        user: true,
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
                const courseData: CourseDetail = {
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    categories: categories,
                    summary: course.summary,
                    author: course.user,
                    rating: 5,
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
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
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
        const { id, title, summary, description, categories, status, thumbnail } = req.body;
        const courseId = parseInt(id);

        const isFoundCourseById = await db.course.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!isFoundCourseById) {
            return new ResponseError(400, i18n.t("errorMessages.courseNotFound"), false);
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
            return new ResponseError(400, i18n.t("errorMessages.missingRequestBody"), false);
        }

        const uploadFileResult = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
            cloudinary.uploader.upload(thumbnail.path, (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                if (error) {
                    reject(undefined);
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

            if (isUpdate) {
                return new ResponseSuccess(200, i18n.t("successMessages.updateDataSuccess"), true);
            } else {
                await cloudinary.uploader.destroy(uploadFileResult.public_id);
            }
        }

        return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
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

        return new ResponseSuccess<ResponseData>(
            200,
            i18n.t("successMessages.searchMyCourseSuccess"),
            true,
            responseData,
        );
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

        return new ResponseSuccess<ResponseData>(200, i18n.t("successMessages.deleteCourseSuccess"), true);
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
        return new ResponseSuccess(200, i18n.t("successMessages.Get data successfully"), true, result);
    } catch (error) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const getAllCourses = async (
    pageIndex?: number,
    keyword?: string,
    categories?: string[],
    sortBy?: string,
    filterByRatings?: "asc" | "desc" | undefined,
    ratings?: number,
): Promise<ResponseBase> => {
    try {
        const take = 10;
        const skip = ((pageIndex ?? 1) - 1) * take;

        const categoryIDs = await getCategoryIDs(categories ?? []);
        const orderBy: CourseOrderByWithRelationInput = {};

        if (sortBy === "newest") {
            orderBy.created_at = "desc";
        } else if (sortBy === "attendees") {
            orderBy.enrolleds = { _count: "desc" };
        }

        const coursesQuery = db.course.findMany({
            where: {
                title: keyword
                    ? {
                          contains: keyword.toLowerCase(),
                      }
                    : undefined,
                is_delete: false,

                ratings: ratings
                    ? {
                          some: {
                              score: ratings,
                          },
                      }
                    : undefined,

                courses_categories:
                    categories && categories.length > 0
                        ? {
                              some: {
                                  category: {
                                      title: {
                                          in: categories,
                                      },
                                  },
                              },
                          }
                        : undefined,
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
                sections: {
                    include: {
                        lessons: true,
                    },
                },
                enrolleds: {
                    include: {
                        user: true,
                    },
                },
            },
            skip,
            take,
            orderBy,
        });

        const [courses, totalRecord] = await Promise.all([
            coursesQuery,
            db.course.count({
                where: {
                    title: keyword ? { contains: keyword.toLowerCase() } : undefined,
                    is_delete: false,
                    courses_categories: {
                        some: {
                            category: {
                                id: {
                                    in: categoryIDs,
                                },
                            },
                        },
                    },
                },
            }),
        ]);

        const totalPage = Math.ceil(totalRecord / take);

        // Filter courses based on the ratings
        const filteredCourses = courses.filter((course) => {
            const ratingsSum = course.ratings.reduce((total, rating) => total + rating.score, 0);
            const averageRating = course.ratings.length > 0 ? ratingsSum / course.ratings.length : 0;

            if (ratings === undefined) {
                return true; // No rating filter, include all courses
            }

            if (filterByRatings === "asc") {
                return averageRating >= ratings;
            } else {
                return averageRating <= ratings;
            }
        });

        const coursesData: AllCourseDetail[] = filteredCourses
            .map((course) => ({
                ...course,
                attendees: course.enrolleds.length, // Calculate number of attendees
            }))
            .filter((course) => course.attendees > 0) // Filter out courses with zero attendees
            .map((course) => {
                const ratingsSum = course.ratings.reduce((total, rating) => total + rating.score, 0);
                const averageRating = (course.ratings.length > 0 ? ratingsSum / course.ratings.length : 0).toFixed(1);

                return {
                    id: course.id,
                    slug: course.slug,
                    thumbnail: course.thumbnail,
                    author: {
                        id: course.user.id,
                        first_name: course.user.first_name,
                        last_name: course.user.last_name,
                    },
                    rate: averageRating,
                    categories: course.courses_categories.map((cc) => {
                        return {
                            id: cc.category.id,
                            title: cc.category.title,
                        };
                    }),
                    title: course.title,
                    summary: course.summary,
                    description: course.description,
                    status: course.status,
                    attendees: course.enrolleds.length,
                    created_at: course.created_at,
                    updated_at: course.updated_at,
                    ratings: course.ratings.map((rating) => ({
                        id: rating.id,
                        score: rating.score,
                        content: rating.content,
                        created_at: rating.created_at,
                        user: {
                            id: rating.user.id,
                            first_name: rating.user.first_name,
                            last_name: rating.user.last_name,
                        },
                    })),
                };
            });

        const responseData: FilteredCourseResult = {
            total_page: totalPage,
            total_record: totalRecord,
            courses: coursesData,
        };

        console.log("Courses Data:", responseData);

        return new ResponseSuccess<FilteredCourseResult>(
            200,
            i18n.t("successMessages.getDataSuccess"),
            true,
            responseData,
        );
    } catch (error) {
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const getCategoryIDs = async (categories: string[]): Promise<number[]> => {
    const categoryIDs: number[] = [];
    for (const category of categories) {
        const categoryData = await db.category.findFirst({
            where: {
                title: category,
            },
            select: {
                id: true,
            },
        });
        if (categoryData) {
            categoryIDs.push(categoryData.id);
        }
    }
    return categoryIDs;
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
    getAllCourses,
    getCategoryIDs,
};
export default CourseService;
