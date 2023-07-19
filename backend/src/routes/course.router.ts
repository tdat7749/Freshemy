import { Router } from "express";
import controllers from "../controllers/index";
import { uploadFile } from "../middlewares/multer";
import { isLogin } from "../middlewares/isLogin";

const courseRouter: Router = Router();

courseRouter.put("/change-information",isLogin, controllers.courseController.editCourse);
courseRouter.get("/search-my-courses", isLogin, controllers.courseController.searchMyCourses);

courseRouter.delete("/:id", isLogin, controllers.courseController.deleteMyCourse);

courseRouter.post("/", isLogin, uploadFile, controllers.courseController.createCourse);
courseRouter.patch("/change-thumbnail",isLogin,uploadFile, controllers.courseController.editThumbnail);
export default courseRouter;
