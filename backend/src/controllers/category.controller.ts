import { Request, Response } from "express";
import { ResponseError, ResponseSuccess } from "../commons/response";
import CategoryService from "../services/category.service";
import {
    MESSAGE_ERROR_CATEGORY_NOT_FOUND,
    MESSAGE_ERROR_INTERNAL_SERVER,
    MESSAGE_SUCCESS_CREATED_CATEGORY,
    MESSAGE_SUCCESS_DELETED_CATEGORY,
    MESSAGE_SUCCESS_RETRIEVED_CATEGORY,
    MESSAGE_SUCCESS_UPDATED_CATEGORY,
} from "../utils/constant";

class CategoryController {
    async createCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { title } = req.body;
            const category = await CategoryService.createCategory({ title });
            return res.json(new ResponseSuccess(200, MESSAGE_SUCCESS_CREATED_CATEGORY, true, category));
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false));
        }
    }

    async getAllCategories(req: Request, res: Response): Promise<Response> {
        try {
            const categories = await CategoryService.getAllCategories();
            return res.json(new ResponseSuccess(200, MESSAGE_SUCCESS_RETRIEVED_CATEGORY, true, categories));
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false));
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId: number = parseInt(req.params.id);
            const category = await CategoryService.getCategoryById(categoryId);
            if (category) {
                return res.json(new ResponseSuccess(200, MESSAGE_SUCCESS_RETRIEVED_CATEGORY, true, category));
            } else {
                return res.status(404).json(new ResponseError(404, MESSAGE_ERROR_CATEGORY_NOT_FOUND, false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false));
        }
    }

    async editCategory(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId: number = parseInt(req.params.id);
            const { title } = req.body;

            const updatedCategory = await CategoryService.editCategory(categoryId, { title });

            if (updatedCategory) {
                return res.json(new ResponseSuccess(200, MESSAGE_SUCCESS_UPDATED_CATEGORY, true, updatedCategory));
            } else {
                return res.status(404).json(new ResponseError(404, MESSAGE_ERROR_CATEGORY_NOT_FOUND, false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false));
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId: number = parseInt(req.params.id);

            const deletedCategory = await CategoryService.deleteCategory(categoryId);

            if (deletedCategory) {
                return res.json(new ResponseSuccess(200, MESSAGE_SUCCESS_DELETED_CATEGORY, true));
            } else {
                return res.status(404).json(new ResponseError(404, MESSAGE_ERROR_CATEGORY_NOT_FOUND, false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false));
        }
    }
}

export default CategoryController;
