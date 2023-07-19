import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import {
    MESSAGE_ERROR_INTERNAL_SERVER,
    MESSAGE_ERROR_BAD_REQUEST,
    MESSAGE_SUCCESS_GET_ALL_CATEGORIES,
    MESSAGE_SUCCESS_GET_CATEGORY_BY_ID,
    MESSAGE_ERROR_CATEGORY_NOT_FOUND,
    MESSAGE_SUCCESS_UPDATED_CATEGORY,
    MESSAGE_SUCCESS_DELETED_CATEGORY,
    MESSAGE_SUCCESS_CREATED_CATEGORY,
} from "../utils/constant";
import { db } from "../configs/db.config";

type CreateCategoryDTO = {
    title: string;
};

type UpdateCategoryDTO = {
    title: string;
};
export const createCategory = async (createCategoryDTO: CreateCategoryDTO) => {
    try {
        const category = await db.category.create({
            data: createCategoryDTO,
            select: {
                id: true,
                title: true,
            },
        });
        return new ResponseSuccess(200, MESSAGE_SUCCESS_CREATED_CATEGORY, true, category);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

export const getAllCategories = async () => {
    try {
        const categories = await db.category.findMany();
        return new ResponseSuccess(200, MESSAGE_SUCCESS_GET_ALL_CATEGORIES, true, categories);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

export const getCategoryById = async (categoryId: number) => {
    try {
        const category = await db.category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (category) {
            return new ResponseSuccess(200, MESSAGE_SUCCESS_GET_CATEGORY_BY_ID, true, category);
        } else {
            return new ResponseError(404, MESSAGE_ERROR_CATEGORY_NOT_FOUND, false);
        }
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

export const editCategory = async (categoryId: number, updateCategoryDTO: UpdateCategoryDTO) => {
    try {
        const existingCategory = await db.category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (!existingCategory) {
            return new ResponseError(404, MESSAGE_ERROR_CATEGORY_NOT_FOUND, false);
        }

        const updatedCategory = await db.category.update({
            where: {
                id: categoryId,
            },
            data: updateCategoryDTO,
            select: {
                id: true,
                title: true,
            },
        });

        return new ResponseSuccess(200, MESSAGE_SUCCESS_UPDATED_CATEGORY, true, updatedCategory);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

export const deleteCategory = async (categoryId: number) => {
    try {
        const existingCategory = await db.category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (!existingCategory) {
            return new ResponseError(404, MESSAGE_ERROR_CATEGORY_NOT_FOUND, false);
        }

        await db.category.delete({
            where: {
                id: categoryId,
            },
        });

        return new ResponseSuccess(200, MESSAGE_SUCCESS_DELETED_CATEGORY, true);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const CategoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    editCategory,
    deleteCategory,
};

export default CategoryService;
