import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { authActions } from "../redux/slice";
import { useNavigate, useParams } from "react-router-dom";
import { ResetPassword as ResetPasswordType } from "../types/auth";
import { resetPasswordValidationSchema } from "../validations/auth";
import toast from "react-hot-toast";

const ResetPassword: React.FC<{}> = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useParams();
    
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    if (isLogin) navigate("/");
    
    // Check token is undefined and navigate to homepage
    if (token === undefined) {
        navigate("/");
    }


    const initialValues: ResetPasswordType = {
        password: "",
        confirmPassword: "",
        token: "",
    };

    const handleSubmit = (values: ResetPasswordType) => {
        const data = {
            ...values,
            token: token,
        };
        //@ts-ignore
        dispatch(authActions.resetPassword(data)).then((response) => {
            if (response.payload.status_code === 200) {
                //@ts-ignore
                toast.success(response.payload.message);
                navigate("/login");
            } else {
                toast.error(response.payload.message);
            }
        });
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="min-h-screen h-full  flex items-center justify-center mt-[100px]">
                    <div className="bg-primary m-4 rounded-xl shadow-lg">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validationSchema={resetPasswordValidationSchema}
                        >
                            {(formik) => (
                                <Form className="p-4" onSubmit={formik.handleSubmit}>
                                    <h1 className="font-bold text-[32px] text-center text-title">RESET PASSWORD</h1>
                                    <div className="flex flex-col mb-3">
                                        <label htmlFor="password" className="text-sm mb-1 tablet:text-xl">
                                            Password
                                        </label>
                                        <Field
                                            id="password"
                                            name="password"
                                            type="password"
                                            className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-lg ${
                                                formik.errors.password && formik.touched.password ? "border-error" : ""
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <div className="flex flex-col mb-3">
                                        <label htmlFor="confirmPassword" className="text-sm mb-1 tablet:text-xl">
                                            Confirm Password
                                        </label>
                                        <Field
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-lg ${
                                                formik.errors.confirmPassword && formik.touched.confirmPassword
                                                    ? "border-error"
                                                    : ""
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="confirmPassword"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-full text-lg">
                                        Submit
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
