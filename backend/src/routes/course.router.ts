import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadFile } from "../middlewares/multer";

const courseRouter: Router = Router();

courseRouter.post("/", isLogin, uploadFile, controllers.courseController.createCourse);
courseRouter.get("/:slug", controllers.courseController.getCourseDetail);
courseRouter.post("/registration",isLogin,controllers.courseController.registerCourse)
courseRouter.delete("/unsubcribe",isLogin,controllers.courseController.unsubcribeCourse)

export default courseRouter;
