import authRouter from "./auth.router";
import userRouter from "./user.router";
import courseRouter from './course.router'

const routers = {
    authRouter: authRouter,
    userRouter: userRouter,
    courseRouter: courseRouter
};
export default routers;
