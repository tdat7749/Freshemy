import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import { RequestHasLogin } from "../types/request.type";
import { db } from "../configs/db.config";
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import configs from "../configs";
import {OutstandingCourse} from "../types/courseDetail"
import i18n from "../utils/i18next";

const changePassword = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { current_password, new_password, confirm_password } = req.body;

        if (new_password !== confirm_password) {
            return new ResponseError(400, i18n.t("errorMessages.newPasswordDiiferentOldPassword"), false);
        }

        const user = await db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
            },
        });
        if (user) {
            const isCorrectPassword = await bcrypt.compare(current_password, user.password);
            if (isCorrectPassword) {
                const hashedNewPassword = await bcrypt.hash(new_password, configs.general.HASH_SALT);

                await db.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        password: hashedNewPassword,
                    },
                });
                return new ResponseSuccess(200, i18n.t("successMessages.changePasswordSuccessfully"), true);
            }

            return new ResponseError(400, i18n.t("errorMessages.wrongPassword"), false);
        }

        return new ResponseError(404, i18n.t("errorMessages.userNotFound"), false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
        }
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const getInformation = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const user = await db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
            },
            select: {
                first_name: true,
                last_name: true,
                description: true,
                url_avatar: true,
                email: true
            }
        });

        if(!user) return new ResponseError(404, i18n.t("errorMessages.userNotFound"), false);
        return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccessfully"), true,user);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
        }
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
}

const changeUserInformation = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { last_name, first_name, description } = req.body;
        const user = await db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
            }
        });

        if(!user) return new ResponseError(404, i18n.t("errorMessages.userNotFound"), false);

        const isUpdate = await db.user.update({
            where: {
                id: req.user_id
            },
            data: {
                last_name: last_name,
                first_name: first_name,
                description: description
            }
        });

        if(!isUpdate) return new ResponseSuccess(200, i18n.t("errorMessages.missingRequestBody"), false);
        return new ResponseSuccess(200, i18n.t("successMessages.updateDataSuccess"), true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
        }
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
}

const getAuthorInformation = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const user_id = +id;
        const user = await db.user.findFirst({
            where: {
                id: user_id,
                is_verify: true,
            },
            select: {
                first_name:true,
                last_name: true,
                url_avatar: true,
                description: true,
                courses:{
                    where: {
                        is_delete: false
                    },
                    include: {
                        courses_categories: {
                            select: {
                                category: {
                                    select: {
                                        id: true,
                                        title: true,
                                    },
                                },
                            },
                        },
                    }
                },
            },
        });

        if(!user) return new ResponseError(404, i18n.t("errorMessages.userNotFound"), false);

        const courses: OutstandingCourse[] = [];
    
        user?.courses.map((course) =>{
            const data: OutstandingCourse = {
                id: course.id,
                thumbnail: course.thumbnail,
                title: course.title,
                slug: course.slug,
                categories: course.courses_categories.map((cate) => cate.category),
                author: user.last_name + " " + user.first_name,
                created_at: course.created_at,
                updated_at: course.updated_at
            };
            courses.push(data);
        })

        const data = {
            first_name: user.first_name,
            last_name: user.last_name,
            url_avatar: user.url_avatar,
            description: user.description,
            courses: courses,
        }
        return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccessfully"), true,data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
        }
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
}


const UserService = {
    changePassword,
    getInformation,
    changeUserInformation,
    getAuthorInformation
};

export default UserService;
