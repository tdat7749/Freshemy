import React, { useState } from "react";
import { Navbar } from "@src/components";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { User as UserType } from "../../types/user";
import { DefaultAvatar, Skeleton } from "@src/assets";

const initialValue: UserType = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    description: "",
};

const handleOnSubmit = () => {};

const MyProfile: React.FC = () => {
    const [isEdit, setEdit] = useState<boolean>(false);
    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-[100px] laptop:mt-0">
                <div className="px-4 tablet:px-[60px]">
                    <h1 className="text-center text-[32px] py-4 font-bold text-title">MY PROFILE</h1>
                    <div className="flex justify-center items-center">
                        <div className="hidden laptop:block">
                            <img src={Skeleton} alt="Freshemy" />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <Formik
                                initialValues={initialValue}
                                // validationSchema={loginValidationSchema}
                                onSubmit={handleOnSubmit}
                            >
                                {(formik) => (
                                    <Form
                                        className="p-4 flex items-center justify-center flex-col"
                                        onSubmit={formik.handleSubmit}
                                    >
                                        <div className="w-32 h-32 rounded-full border">
                                            <img
                                                src={DefaultAvatar}
                                                alt="Avatar"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                        <div className="bg-primary m-4 rounded-xl shadow-lg p-4">
                                            <div className="flex flex-col mobile:flex-row gap-2">
                                                <div className="flex flex-col mb-3">
                                                    <label htmlFor="firstName" className="text-sm mb-1 tablet:text-xl">
                                                        First name
                                                    </label>
                                                    <Field
                                                        id="firstName"
                                                        name="firstName"
                                                        type="text"
                                                        className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                            formik.errors.first_name && formik.touched.first_name
                                                                ? "border-error"
                                                                : ""
                                                        }`}
                                                    />
                                                    <ErrorMessage
                                                        name="email"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                                <div className="flex flex-col mb-3">
                                                    <label htmlFor="lastName" className="text-sm mb-1 tablet:text-xl">
                                                        Last name
                                                    </label>
                                                    <Field
                                                        id="lastName"
                                                        name="lastName"
                                                        type="text"
                                                        className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                            formik.errors.last_name && formik.touched.last_name
                                                                ? "border-error"
                                                                : ""
                                                        }`}
                                                    />
                                                    <ErrorMessage
                                                        name="lastName"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col mobile:flex-row gap-2">
                                                <div className="flex flex-col mb-3">
                                                    <label htmlFor="email" className="text-sm mb-1 tablet:text-xl">
                                                        Email
                                                    </label>
                                                    <Field
                                                        id="email"
                                                        name="email"
                                                        type="text"
                                                        className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                            formik.errors.email && formik.touched.email
                                                                ? "border-error"
                                                                : ""
                                                        }`}
                                                    />
                                                    <ErrorMessage
                                                        name="email"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                                <div className="flex flex-col mb-3">
                                                    <label htmlFor="password" className="text-sm mb-1 tablet:text-xl">
                                                        Password
                                                    </label>
                                                    <Field
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                            formik.errors.password && formik.touched.password
                                                                ? "border-error"
                                                                : ""
                                                        }`}
                                                    />
                                                    <ErrorMessage
                                                        name="password"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="">
                                                <label htmlFor="description" className="text-sm mb-1 tablet:text-xl">
                                                    About me
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    placeholder="Description about your course..."
                                                    className={`${
                                                        formik.errors.description && formik.touched.description
                                                            ? "border-error"
                                                            : ""
                                                    } flex-1 w-full rounded-md border border-[#e0e0e0] py-4 px-4  outline-none focus:shadow-md1`}
                                                />
                                                <ErrorMessage
                                                    name="description"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                            {isEdit ? (
                                                <div className="flex justify-end">
                                                    <button className="text-white btn btn-primary text-lg" type="submit">
                                                        Save
                                                    </button>
                                                    <button className="btn ml-2 text-lg">Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end">
                                                    <button
                                                        className="text-white btn btn-primary text-lg"
                                                        onClick={() => setEdit(true)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button className="text-white btn ml-2 btn-error text-lg">Logout</button>
                                                </div>
                                            )}
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyProfile;
