import { Router } from "express";
import controllers from "../controllers/index";

const lessonRouter: Router = Router();

lessonRouter.get("/:id", controllers.lessonController.getLesson);
lessonRouter.post("/", controllers.lessonController.createLesson);
lessonRouter.put("/:id", controllers.lessonController.updateLesson);
lessonRouter.delete("/:id", controllers.lessonController.deleteLesson);

export default lessonRouter;
