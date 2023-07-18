import { Router } from "express";
import { isLogin } from "../middlewares/isLogin";
import controllers from "../controllers/index";
import { uploadFile } from "../middlewares/multer";

const courseRouter: Router = Router();

courseRouter.post("/", isLogin, uploadFile, controllers.courseController.createCourse);

export default courseRouter;
