import { Request, Response } from "express";
import { ResponseError, ResponseSuccess } from "../commons/response";
import CategoryService from "../services/category.service";

class CategoryController {
    async createCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { title } = req.body;
            const category = await CategoryService.createCategory({ title });
            return res.json(new ResponseSuccess(200, "Category created successfully", true, category));
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, "Internal Server Error", false));
        }
    }

    async getAllCategories(req: Request, res: Response): Promise<Response> {
        try {
            const categories = await CategoryService.getAllCategories();
            return res.json(new ResponseSuccess(200, "Categories retrieved successfully", true, categories));
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, "Internal Server Error", false));
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId: number = parseInt(req.params.id);
            const category = await CategoryService.getCategoryById(categoryId);
            if (category) {
                return res.json(new ResponseSuccess(200, "Category retrieved successfully", true, category));
            } else {
                return res.status(404).json(new ResponseError(404, "Category not found", false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, "Internal Server Error", false));
        }
    }

    async editCategory(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId: number = parseInt(req.params.id);
            const { title } = req.body;

            const updatedCategory = await CategoryService.editCategory(categoryId, { title });

            if (updatedCategory) {
                return res.json(new ResponseSuccess(200, "Category updated successfully", true, updatedCategory));
            } else {
                return res.status(404).json(new ResponseError(404, "Category not found", false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, "Internal Server Error", false));
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId: number = parseInt(req.params.id);

            const deletedCategory = await CategoryService.deleteCategory(categoryId);

            if (deletedCategory) {
                return res.json(new ResponseSuccess(200, "Category deleted successfully", true));
            } else {
                return res.status(404).json(new ResponseError(404, "Category not found", false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, "Internal Server Error", false));
        }
    }
}

export default CategoryController;
