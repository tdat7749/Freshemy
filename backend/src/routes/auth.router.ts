import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const authRouter: Router = Router();

authRouter.post("/login", controllers.authController.login);
authRouter.get("/refresh", controllers.authController.refreshToken);
authRouter.get("/me", isLogin, controllers.authController.getMe);
authRouter.post("/forgot", controllers.authController.forgotPassword);
authRouter.post("/reset", controllers.authController.resetPassword);
authRouter.get("/verify/:token", controllers.authController.verifyEmailWhenSignUp);

authRouter.post("/signup", controllers.authController.register);

export default authRouter;
