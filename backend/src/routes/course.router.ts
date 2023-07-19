import { Router } from "express";
import controllers from "../controllers/index";
import { uploadFileMdw } from "../middlewares/multer";
import { isLogin } from "../middlewares/isLogin";

const courseRouter: Router = Router();

courseRouter.put("/change-information", isLogin, controllers.courseController.editCourse);
courseRouter.get("/search-my-courses", isLogin, controllers.courseController.searchMyCourses);

courseRouter.delete("/:id", isLogin, controllers.courseController.deleteMyCourse);

courseRouter.post("/", isLogin, uploadFileMdw, controllers.courseController.createCourse);
courseRouter.patch("/change-thumbnail", isLogin, uploadFileMdw, controllers.courseController.editThumbnail);

export default courseRouter;
