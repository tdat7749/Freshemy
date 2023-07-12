import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

interface FormValues {
    password: string;
    confirmPassword: string;
}

const ResetPassword: React.FC<{}> = () => {
    const initialValues: FormValues = {
        password: "",
        confirmPassword: "",
    };

    const resetPasswordValidationSchema = Yup.object({
        password: Yup.string().required("Password is required").min(6, "Weak password"),
        confirmPassword: Yup.string()
            .required("Confirm password is required")
            .oneOf([Yup.ref("password")], "Confirm password must match"),
    });

    const handleSubmit = (values: FormValues) => {
        // CALL API HERE...
    };

    return (
        <>
            <Header isLogin={false} />
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={resetPasswordValidationSchema}
            >
                {(formik) => (
                    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
                        <div className="bg-primary m-4 rounded-xl tablet:w-[506px]">
                            <Form className="p-4" onSubmit={formik.handleSubmit}>
                                <h1 className="font-bold text-[32px] text-center">RESET PASSWORD</h1>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="password" className="text-2xl mb-1">
                                        Password
                                    </label>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="px-2 py-[21px] rounded-lg border-[1px]"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="flex flex-col mb-3">
                                    <label htmlFor="confirmPassword" className="text-2xl mb-1">
                                        Confirm Password
                                    </label>
                                    <Field
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        className="px-2 py-[21px] rounded-lg border-[1px]"
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 mr-1 bg-switch rounded-lg text-white text-[32px] hover:opacity-80"
                                >
                                    Submit
                                </button>
                            </Form>
                        </div>
                    </div>
                )}
            </Formik>
            <Footer />
        </>
    );
};

export default ResetPassword;
