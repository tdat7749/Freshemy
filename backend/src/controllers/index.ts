import AuthController from "./auth.controller";
import UserController from "./user.controller";

const controllers = {
    authController: new AuthController(),
    userController: new UserController()
};
export default controllers;
