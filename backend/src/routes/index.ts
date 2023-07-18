import authRouter from "./auth.router";
import userRouter from "./user.router";
import sectionRouter from "./section.router"
import courseRouter from "./course.router";
const routers = {
    authRouter: authRouter,
    userRouter: userRouter,
    courseRouter: courseRouter,
    sectionRouter: sectionRouter
};
export default routers;
