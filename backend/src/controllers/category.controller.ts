
import { Request, Response } from 'express';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../DTOS/category.dto';
import { ResponseError, ResponseSuccess } from '../commons/response';

import CategoryService from '../services/category.service';

export class CategoryController {
    private categoryService: typeof CategoryService;

    constructor() {
        this.categoryService = CategoryService;
    }

    public createCategory = async (req: Request, res: Response) => {
        try {
            const createCategoryDTO: CreateCategoryDTO = req.body;
            const category = await this.categoryService.createCategory(createCategoryDTO);
            res.json(new ResponseSuccess(200, 'Category created successfully', true, category));
        } catch (error: any) {
            res.status(500).json(new ResponseError(500, 'Internal Server Error', false));
        }
    }

    public getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.json(new ResponseSuccess(200, 'Categories retrieved successfully', true, categories));
        } catch (error: any) {
            res.status(500).json(new ResponseError(500, 'Internal Server Error', false));
        }
    }

    public getCategoryById = async (req: Request, res: Response) => {
        try {
            const categoryId: number = parseInt(req.params.id);
            const category = await this.categoryService.getCategoryById(categoryId);
            if (category) {
                res.json(new ResponseSuccess(200, 'Category retrieved successfully', true, category));
            } else {
                res.status(404).json(new ResponseError(404, 'Category not found', false));
            }
        } catch (error: any) {
            res.status(500).json(new ResponseError(500, 'Internal Server Error', false));
        }
    }

    public editCategory = async (req: Request, res: Response): Promise<Response> => {
        try {
            const categoryId: number = parseInt(req.params.id);
            const updateCategoryDTO: UpdateCategoryDTO = req.body;

            const updatedCategory = await this.categoryService.editCategory(categoryId, updateCategoryDTO);

            if (updatedCategory) {
                return res.json(new ResponseSuccess(200, 'Category updated successfully', true, updatedCategory));
            } else {
                return res.status(404).json(new ResponseError(404, 'Category not found', false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, 'Internal Server Error', false));
        }
    }

    public deleteCategory = async (req: Request, res: Response): Promise<Response> => {
        try {
            const categoryId: number = parseInt(req.params.id);

            const deletedCategory = await this.categoryService.deleteCategory(categoryId);

            if (deletedCategory) {
                return res.json(new ResponseSuccess(200, 'Category deleted successfully', true));
            } else {
                return res.status(404).json(new ResponseError(404, 'Category not found', false));
            }
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, 'Internal Server Error', false));
        }
    }


}

export default CategoryController;
