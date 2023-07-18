import express from "express";
import CategoryController from "../controllers/category.controller";

const router = express.Router();
const categoryController = new CategoryController();

router.post("/create-category", categoryController.createCategory);
router.get("/get-all-categories", categoryController.getAllCategories);
router.get("/get-category-by-id/:id", categoryController.getCategoryById);
router.put("/edit-category/:id", categoryController.editCategory);
router.delete("/delete-category/:id", categoryController.deleteCategory);

export default router;
