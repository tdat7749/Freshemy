import express from "express";
import CategoryController from "../controllers/category.controller";

const router = express.Router();
const categoryController = new CategoryController();

// router.post("/", categoryController.createCategory);
// router.put("/:id", categoryController.editCategory);
// router.delete("/:id", categoryController.deleteCategory);
router.get("/", categoryController.getAllCategories);
// router.get("/:id", categoryController.getCategoryById);

export default router;
