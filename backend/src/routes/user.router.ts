import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const authRouter: Router = Router();

authRouter.patch("/change-password",isLogin, controllers.userController.changePassword);
authRouter.get("/me",isLogin, controllers.userController.getInformation);

export default authRouter;
