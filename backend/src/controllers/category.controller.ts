import { Request, Response } from "express";
import { ResponseError, ResponseSuccess } from "../commons/response";
import CategoryService from "../services/category.service";

import i18n from "../utils/i18next";

class CategoryController {
    async getAllCategories(req: Request, res: Response): Promise<Response> {
        try {
            const response = await CategoryService.getAllCategories();

            return res
                .status(response.getStatusCode())
                .json(new ResponseSuccess(200, i18n.t("successMessages.retrievedCategorySuccess"), true, response));
        } catch (error: any) {
            return res.status(500).json(new ResponseError(500, i18n.t("errorMessages.internalServer"), false));
        }
    }
}

export default CategoryController;
