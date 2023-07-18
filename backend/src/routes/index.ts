import authRouter from "./auth.router";
import courseRouter from "./course.router";
import userRouter from "./user.router";

const routers = {
    authRouter: authRouter,
    userRouter: userRouter,
    courseRouter: courseRouter,
};
export default routers;
