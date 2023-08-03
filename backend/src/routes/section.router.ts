import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { isAuthor } from "../middlewares/isAuthor";

const sectionRouter: Router = Router();

sectionRouter.post("/", isLogin, isAuthor, controllers.sectionController.createSection);
sectionRouter.put("/:id", isLogin, controllers.sectionController.updateSection);
sectionRouter.delete("/:id", isLogin, controllers.sectionController.deleteSection);
export default sectionRouter;
