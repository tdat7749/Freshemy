import express from "express";
import CategoryController from "../controllers/category.controller";

const router = express.Router();
const categoryController = new CategoryController();

router.get("/", categoryController.getAllCategories);

export default router;
