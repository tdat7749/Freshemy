import AuthController from "./auth.controller";

import UserController from "./user.controller";

import CategoryController from "./category.controller";
import CourseController from "./course.controller";

const controllers = {
    authController: new AuthController(),
    userController: new UserController(),
    categoryController: new CategoryController(),
    courseController: new CourseController(),
};
export default controllers;
