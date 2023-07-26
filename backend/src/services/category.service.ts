import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";

import { db } from "../configs/db.config";
import i18n from "../utils/i18next";

export const getAllCategories = async (): Promise<ResponseBase> => {
    try {
        const categories = await db.category.findMany();
        return new ResponseSuccess(200, i18n.t("successMessages.getAllCategoriesSuccess"), true, categories);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, i18n.t("errorMessages.badRequest"), false);
        }
        return new ResponseError(500, i18n.t("errorMessages.internalServer"), false);
    }
};

const CategoryService = {
    getAllCategories,
};

export default CategoryService;
