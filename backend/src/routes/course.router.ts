import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadFile } from "../middlewares/multer";

const courseRouter: Router = Router();

courseRouter.post("/", isLogin, uploadFile, controllers.courseController.createCourse);
courseRouter.post("/registration",isLogin,controllers.courseController.registerCourse)
courseRouter.delete("/unsubcribe",isLogin,controllers.courseController.unsubcribeCourse)
courseRouter.put("/change-information",isLogin, controllers.courseController.editCourse);
courseRouter.get("/search-my-courses", isLogin, controllers.courseController.searchMyCourses);
courseRouter.delete("/:id", isLogin, controllers.courseController.deleteMyCourse);
courseRouter.post("/", isLogin, uploadFile, controllers.courseController.createCourse);
courseRouter.patch("/change-thumbnail",isLogin,uploadFile, controllers.courseController.editThumbnail);
courseRouter.get("/:slug", controllers.courseController.getCourseDetail);
export default courseRouter;
