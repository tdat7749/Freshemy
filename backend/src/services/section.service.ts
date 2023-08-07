import { Request } from "express";
import configs from "../configs";
import { db } from "../configs/db.config";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";

import i18n from "../utils/i18next";
import { RequestHasLogin } from "src/types/request.type";

const getAllSectionByCourseId = async (req: Request): Promise<ResponseBase> => {
    try {
        const { course_id } = req.params;
        const isFoundSection = await configs.db.section.findMany({
            where: {
                course_id: parseInt(course_id),
                is_delete: false,
                course: {
                    is_delete: false,
                },
            },
            include: {
                lessons: {
                    where: {
                        is_delete: false,
                    },
                    select: {
                        title: true,
                        id: true,
                        url_video: true,
                        updated_at: true,
                        order: true,
                    },
                    orderBy: [
                        {
                            order: "asc",
                        },
                    ],
                },
                course: true,
            },
        });
        if (isFoundSection)
            return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccess"), true, isFoundSection);
        return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
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

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const createSection = async (req: Request): Promise<ResponseBase> => {
    try {
        const { title, course_id } = req.body;
        const isDeletedCourse = await configs.db.course.findFirst({
            where: {
                is_delete: true,
                id: course_id,
            },
        });
        if (isDeletedCourse) {
            return new ResponseError(404, i18n.t("errorMessages.courseNotFound"), false);
        }
        const section = await configs.db.section.create({
            data: {
                title: title,
                course_id: course_id,
            },
        });
        if (section) return new ResponseSuccess(201, i18n.t("successMessages.createDataSuccess"), true);
        return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
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

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const updateSection = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const section_id = +id;

        const isAuthor = await configs.db.section.findFirst({
            include: {
                course: true,
            },
            where: {
                id: section_id,
                course: {
                    user_id: req.user_id,
                },
            },
        });
        if (!isAuthor) {
            return new ResponseError(403, i18n.t("errorMessages.UnAuthorized"), false);
        }
        if (isAuthor.course.is_delete) {
            return new ResponseError(404, i18n.t("errorMessages.courseNotFound"), false);
        }
        if (isAuthor.is_delete) {
            return new ResponseError(404, i18n.t("errorMessages.sectionNotFound"), false);
        }
        const section = await configs.db.section.update({
            where: {
                id: section_id,
            },
            data: {
                title: title,
            },
        });
        if (section) return new ResponseSuccess(200, i18n.t("successMessages.updateDataSuccess"), true);
        return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
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

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const deleteSection = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const section_id = +id;
        const isAuthor = await configs.db.section.findFirst({
            include: {
                course: true,
            },
            where: {
                id: section_id,
                course: {
                    user_id: req.user_id,
                },
            },
        });
        if (!isAuthor) {
            return new ResponseError(403, i18n.t("errorMessages.UnAuthorized"), false);
        }
        if (isAuthor.course.is_delete) {
            return new ResponseError(404, i18n.t("errorMessages.courseNotFound"), false);
        }
        if (isAuthor.is_delete) {
            return new ResponseError(404, i18n.t("errorMessages.sectionNotFound"), false);
        }
        const lessonDeleteList = await configs.db.lesson.findMany({
            where: {
                section_id: section_id,
            },
            orderBy: {
                order: "asc",
            },
        });
        const baseOrder = lessonDeleteList[0];
        const topOrder = lessonDeleteList[lessonDeleteList.length - 1];
        const isDelete = await configs.db.section.update({
            where: {
                id: section_id,
            },
            data: {
                is_delete: true,
            },
        });
        if (isDelete) {
            const isDeleteLesson = await configs.db.lesson.updateMany({
                where: {
                    section_id: section_id,
                },
                data: {
                    is_delete: true,
                },
            });
            if (isDeleteLesson && baseOrder && topOrder) {
                const distanceOrder = topOrder.order - baseOrder.order + 1;
                const updateOrder = await configs.db.lesson.updateMany({
                    where: {
                        is_delete: false,
                        order: {
                            gt: baseOrder.order,
                        },
                        section: {
                            course_id: isDelete.course_id,
                        },
                    },
                    data: {
                        order: {
                            decrement: distanceOrder,
                        },
                    },
                });
                if (updateOrder) {
                    return new ResponseSuccess(200, i18n.t("successMessages.deleteDataSuccess"), true);
                }
            }
        }
        return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
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

        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};
const SectionService = {
    getAllSectionByCourseId,
    createSection,
    updateSection,
    deleteSection,
};
export default SectionService;
