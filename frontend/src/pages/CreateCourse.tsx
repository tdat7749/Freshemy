import React, { FC, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
import { Formik, ErrorMessage, Field } from "formik";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { authActions } from "../redux/slice/index";
// import { Navigate } from "react-router-dom";
import { setMessageEmpty } from "../redux/slice/auth.slice";
import { CreateCourse as CreateCourseType } from "../types/course";
import { createValidationSchema } from "../validations/course";

const CreateCourse: FC = () => {
    const dispatch = useAppDispatch();

    // const isLogin = useAppSelector((state) => state.Slice.isLogin);
    let errorMessage = useAppSelector((state) => state.courseSlice.error);
    let successMessage = useAppSelector((state) => state.courseSlice.message);

    const formikRef = useRef(null);
    const tempCategory: string[] = ["categories", "NodeJs", "ReactJs"];
    useEffect(() => {
        dispatch(setMessageEmpty());
    }, [dispatch]);

    // if (isLogin) return <Navigate to={"/"} />;

    const initialValues: CreateCourseType = {
        title: "",
        categories: [""],
        status: "uncomplete",
        summary: "",
        description: "",
    };

    const handleOnSubmit = async (values: CreateCourseType) => {
        //@ts-ignore
        dispatch(authActions.register(values));
    };

    const handleDeleteMessage = () => {
        errorMessage = "";
    };


    const handleAddCategories = () => {
        
    }

    return (
        <>
            <div className="mt-[150px] h-screen flex items-center justify-center">
                <div className="bg-primary m-4 rounded-xl tablet:w-[506px]">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={createValidationSchema}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit} className="p-4" onChange={handleDeleteMessage}>
                                <h1 className="font-bold text-[32px] text-center">SIGN UP</h1>

                                <div className="flex gap-[30px] shrink-0s">
                                    <div className="flex-1">
                                        <label htmlFor="title" className="text-[24px] text-text">
                                            Title
                                        </label>
                                        <Field
                                            type="text"
                                            name="title"
                                            className={`${
                                                formik.errors.title && formik.touched.title ? "border-error" : ""
                                            } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                        />
                                        <ErrorMessage
                                            name="title"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="category" className="text-[24px] text-text">
                                            Categories
                                        </label>
                                        <Field
                                            name="categories"
                                            as="select"
                                            className={`${
                                                formik.errors.categories && formik.touched.categories
                                                    ? "border-error"
                                                    : ""
                                            } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                        >
                                            {tempCategory.map((category) => {
                                                return <option value={category} onClick={handleAddCategories}>{category}</option>
                                            })}
                                        </Field>
                                        <ErrorMessage
                                            name="category"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <label htmlFor="status" className="text-[24px] text-xl mb-1 tablet:text-2xl">
                                        Status
                                    </label>
                                    <Field
                                        name="status"
                                        as="select"
                                        className={`${
                                            formik.errors.status && formik.touched.status ? "border-error" : ""
                                        } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                    >
                                        <option value="status1">Uncompleted</option>
                                        <option value="status2">Complete</option>
                                    </Field>
                                    <ErrorMessage
                                        name="status"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="">
                                    <label htmlFor="description" className="text-xl mb-1 tablet:text-2xl">
                                        Description
                                    </label>
                                    <Field
                                        type="text"
                                        name="description"
                                        className={`${
                                            formik.errors.description && formik.touched.description
                                                ? "border-error"
                                                : ""
                                        } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="">
                                    <label htmlFor="summary" className="text-xl mb-1 tablet:text-2xl">
                                        Summary
                                    </label>
                                    <Field
                                        type="text"
                                        name="summary"
                                        className={`${
                                            formik.errors.summary && formik.touched.summary
                                                ? "border-error"
                                                : ""
                                        } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                    />
                                    <ErrorMessage
                                        name="summary"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                {errorMessage !== "" && (
                                    <span className="text-[14px] text-error font-medium">{errorMessage}</span>
                                )}
                                {successMessage !== "" && (
                                    <span className="text-[14px] text-success font-medium">{successMessage}</span>
                                )}
                                <div className="py-[12px]">
                                    <button
                                        type="submit"
                                        className="bg-switch hover:opacity-80 text-white h-[68px] py-[8px] font-medium text-[32px] rounded-lg w-full active:active:bg-green-700 disabled:opacity-50"
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default CreateCourse;
