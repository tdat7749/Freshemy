import AuthController from "./auth.controller";
import UserController from "./user.controller";
import SectionController from "./section.controller";
const controllers = {
    authController: new AuthController(),
    userController: new UserController(),
    sectionController: new SectionController()
};
export default controllers;
