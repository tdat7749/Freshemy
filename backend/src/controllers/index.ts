import AuthController from "./auth.controller";
import UserController from "./user.controller";
import SectionController from "./section.controller";
import CategoryController from "./category.controller";
import CourseController from "./course.controller";
import LessonController from "./lesson.controller";
import FileStorageController from "./filestorate.controller";

const controllers = {
    authController: new AuthController(),
    userController: new UserController(),
    categoryController: new CategoryController(),
    courseController: new CourseController(),
    sectionController: new SectionController(),
    lessonController: new LessonController(),
    fileStorageController: new FileStorageController(),
};
export default controllers;
