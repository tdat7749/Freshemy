import React, { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { authActions } from "../redux/slice";
import { ForgotPassword as ForgotPasswordType } from "../types/auth";
import { setMessageEmpty } from "../redux/slice/auth.slice";
import { forgotPasswordValidationSchema } from "../validations/auth";
import { Navigate } from "react-router-dom";
import toast from 'react-hot-toast';
const ForgotPassword: React.FC = () => {
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    
    let message = useAppSelector((state) => state.authSlice.message) ?? "";

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setMessageEmpty());
    }, [dispatch]);

    if (isLogin) return <Navigate to={"/"} />;

    const initialValues: ForgotPasswordType = {
        email: "",
    };

    const handleSubmit = (values: ForgotPasswordType) => {
        //@ts-ignore
        dispatch(authActions.forgotPassword(values)).then((response) => {
            if (response.payload.status_code === 200) {
                //@ts-ignore
                toast.success(response.payload.message)
            } else {
                toast.error(response.payload.message)
            }
        })
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="min-h-screen h-full  flex items-center justify-center mt-[100px]">
                    <div className="bg-primary m-4 rounded-xl shadow-lg">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validationSchema={forgotPasswordValidationSchema}
                        >
                            {(formik) => (
                                <Form className="p-4" onSubmit={formik.handleSubmit}>
                                    <h1 className="font-bold text-[32px] text-center text-title">FORGOT PASSWORD</h1>
                                    {message !== "" ? (
                                        <div className="my-4 px-4 py-3 bg-[#8BC34A] rounded text-center">
                                            <p className="font-bold text-xl">
                                                Check your email for further instructions
                                            </p>
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    <form className="flex flex-col mb-3">
                                        <label htmlFor="email" className="text-sm mb-1 tablet:text-xl">
                                            Email
                                        </label>
                                        <Field
                                            id="email"
                                            name="email"
                                            type="text"
                                            className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                formik.errors.email && formik.touched.email ? "border-error" : ""
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </form>
                                    <button
                                        className="btn btn-primary w-full text-lg"
                                        type="submit"
                                    >
                                        Reset password
                                    </button>
                                    <span className="block mt-3 mb-2 text-center font-medium text-lg hover:opacity-80">
                                        <Link to={"/login"}>Login</Link>
                                    </span>
                                    <div className="text-center text-lg hover:opacity-80">
                                        Don't have an account?
                                        <Link to={"/register"}>
                                            <span  className="font-medium"> Signup</span>
                                        </Link>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
