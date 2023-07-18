import AuthController from "./auth.controller";
import CategoryController from "./category.controller";
import UserController from "./user.controller";
import CourseController from "./course.controller";
import ImagesController from "./image.controller";

const controllers = {
    authController: new AuthController(),
    userController: new UserController(),
    categoryController: new CategoryController(),
    courseController: new CourseController(),
    imageController: new ImagesController()
};
export default controllers;
