import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadVideoMdw } from "../middlewares/multer";

const lessonRouter: Router = Router();

lessonRouter.get("/:id", controllers.lessonController.getLesson);
lessonRouter.put("/reOrderLesson", isLogin, controllers.lessonController.reOrderLesson);
lessonRouter.post("/", isLogin, uploadVideoMdw, controllers.lessonController.createLesson);
lessonRouter.put("/:id", isLogin, uploadVideoMdw, controllers.lessonController.updateLesson);
lessonRouter.delete("/:id/:course_id", isLogin, controllers.lessonController.deleteLesson);

export default lessonRouter;
