import authRouter from "./auth.router";
import userRouter from "./user.router";
import sectionRouter from "./section.router"
import courseRouter from "./course.router";
import lessonRouter from "./lesson.router";
const routers = {
    authRouter: authRouter,
    userRouter: userRouter,
    courseRouter: courseRouter,
    sectionRouter: sectionRouter,
    lessonRouter: lessonRouter
}
export default routers;
