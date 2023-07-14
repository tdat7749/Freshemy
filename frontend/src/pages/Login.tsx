import { FC, useRef } from "react";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage, Field, Form } from "formik";
import { Login as LoginType } from "../types/auth";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { authActions } from "../redux/slice/index";
import { Navigate } from "react-router-dom";
import Skeleton from "../assets/images/Skeleton.png";

const Login: FC = () => {
    const dispatch = useAppDispatch();

    const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    let error = useAppSelector((state) => state.authSlice.error) ?? "";

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

    const handleChange = () => {
        error = "";
    };

    return (
        <>
            <div className="h-screen flex items-center justify-center">
                <div className="bg-primary m-4 rounded-xl tablet:w-[506px]">
                    <Formik
                        initialValues={initialValue}
                        validationSchema={loginValidationSchema}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                    >
                        {(formik) => (
                            <Form className="p-4" onSubmit={formik.handleSubmit} onChange={handleChange}>
                                <h1 className="font-bold text-[32px] text-center">LOGIN TO FRESHEMY</h1>

                                <form className="flex flex-col mb-3">
                                    <label htmlFor="email" className="text-xl mb-1 tablet:text-2xl">
                                        Email
                                    </label>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="text"
                                        className={`px-2 py-[21px] rounded-lg border-[1px] outline-none ${
                                            formik.errors.email && formik.touched.email ? "border-error" : ""
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                    <label htmlFor="password" className="text-xl mb-1 tablet:text-2xl">
                                        Password
                                    </label>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        className={`px-2 py-[21px] rounded-lg border-[1px] outline-none ${
                                            formik.errors.password && formik.touched.password ? "border-error" : ""
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                    {error !== "" && (
                                        <span className="text-[14px] text-error font-medium">{error}</span>
                                    )}
                                </form>
                                <button
                                    className="w-full py-2 px-4 mr-1 bg-switch rounded-lg text-white text-[32px] hover:opacity-80"
                                    type="submit"
                                >
                                    Login
                                </button>
                                <p className="block mt-3 mb-2 text-center">
                                    Don't have an account?{" "}
                                    <span className="underline">
                                        <Link to={"/register"}>Signup</Link>
                                    </span>
                                </p>
                                <span className="block mt-3 mb-2 text-center">
                                    <Link to={"/forgot-password"}>Forgot Password?</Link>
                                </span>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="hidden tablet:block">
                    <img src={Skeleton} alt="Login img"/>
                </div>
            </div>
        </>
    );
};

export default Login;
