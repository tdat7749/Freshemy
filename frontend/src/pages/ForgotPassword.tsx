import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { authActions } from "../redux/slice";
import { ForgotPassword as ForgotPasswordType } from "../types/auth";

const ForgotPassword: React.FC = () => {
    const [isDisplayNoti, setIsDisplayNoti] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const initialValues: ForgotPasswordType = {
        email: "",
    };

    const forgotPasswordValidationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
    });

    const handleSubmit = (values: ForgotPasswordType) => {
        setIsDisplayNoti(true);
        //@ts-ignore
        dispatch(authActions.forgotPassword(values));
    };

    return (
        <>
            <Header isLogin={false} />
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={forgotPasswordValidationSchema}
            >
                {(formik) => (
                    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
                        <div className="bg-primary m-4 rounded-xl tablet:w-[506px]">
                            <Form className="p-4" onSubmit={formik.handleSubmit}>
                                <h1 className="font-bold text-[32px] text-center">FORGOT PASSWORD</h1>
                                {isDisplayNoti ? (
                                    <div className="my-4 px-4 py-3 bg-[#8BC34A] rounded text-center">
                                        <p className="font-bold text-xl">Check your email for further instructions</p>
                                    </div>
                                ) : (
                                    <></>
                                )}

                                <div className="flex flex-col mb-3">
                                    <label htmlFor="email" className="text-2xl mb-1">
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
                                </div>
                                <button
                                    className="w-full py-2 px-4 mr-1 bg-switch rounded-lg text-white text-[32px] hover:opacity-80"
                                    type="submit"
                                >
                                    Reset password
                                </button>
                                <span className="block mt-3 mb-2 text-center">
                                    <Link to={"/login"}>Login</Link>
                                </span>
                                <div className="text-center">
                                    Don't have an account?
                                    <Link to={"/signup"}>
                                        <span> Signup</span>
                                    </Link>
                                </div>
                            </Form>
                        </div>
                    </div>
                )}
            </Formik>
            <Footer />
        </>
    );
};

export default ForgotPassword;
