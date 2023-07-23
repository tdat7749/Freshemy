import React, { useEffect, useRef } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { ChangePassword as ChangePasswordType } from "../types/user";
import { useAppDispatch } from "../hooks/hooks";
import { userActions } from "../redux/slice";
import { useAppSelector } from "../hooks/hooks";
import { Link } from "react-router-dom";
import { setMessageEmpty } from "../redux/slice/user.slice";
import { changePasswordValidationSchema } from "../validations/user";
import toast from 'react-hot-toast';
const ChangePassword: React.FC = () => {
    let error = useAppSelector((state) => state.userSlice.error) ?? "";

    const dispatch = useAppDispatch();

    const formikRef = useRef(null);

    const initialValue: ChangePasswordType = {
        current_password: "",
        new_password: "",
        confirm_password: "",
    };

    useEffect(() => {
        dispatch(setMessageEmpty());
    }, [dispatch]);

    const handleOnSubmit = (values: ChangePasswordType) => {
        //@ts-ignore
        dispatch(userActions.changePassword(values)).then((response)=>{
            if(response.payload.status_code!==200){
                toast.error(response.payload.message)
            }
            else{
                toast.success(response.payload.message)
            } 
        });
    };

    const handleChange = () => {
        error = "";
    };

    return (
        <div className="flex items-center justify-center h-screen mt-[100px] ">
            <div className=" drop-shadow-xl bg-primary border-black border-[1px] max-w-[360px] tablet:max-w-[505px] max-h-[630px] tablet:max-h-[700px] rounded-[12px] bg-bgForm mx-auto tablet:mx-0 flex-1">
                <div className="w-full p-[12px]">
                    <h1 className="text-[32px] tablet:text-[40px] font-semibold text-center my-[10px]">
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
                                    <label htmlFor="current_password" className=" label-text text-[24px]">
                                        Current Password
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="password"
                                        name="current_password"
                                        className={`' input input-bordered w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none ' ${
                                            formik.errors.current_password &&
                                            formik.touched.current_password &&
                                            "border-error input-error"
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
                                    <label htmlFor="new_password" className=" label-text text-[24px]">
                                        New Password
                                    </label>
                                    <br />
                                    <Field
                                        type="password"
                                        name="new_password"
                                        className={`' input input-bordered w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none ' ${
                                            formik.errors.new_password && formik.touched.new_password && "border-error input-error"
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="new_password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="ml-[20px] mr-[20px]">
                                    <label htmlFor="confirm_password" className=" label-text text-[24px] ">
                                        Confirm Password
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="password"
                                        name="confirm_password"
                                        className={`' input input-bordered w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none ' ${
                                            formik.errors.confirm_password &&
                                            formik.touched.confirm_password &&
                                            "border-error input-error"
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="confirm_password"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="py-[12px]  mt-[30px] tablte:mt-[60px]">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className=" btn btn-primary border-black border-[1px]  w-2/5 tablet:w-[100px] h-[70px] tablet:h-[68px]
                                         text-[24px] ml-[40px] tablet:ml-[250px] disabled:opacity-50 "
                                        disabled={error !== "" ? true : false}
                                    >
                                        Save
                                    </button>
                                    <Link to={"/"}>
                                        <button
                                            type="submit"
                                            className="btn bg-white border-black border-[1px] hover:opacity-80  w-2/5 tablet:w-[100px] h-[70px] tablet:h-[68px] text-[24px] ml-[10px]"
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
