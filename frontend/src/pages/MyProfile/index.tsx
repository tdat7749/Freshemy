import React, { useEffect } from "react";
import { Navbar } from "@src/components";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { UpdateInformation as UpdateInformationType, User as UserType } from "../../types/user";
import { DefaultAvatar, Skeleton } from "@src/assets";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions, userActions } from "@redux/slice";
import { updateProfileValidationSchema } from "../../validations/user";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import PopUpChangeAvatar from "./PopUpChangeAvatar";

const MyProfile: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user: UserType = useAppSelector((state) => state.authSlice.user);
    const initialValue: UserType = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        description: user.description,
    };
    useEffect(() => {
        // @ts-ignore
        dispatch(authActions.getMe());
    }, [dispatch]);
    const handleOnSubmit = (values: UserType) => {
        const data: UpdateInformationType = {
            first_name: values.first_name,
            last_name: values.last_name,
            description: values.description,
        };
        // @ts-ignore
        dispatch(userActions.updateInformation(data)).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
            } else {
                toast.error(response.payload.message);
            }
        });
    };

    const handleLogout = () => {
        // @ts-ignore
        dispatch(authActions.logout());
        navigate("/");
    };

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
                            <div className="w-32 h-32 rounded-full border">
                                <PopUpChangeAvatar urlAvatar={user.url_avatar || DefaultAvatar} userId={user.id} />
                            </div>
                            <Formik
                                initialValues={initialValue}
                                validationSchema={updateProfileValidationSchema}
                                onSubmit={handleOnSubmit}
                                enableReinitialize={true}
                            >
                                {(formik) => (
                                    <Form
                                        className="flex items-center justify-center flex-col"
                                        onSubmit={formik.handleSubmit}
                                    >
                                        <div className="bg-primary m-4 rounded-xl shadow-lg p-4">
                                            <div className="flex flex-col mobile:flex-row gap-2">
                                                <div className="flex flex-col mb-3">
                                                    <label htmlFor="first_name" className="text-sm mb-1 tablet:text-xl">
                                                        First name
                                                    </label>
                                                    <Field
                                                        name="first_name"
                                                        type="text"
                                                        className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                            formik.errors.first_name && formik.touched.first_name
                                                                ? "border-error"
                                                                : ""
                                                        }`}
                                                    />
                                                    <ErrorMessage
                                                        name="first_name"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                                <div className="flex flex-col mb-3">
                                                    <label htmlFor="last_name" className="text-sm mb-1 tablet:text-xl">
                                                        Last name
                                                    </label>
                                                    <Field
                                                        name="last_name"
                                                        type="text"
                                                        className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                            formik.errors.last_name && formik.touched.last_name
                                                                ? "border-error"
                                                                : ""
                                                        }`}
                                                    />
                                                    <ErrorMessage
                                                        name="last_name"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col mb-3">
                                                <label htmlFor="email" className="text-sm mb-1 tablet:text-xl">
                                                    Email
                                                </label>
                                                <Field
                                                    name="email"
                                                    disabled={true}
                                                    type="text"
                                                    className={`px-2 py-4 w-full rounded-lg border-[1px] outline-none${
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
                                            <div className="flex justify-end">
                                                <button className="text-white btn btn-primary text-lg" type="submit">
                                                    Save
                                                </button>
                                                <button className="btn ml-2 btn-error text-lg" onClick={handleLogout}>
                                                    Logout
                                                </button>
                                            </div>
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
