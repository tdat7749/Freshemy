import React, { useEffect, useRef } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { ChangePassword as ChangePasswordType } from "../types/user";
import * as Yup from "yup";
import { useAppDispatch } from "../hooks/hooks";
import { userActions } from "../redux/slice";
import { useAppSelector } from "../hooks/hooks";
import { Link } from "react-router-dom";
import { setError, setMessage } from "../redux/slice/user.slice";
const ChangePassword: React.FC = () => {
    let message = useAppSelector((state) => state.userSlice.message) ?? "";
    let error = useAppSelector((state) => state.userSlice.error) ?? "";

    const dispatch = useAppDispatch();

    const formikRef = useRef(null);

    const initialValue: ChangePasswordType = {
        current_password: "",
        new_password: "",
        confirm_password: "",
    };

    useEffect(() =>{
        dispatch(setError(""))
        dispatch(setMessage(""))
    },[dispatch])

    const changePasswordValidationSchema = Yup.object({
        current_password: Yup.string().required("Current Password is required"),
        new_password: Yup.string().min(8, "Weak password").max(32, "Too long").required("New password is required"),
        confirm_password: Yup.string()
            .min(8, "Weak password")
            .max(32, "Too long")
            .required("Confirm password is required")
            .oneOf([Yup.ref("new_password")], "Confirm password must be the same with new password"),
    });

    const handleOnSubmit = (values: ChangePasswordType) => {
        //@ts-ignore
        dispatch(userActions.changePassword(values));
    };
    
    const handleChange = () => {
        error = "";
        message = "";
    };

    return (
        <div className="flex items-center justify-center h-screen mt-[80px] ">
            <div className="  max-w-[360px] tablet:max-w-[505px] max-h-[630px] tablet:max-h-[700px] rounded-[12px] bg-bgForm mx-auto tablet:mx-0 flex-1">
                <div className="w-full p-[12px]">
                    <h1 className="text-[32px] tablet:text-[40px] font-semibold text-center text-text my-[10px]">
                        CHANGE PASSWORD
                    </h1>

                    <Formik
                        initialValues={initialValue}
                        validationSchema={changePasswordValidationSchema}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                    >
                        {(formik) => (
                            <form
                                onSubmit={formik.handleSubmit}
                                className="w-full space-y-[5px] tablet:space-y-[20px]"
                                onChange={handleChange}
                            >
                                <div className="ml-[20px] mr-[20px]">
                                    <label htmlFor="current_password" className="text-[24px] text-text">
                                        Current Password
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="password"
                                        name="current_password"
                                        className={`' w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none ' ${
                                            formik.errors.current_password &&
                                            formik.touched.current_password &&
                                            "border-error"
                                        } `}
                                    />
                                    <br />
                                    <ErrorMessage
                                        name="current_password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="ml-[20px] mr-[20px]">
                                    <label htmlFor="new_password" className="text-[24px] text-text">
                                        New Password
                                    </label>
                                    <br />
                                    <Field
                                        type="password"
                                        name="new_password"
                                        className={`' w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none ' ${
                                            formik.errors.new_password && formik.touched.new_password && "border-error"
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="new_password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="ml-[20px] mr-[20px]">
                                    <label htmlFor="confirm_password" className="text-[24px] text-text">
                                        Confirm Password
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="password"
                                        name="confirm_password"
                                        className={`' w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none ' ${
                                            formik.errors.confirm_password &&
                                            formik.touched.confirm_password &&
                                            "border-error"
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="confirm_password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                {error !== "" && (
                                    <span className=" ml-[95px] tablet:ml-[170px] text-[20px] text-error font-medium ">
                                        {error}
                                    </span>
                                )}
                                {message !== "" && (
                                    <span className=" ml-[30px] tablet:ml-[100px] text-[20px] text-green-500 font-medium">
                                        {message}
                                    </span>
                                )}
                                <div className="py-[12px]  mt-[30px] tablte:mt-[60px]">
                                    <button
                                        type="submit"
                                        className="bg-switch hover:opacity-80 text-white border-black border-[2px]  w-2/5 tablet:w-[100px] h-[70px] tablet:h-[68px] py-[8px] font-medium text-[24px] rounded-[12px] ml-[40px] tablet:ml-[250px] "
                                    >
                                        Save
                                    </button>
                                    <Link to={"/"}>
                                        <button
                                            type="submit"
                                            className="bg-white hover:opacity-80 text-black border-black border-[2px] w-2/5 tablet:w-[100px] h-[70px] tablet:h-[68px] py-[8px] font-medium text-[24px] rounded-[12px] ml-[10px]"
                                        >
                                            Cancel
                                        </button>
                                    </Link>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
