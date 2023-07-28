import { Request, Response } from "express";
import { ResponseError, ResponseSuccess } from "../commons/response";
import CategoryService from "../services/category.service";

import i18n from "../utils/i18next";

class CategoryController {
    // async createCategory(req: Request, res: Response): Promise<Response> {
    //     try {
    //         const { title } = req.body;
    //         const category = await CategoryService.createCategory({ title });
    //         return res.json(new ResponseSuccess(200, i18n.t("successMessages.createCategorySuccess"), true, category));
    //     } catch (error: any) {
    //         return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
    //     }
    // }

    async getAllCategories(req: Request, res: Response): Promise<Response> {
        try {
            const response = await CategoryService.getAllCategories();

            return res
                .status(response.getStatusCode())
                .json(new ResponseSuccess(200, i18n.t("successMessages.retrievedCategorySuccess"), true, response));
            // return res.status(response.getStatusCode()).json(new ResponseSuccess(200, MESSAGE_SUCCESS_RETRIEVED_CATEGORY, true, response));
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
        }
    }

    // async getCategoryById(req: Request, res: Response): Promise<Response> {
    //     try {
    //         const categoryId: number = parseInt(req.params.id);
    //         const category = await CategoryService.getCategoryById(categoryId);
    //         if (category) {
    //             return res.json(
    //                 new ResponseSuccess(200, i18n.t("successMessages.retrievedCategorySuccess"), true, category),
    //             );
    //         } else {
    //             return res.status(404).json(new ResponseError(404, i18n.t("errorMessages.categoryNotFound"), false));
    //         }
    //     } catch (error: any) {
    //         return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
    //     }
    // }

    // async editCategory(req: Request, res: Response): Promise<Response> {
    //     try {
    //         const categoryId: number = parseInt(req.params.id);
    //         const { title } = req.body;

    //         const updatedCategory = await CategoryService.editCategory(categoryId, { title });

    //         if (updatedCategory) {
    //             return res.json(
    //                 new ResponseSuccess(200, i18n.t("successMessages.updatedCategorySuccess"), true, updatedCategory),
    //             );
    //         } else {
    //             return res.status(404).json(new ResponseError(404, i18n.t("errorMessages.categoryNotFound"), false));
    //         }
    //     } catch (error: any) {
    //         return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
    //     }
    // }

    // async deleteCategory(req: Request, res: Response): Promise<Response> {
    //     try {
    //         const categoryId: number = parseInt(req.params.id);

    //         const deletedCategory = await CategoryService.deleteCategory(categoryId);

    //         if (deletedCategory) {
    //             return res.json(new ResponseSuccess(200, i18n.t("successMessages.deletedCategorySuccess"), true));
    //         } else {
    //             return res.status(404).json(new ResponseError(404, i18n.t("errorMessages.categoryNotFound"), false));
    //         }
    //     } catch (error: any) {
    //         return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
    //     }
    // }
}

export default CategoryController;
