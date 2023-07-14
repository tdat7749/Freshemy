import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const authRouter: Router = Router();

authRouter.post("/login", controllers.authController.login);
authRouter.get("/refresh", controllers.authController.refreshToken);
authRouter.get("/me", isLogin, controllers.authController.getMe);
authRouter.post("/forgot-password", controllers.authController.forgotPassword);
authRouter.post("/reset-password", controllers.authController.resetPassword);

authRouter.post("/register", controllers.authController.register);
authRouter.get("/generate-token", controllers.authController.generateTokenHandler);

export default authRouter;
