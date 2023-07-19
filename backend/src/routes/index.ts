import authRouter from "./auth.router";
import courseRouter from "./course.router";
import userRouter from "./user.router";
import lessonRouter from "./lesson.router";

const routers = {
    authRouter: authRouter,
    userRouter: userRouter,
    courseRouter: courseRouter,
    lessonRouter: lessonRouter,
};
export default routers;
