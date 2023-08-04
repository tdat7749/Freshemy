import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const authRouter: Router = Router();

authRouter.patch("/password", isLogin, controllers.userController.changePassword);
authRouter.get("/me", isLogin, controllers.userController.getInformation);
authRouter.put("/information", isLogin, controllers.userController.changeUserInformation);
authRouter.get("/:id", controllers.userController.getAuthorInformation);
export default authRouter;
