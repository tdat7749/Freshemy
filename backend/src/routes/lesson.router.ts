import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadFile } from "../middlewares/multer";



const lessonRouter: Router = Router();

lessonRouter.get("/:id", controllers.lessonController.getLesson);
lessonRouter.post("/",isLogin, controllers.lessonController.createLesson);
lessonRouter.put("/:id",isLogin, controllers.lessonController.updateLesson);
lessonRouter.delete("/:id",isLogin, controllers.lessonController.deleteLesson);

export default lessonRouter;
