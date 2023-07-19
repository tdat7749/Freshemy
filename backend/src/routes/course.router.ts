import { Router } from "express";
import controllers from "../controllers/index";
import { uploadFileMdw } from "../middlewares/multer";
import { isLogin } from "../middlewares/isLogin";

const courseRouter: Router = Router();

courseRouter.put("/change-information", isLogin, controllers.courseController.editCourse);
courseRouter.post("/", isLogin, uploadFileMdw, controllers.courseController.createCourse);
courseRouter.post("/registration", isLogin, controllers.courseController.registerCourse);
courseRouter.delete("/unsubcribe", isLogin, controllers.courseController.unsubcribeCourse);
courseRouter.post("/", isLogin, uploadFileMdw, controllers.courseController.createCourse);
courseRouter.patch("/change-thumbnail", isLogin, uploadFileMdw, controllers.courseController.editThumbnail);

courseRouter.put("/change-information", isLogin, controllers.courseController.editCourse);
courseRouter.get("/search-my-courses", isLogin, controllers.courseController.searchMyCourses);
courseRouter.get("/:slug", controllers.courseController.getCourseDetail);
courseRouter.delete("/:id", isLogin, controllers.courseController.deleteMyCourse);

export default courseRouter;
