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
    MESSAGE_SUCCESS_REGISTER_COURSE,
    MESSAGE_ERROR_BAD_REQUEST,
    MESSAGE_SUCCESS_UN_REGISTER_COURSE,
    MESSAGE_ERROR_COURSE_CREATE_FAILED,
    MESSAGE_ERROR_LOGIN_FAILED,
    MESSAGE_ERROR_SEND_EMAIL,
    MESSAGE_ERROR_LOGIN_UNVERIFIED,
    MESSAGE_SUCCESS_LOGIN,
    MESSAGE_ERROR_INTERNAL_SERVER,
    MESSAGE_ERROR_MISSING_REQUEST_BODY,
    MESSAGE_SUCCESS_COURSE_CREATED,
    MESSAGE_ERROR_COURSE_SLUG_IS_USED,
    MESSAGE_SUCCESS_UPDATE_DATA,
} from "../utils/constant"
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import cloudinary from "../configs/cloudinary.config";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { Console } from "console";

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
        //@ts-ignore
        let oldCategories = []
        for (let i = 0; i < beforeCategories.length; i++) oldCategories.push(beforeCategories[i].category_id);
        //@ts-ignore
        var result = afterCategories.filter(value => oldCategories.includes(value));
        var result1 = afterCategories.filter(function(val) {
            //@ts-ignore
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


const CourseService = {
    getCourseDetail,
    registerCourse,
    unsubcribeCourse,
    createCourse,
    editCourse,
    editThumbnail,
    searchMyCourses,
    deleteMyCourse,
};
export default CourseService;
