import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadFile } from "../middlewares/multer";

const courseRouter: Router = Router();

courseRouter.put("/change-information",isLogin, controllers.courseController.editCourse);
courseRouter.post("/", isLogin, uploadFile, controllers.courseController.createCourse);
courseRouter.patch("/change-thumbnail",isLogin,uploadFile, controllers.courseController.editThumbnail);
export default courseRouter;
