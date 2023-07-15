import React, { FC, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage, Field } from "formik";
import { Register as RegisterType } from "../types/auth";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { authActions } from "../redux/slice/index";
import { Navigate } from "react-router-dom";
import Skeleton from "../assets/images/Skeleton.png";
import { setMessageEmpty } from "../redux/slice/auth.slice";

const Register: FC = () => {
    const dispatch = useAppDispatch();

    const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    let errorMessage = useAppSelector(state => state.authSlice.error)
    let successMessage = useAppSelector(state => state.authSlice.message)


    const formikRef = useRef(null);

    useEffect(() => {
        dispatch(setMessageEmpty())
    }, [dispatch])

    if (isLogin) return <Navigate to={"/"} />;

    const initialValues: RegisterType = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
    };

    const registerValidationSchema = Yup.object({
        first_name: Yup.string().required("First Name is required"),
        last_name: Yup.string().required("Last Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required").min(8, "Weak password").max(32, "Password is too long"),
        confirm_password: Yup.string()
            .required("Confirm password is required")
            .oneOf([Yup.ref("password")], "Wrong confirm password"),
    });

    const handleOnSubmit = async (values: RegisterType) => {
        //@ts-ignore
        dispatch(authActions.register(values));
    };

    const handleDeleteMessage = () => {
        errorMessage = ""
        successMessage = ""
    }



    return (
        <>
            <div className="mt-[150px] h-screen flex items-center justify-center">
                <div className="bg-primary m-4 rounded-xl tablet:w-[506px]">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={registerValidationSchema}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit} className="p-4" onChange={handleDeleteMessage}>
                                <h1 className="font-bold text-[32px] text-center">SIGN UP</h1>

                                <div className="flex gap-[30px] shrink-0s">
                                    <div className="flex-1">
                                        <label htmlFor="first_name" className="text-[24px] text-text">
                                            First Name
                                        </label>
                                        <Field
                                            type="text"
                                            name="first_name"
                                            className={`${formik.errors.first_name && formik.touched.first_name
                                                ? "border-error"
                                                : ""
                                                } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                        />
                                        <ErrorMessage
                                            name="first_name"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="last_name" className="text-[24px] text-text">
                                            Last Name
                                        </label>
                                        <Field
                                            type="text"
                                            name="last_name"
                                            className={`${formik.errors.last_name && formik.touched.last_name
                                                ? "border-error"
                                                : ""
                                                } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                        />
                                        <ErrorMessage
                                            name="last_name"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <label htmlFor="email" className="text-[24px] text-xl mb-1 tablet:text-2xl">
                                        Email
                                    </label>
                                    <Field
                                        type="text"
                                        name="email"
                                        className={`${formik.errors.email && formik.touched.email ? "border-error" : ""
                                            } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="">
                                    <label htmlFor="password" className="text-xl mb-1 tablet:text-2xl">
                                        Password
                                    </label>
                                    <Field
                                        type="password"
                                        name="password"
                                        className={`${formik.errors.password && formik.touched.password ? "border-error" : ""
                                            } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="">
                                    <label htmlFor="confirm_password" className="text-xl mb-1 tablet:text-2xl">
                                        Confirm Password
                                    </label>
                                    <Field
                                        type="password"
                                        name="confirm_password"
                                        className={`${formik.errors.confirm_password && formik.touched.confirm_password
                                            ? "border-error"
                                            : ""
                                            } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                    />
                                    <ErrorMessage
                                        name="confirm_password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                    {errorMessage !== "" && (<span className="text-[14px] text-error font-medium">{errorMessage}</span>)}
                                    {successMessage !== "" && (<span className="text-[14px] text-success font-medium">{successMessage}</span>)}
                                </div>
                                <div className="py-[12px]">
                                    <button
                                        type="submit"
                                        className="bg-switch hover:opacity-80 text-white h-[68px] py-[8px] font-medium text-[32px] rounded-lg w-full"
                                    >
                                        Create Account
                                    </button>
                                </div>
                                <div className="text-center space-y-[8px]">
                                    <p className="text-text font-normal text-[20px] tablet:text-[22px]">
                                        Already have an account?
                                        <span className="underline">
                                            <Link to={"/login"}> Login</Link>
                                        </span>
                                    </p>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
                <div className="hidden laptop:block">
                    <img src={Skeleton} />
                </div>
            </div>
        </>
    );
};

export default Register;
