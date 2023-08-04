import { Request } from "express";
import configs from "../configs";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { RequestHasLogin } from "../types/request.type";
import services from ".";
import { resolutions } from "../commons";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import i18n from "../utils/i18next";
import { date } from "joi";

const getLesson = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const lesson_id = +id;
        const isFoundLesson = await configs.db.lesson.findFirst({
            where: {
                id: lesson_id,
                is_delete: false,
            },
        });
        const data = {
            id: isFoundLesson?.id,
            title: isFoundLesson?.title,
            url_video: isFoundLesson?.url_video,
        };
        if (isFoundLesson) return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccess"), true, data);
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
const getLessonOrderByCourseId = async (req: Request): Promise<ResponseBase> => {
    try {
        const { course_id } = req.params;
        const orderLesson = await configs.db.lesson.findMany({
            select: {
                id: true,
            },
            orderBy: {
                order: "asc",
            },
        });
        if (orderLesson) return new ResponseSuccess(200, i18n.t("successMessages.getDataSuccess"), true, orderLesson);
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

const createLesson = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { title, section_id, order, course_id } = req.body;
        const findCourse = await configs.db.section.findFirst({
            include: {
                course: true,
            },
            where: {
                id: Number(section_id),
                course: {
                    user_id: req.user_id,
                },
            },
        });
        if (!findCourse) {
            return new ResponseError(400, i18n.t("errorMessages.UnAuthorized"), false);
        }
        const sectionIdConvert = parseInt(section_id);
        const uuid = uuidv4();

        const videoPath = await services.FileStorageService.createFileM3U8AndTS(
            req.file as Express.Multer.File,
            resolutions,
            configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
            uuid,
        );
        const updateOrder = await configs.db.lesson.updateMany({
            where: {
                is_delete: false,
                order: {
                    gte: parseInt(order),
                },
                section: {
                    course_id: parseInt(course_id),
                },
            },
            data: {
                order: {
                    increment: 1,
                },
            },
        });
        const lesson = await configs.db.lesson.create({
            data: {
                order: parseInt(order),
                title: title,
                section_id: sectionIdConvert,
                url_video: videoPath,
            },
        });

        if (lesson) {
            return new ResponseSuccess(200, i18n.t("successMessages.createDataSuccess"), true);
        } else {
            fs.unlinkSync(path.join(configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS, uuid));
            fs.unlinkSync(req.file?.path as string);
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

const updateLesson = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const lesson_id = +id;
        if (req.file) {
            const isFoundLesson = await configs.db.lesson.findUnique({
                where: {
                    id: lesson_id,
                },
                include: {
                    section: {
                        include: {
                            course: true,
                        },
                    },
                },
            });

            if (!isFoundLesson) {
                return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
            }
            if (isFoundLesson.section.course.user_id !== req.user_id) {
                return new ResponseError(400, i18n.t("errorMessages.UnAuthorized"), false);
            }

            const urlVideoSplit = isFoundLesson.url_video.split(`${configs.general.PUBLIC_URL_FOLDER_VIDEOS}`);
            const nameFolder = urlVideoSplit[1].split("/")[1];
            if (!nameFolder) {
                return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
            }

            fs.rmSync(path.join(configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS, nameFolder), {
                recursive: true,
            });
            const videoPath = await services.FileStorageService.createFileM3U8AndTS(
                req.file as Express.Multer.File,
                resolutions,
                configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
                nameFolder,
            );

            const lesson = await configs.db.lesson.update({
                where: {
                    id: lesson_id,
                },
                data: {
                    title: title,
                    url_video: videoPath,
                },
            });

            if (lesson) {
                return new ResponseSuccess(200, i18n.t("successMessages.updateDataSuccess"), true);
            } else {
                fs.rmSync(path.join(configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS, nameFolder), { recursive: true });
                fs.unlinkSync(req.file?.path as string);
            }
        } else {
            const lesson = await configs.db.lesson.update({
                where: {
                    id: lesson_id,
                },
                data: {
                    title: title,
                },
            });
            if (lesson) return new ResponseSuccess(200, i18n.t("successMessages.updateDataSuccess"), true);
        }
        return new ResponseError(400, i18n.t("errorMessages.validationFailed"), false);
    } catch (error: any) {
        fs.unlinkSync(req.file?.path as string);
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

const deleteLesson = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { id, course_id } = req.params;
        console.log(course_id);
        const lesson_id = +id;
        const isAuthor = await configs.db.lesson.findFirst({
            include: {
                section: {
                    include: {
                        course: true,
                    },
                },
            },
            where: {
                id: lesson_id,
                section: {
                    course: {
                        user_id: req.user_id,
                    },
                },
            },
        });
        if (!isAuthor) {
            return new ResponseError(400, i18n.t("errorMessages.UnAuthorized"), false);
        }
        const isDelete = await configs.db.lesson.update({
            where: {
                id: lesson_id,
            },
            data: {
                is_delete: true,
            },
        });
        if (isDelete) {
            const updateOrder = await configs.db.lesson.updateMany({
                where: {
                    is_delete: false,
                    order: {
                        gt: isDelete.order,
                    },
                    section: {
                        course_id: parseInt(course_id),
                    },
                },
                data: {
                    order: {
                        decrement: 1,
                    },
                },
            });
            return new ResponseSuccess(200, i18n.t("successMessages.deleteDataSuccess"), true);
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

const reOrderLesson = async (req: Request): Promise<ResponseBase> => {
    try {
        const newOrers = req.body;
        for (const newOrder of newOrers) {
            await configs.db.lesson.update({
                where: {
                    id: newOrder.lessonId,
                },
                data: {
                    order: newOrder.newOrder,
                },
            });
        }
        return new ResponseSuccess(200, i18n.t("successMessages.sectionReorderSuccess"), true, newOrers);
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
const LessonService = {
    reOrderLesson,
    getLessonOrderByCourseId,
    getLesson,
    createLesson,
    updateLesson,
    deleteLesson,
};
export default LessonService;
