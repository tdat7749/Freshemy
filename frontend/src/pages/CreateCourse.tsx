import React, { FC, useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
import { Formik, ErrorMessage, Field } from "formik";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
// import { Navigate } from "react-router-dom";
import { setMessageEmpty } from "../redux/slice/auth.slice";
import { NewCourse as CreateCourseType, Category as CategoryType } from "../types/course";
import { courseActions } from "../redux/slice";
import { createValidationSchema } from "../validations/course";
import slugify from "slugify";

const CreateCourse: FC = () => {
    const dispatch = useAppDispatch();

    const [thumbnail, setThumbnail] = useState<File | null>(null);

    // const isLogin = useAppSelector((state) => state.Slice.isLogin);
    let errorMessage = useAppSelector((state) => state.courseSlice.error);
    let successMessage = useAppSelector((state) => state.courseSlice.message);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    let categoriesSelector = useAppSelector((state) => state.courseSlice.categories);
    let categoriesCreateSelector = useAppSelector((state) => state.courseSlice.selectCategories);
    const formikRef = useRef(null);

    useEffect(() => {
        dispatch(setMessageEmpty());
        //@ts-ignore
        dispatch(courseActions.getCategories());
    }, [dispatch]);

    // if (isLogin) return <Navigate to={"/"} />;

    const initialValues: CreateCourseType = {
        title: "",
        categories: "Categories",
        status: 0,
        summary: "",
        description: "",
        thumbnail: null,
    };

    const handleOnSubmit = async (values: CreateCourseType) => {
        // Trong request form thì value chỉ được là text hoặc file
        const categoriesId: number[] = categoriesCreateSelector.map((category: CategoryType) => {
            return category.id;
        });
        const slug = slugify(values.title);
        let formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("slug", slug); // chỗ này tìm 1 hàm convert qua slug ở trên mạng, ném hàm đó vào folder utils hay gì cũng đc
        formData.append("status", values.status.toString());
        formData.append("thumbnail", thumbnail as File);
        formData.append("summary", values.summary);
        categoriesId.forEach((item) => {
            formData.append("categories[]", item.toString());
        });

        // @ts-ignore
        dispatch(courseActions.createCourses(formData));
    };

    const handleDeleteMessage = () => {
        errorMessage = "";
    };

    const handleAddCategories = (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = categoriesSelector.findIndex(
            (category: CategoryType) => category.id === parseInt(event.target.value)
        );
        dispatch(courseActions.addCategories(index));
    };

    const handleRemoveCategory = (id: number) => {
        const index = categoriesCreateSelector.findIndex((category: CategoryType) => category.id === id);
        dispatch(courseActions.removeCategories(index));
    };

    const onChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        setThumbnail(event.currentTarget.files![0]);
    };

    const handleCancel = () => {
        setThumbnail(null);
        dispatch(courseActions.reset());
    };

    return (
        <>
            <div className="min-h-screen h-full container px-4 m-auto mt-[100px] ">
                <div className="w-full flex justify-center items-center shrink-0">
                    <div className="m-4 rounded-xl border border-black w-full max-w-[982px]">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={createValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <form onSubmit={formik.handleSubmit} className="p-4" onChange={handleDeleteMessage}>
                                    <div className="flex">
                                        <div className="w-[120px] h-[120px] rounded-lg mr-3 bg-[#D9D9D9]">
                                            <Field
                                                name="thumbnail"
                                                type="file"
                                                className="opacity-0 w-full h-full cursor-pointer"
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    onChangeInputFile(event);
                                                }}
                                            />
                                            <ErrorMessage
                                                name="thumbnail"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="">
                                            <p>Upload logo</p>
                                            <p>Size of the image is less than 18MB</p>
                                        </div>
                                    </div>
                                    <div className="container flex flex-row h-full gap-4">
                                        <div className="container-item flex flex-col gap-4 w-1/2">
                                            <div className="title item">
                                                <label htmlFor="title" className="text-lg mb-1 tablet:text-xl">
                                                    Title
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="title"
                                                    className={`${
                                                        formik.errors.title && formik.touched.title
                                                            ? "border-error"
                                                            : ""
                                                    } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                                />
                                                <ErrorMessage
                                                    name="title"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                            <div className="categories item ">
                                                <label htmlFor="category" className="text-lg mb-1 tablet:text-xl">
                                                    Categories
                                                </label>
                                                <div className="flex flex-row  border-[1px] rounded-lg ">
                                                    <div className="flex bg-white overflow-y-auto w-[90%] rounded-l-lg">
                                                        {categoriesCreateSelector?.map((category: CategoryType) => {
                                                            return (
                                                                <div key={category.id}>
                                                                    <div>{category.title}</div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRemoveCategory(category.id)
                                                                        }
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <Field
                                                        name="categories"
                                                        as="select"
                                                        className={`${
                                                            formik.errors.categories && formik.touched.categories
                                                                ? "border-error"
                                                                : ""
                                                        } w-full h-[68px] px-[8px] outline-none rounded-r-lg`}
                                                        onChange={handleAddCategories}
                                                        default=""
                                                    >
                                                        {categoriesSelector?.map(
                                                            (category: CategoryType, index: number) => {
                                                                return (
                                                                    <option key={index} value={category.id}>
                                                                        {category.title}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </Field>
                                                </div>
                                                <ErrorMessage
                                                    name="category"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                            <div className="status item">
                                                <label htmlFor="status" className="text-lg mb-1 tablet:text-xl">
                                                    Status
                                                </label>
                                                <Field
                                                    name="status"
                                                    as="select"
                                                    className={`${
                                                        formik.errors.status && formik.touched.status
                                                            ? "border-error"
                                                            : ""
                                                    } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                                >
                                                    <option key="0" value={0}>
                                                        Uncompleted
                                                    </option>
                                                    <option key="1" value={1}>
                                                        Complete
                                                    </option>
                                                </Field>
                                                <ErrorMessage
                                                    name="status"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="item description w-1/2 flex-1 flex flex-col">
                                            <label htmlFor="description" className="text-lg mb-1 tablet:text-xl">
                                                Description
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                placeholder="Explain your queries"
                                                className={`${
                                                    formik.errors.description && formik.touched.description
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="description"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="sumary mt-4">
                                        <label htmlFor="summary" className="text-lg mb-1 tablet:text-xl">
                                            Summary
                                        </label>
                                        <Field
                                            type="text"
                                            name="summary"
                                            className={`${
                                                formik.errors.summary && formik.touched.summary ? "border-error" : ""
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
                                    <div className="py-[12px] flex justify-end gap-2">
                                        <button
                                            disabled={isLoading ? true : false}
                                            type="submit"
                                            className="py-4 px-4 bg-switch rounded-lg text-white text-xl hover:opacity-80"
                                        >
                                            {isLoading ? "Loading..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            className="py- px-4 rounded-lg text-xl border-[1px] hover:bg-slate-100"
                                            onClick={() => {
                                                formik.resetForm(initialValues);
                                                handleCancel();
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateCourse;
