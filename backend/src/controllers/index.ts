import AuthController from "./auth.controller";
import UserController from "./user.controller";
import CourseController from "./course.controller";
import LessonController from "./lesson.controller";

const controllers = {
    authController: new AuthController(),
    userController: new UserController(),
    courseController: new CourseController(),
    LessonController: new LessonController(),

};
export default controllers;
