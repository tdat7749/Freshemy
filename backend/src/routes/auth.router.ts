import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const authRouter: Router = Router();

authRouter.post("/login", controllers.authController.login);
authRouter.get("/refresh", controllers.authController.refreshToken);
authRouter.get("/me", isLogin, controllers.authController.getMe);

export default authRouter;
