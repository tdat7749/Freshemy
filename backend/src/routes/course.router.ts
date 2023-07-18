import { Router } from "express";
import controllers from "../controllers/index";

const courseRouter: Router = Router();

courseRouter.get("/:slug", controllers.courseController.getCourseDetail);

export default courseRouter;