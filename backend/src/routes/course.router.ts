import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const courseRouter: Router = Router();

courseRouter.get("/:slug", controllers.courseController.getCourseDetail);
courseRouter.post("/registration",isLogin,controllers.courseController.registerCourse)
courseRouter.delete("/unsubcribe",isLogin,controllers.courseController.unsubcribeCourse)


export default courseRouter;