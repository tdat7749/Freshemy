import { Router } from "express";
import controllers from "../controllers/index";
import { uploadFileMdw } from "../middlewares/multer";
import { isLogin } from "../middlewares/isLogin";

const courseRouter: Router = Router();

courseRouter.put("/change-information", isLogin, controllers.courseController.editCourse);
courseRouter.post("/", isLogin, uploadFileMdw, controllers.courseController.createCourse);
courseRouter.post("/registration", isLogin, controllers.courseController.registerCourse);
courseRouter.delete("/unsubcribe", isLogin, controllers.courseController.unsubcribeCourse);
courseRouter.patch("/change-thumbnail", isLogin, uploadFileMdw, controllers.courseController.editThumbnail);

courseRouter.get("/search-my-courses", isLogin, controllers.courseController.searchMyCourses);

courseRouter.get("/:slug", controllers.courseController.getCourseDetail);
courseRouter.get("/detail/:id", isLogin, controllers.courseController.getCourseDetailById);
courseRouter.delete("/:id", isLogin, controllers.courseController.deleteMyCourse);

export default courseRouter;
