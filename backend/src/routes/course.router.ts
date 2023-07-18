import { Router } from "express";
import controllers from "../controllers/index";

const courseRouter: Router = Router();

courseRouter.put("/change-information", controllers.courseController.editCourse);

export default courseRouter;