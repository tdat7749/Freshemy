import AuthController from "./auth.controller";
import UserController from "./user.controller";
import CourseController from "./course.controller";

const controllers = {
    authController: new AuthController(),
    userController: new UserController(),
    courseController: new CourseController(),
};
export default controllers;
