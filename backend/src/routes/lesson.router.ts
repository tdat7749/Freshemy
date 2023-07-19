import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadFile } from "../middlewares/multer";

const lessonRouter: Router = Router();

lessonRouter.post("/", controllers.LessonController.createLesson);

export default lessonRouter;