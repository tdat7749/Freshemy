import { FC, useRef } from "react";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage, Field } from "formik";
import { Login as LoginType } from "../types/auth";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { authActions } from "../redux/slice/index";
import { Navigate } from "react-router-dom";
import Skeleton from "../assets/images/Skeleton.png";

const Login: FC = () => {
    const dispatch = useAppDispatch();

    const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    const error = useAppSelector((state) => state.authSlice.error) || "1";

    const formikRef = useRef(null);

    if (isLogin) return <Navigate to={"/"} />;

    const initialValue: LoginType = {
        email: "",
        password: "",
    };

    const loginValidationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const handleOnSubmit = (values: LoginType) => {
        //@ts-ignore
        dispatch(authActions.login(values));
    };

    return (
        <>
            <div className="px-[16px] tablet:px-[60px] flex items-center justify-center tablet:justify-center tablet:space-x-[120px] h-[calc(100vh-100px)]">
                <div className="w-[360px] tablet:max-w-[505px] tablet:h-[578px] rounded-[12px] bg-bgForm mx-auto tablet:mx-0 flex-1">
                    <div className="w-full p-[16px]">
                        <h1 className="text-[32px] tablet:text-[40px] font-semibold text-center text-text my-[10px]">
                            LOGIN TO FRESHEMY
                        </h1>

                        <Formik
                            initialValues={initialValue}
                            validationSchema={loginValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <form onSubmit={formik.handleSubmit} className="space-y-[20px]">
                                    <div className="">
                                        <label htmlFor="email" className="text-[24px] text-text">
                                            Email
                                        </label>
                                        <Field
                                            type="text"
                                            name="email"
                                            className={`${
                                                formik.errors.email && formik.touched.email ? "border-error" : ""
                                            } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <div className="">
                                        <label htmlFor="password" className="text-[24px] text-text">
                                            Password
                                        </label>
                                        <Field
                                            type="password"
                                            name="password"
                                            className={`${
                                                formik.errors.password && formik.touched.password ? "border-error" : ""
                                            } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                        {error !== "" && (
                                            <span className="text-[14px] text-error font-medium">{error}</span>
                                        )}
                                    </div>
                                    <div className="py-[12px]">
                                        <button
                                            type="submit"
                                            className="bg-switch hover:opacity-80 text-white h-[68px] py-[8px] font-medium text-[32px] rounded-[16px] w-full"
                                        >
                                            Login
                                        </button>
                                    </div>
                                    <div className="text-center space-y-[8px]">
                                        <p className="text-text font-normal text-[20px] tablet:text-[22px]">
                                            Don't have an account?{" "}
                                            <span className="underline">
                                                <Link to={"/register"}>Signup</Link>
                                            </span>
                                        </p>
                                        <p className="text-text font-normal text-[20px] tablet:text-[22px]">
                                            <Link to={"/forgot-password"}>Forgot Password?</Link>
                                        </p>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="hidden tablet:block">
                    <img src={Skeleton} />
                </div>
            </div>
        </>
    );
};

export default Login;
