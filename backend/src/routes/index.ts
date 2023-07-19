import authRouter from "./auth.router";
import userRouter from "./user.router";
import categoryRouter from "./category.router"
import courseRouter from "./course.router"

const routers = {
    authRouter: authRouter,
    userRouter: userRouter,
    categoryRouter: categoryRouter,
    courseRouter: courseRouter
};
export default routers;
