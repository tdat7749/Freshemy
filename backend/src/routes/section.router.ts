import { Router } from "express";
import controllers from "../controllers/index";

const sectionRouter: Router = Router();

sectionRouter.get("/:id", controllers.sectionController.getSection);
sectionRouter.post("/", controllers.sectionController.createSection);
sectionRouter.put("/:id", controllers.sectionController.updateSection);
sectionRouter.delete("/:id", controllers.sectionController.deleteSection);
export default sectionRouter;
