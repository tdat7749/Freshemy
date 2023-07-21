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
    const [displayCategories, setdisplayCategorie] = useState<boolean>(false);
    const [displayStatus, setDisplayStatus] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("Uncomplete");

    let errorMessage = useAppSelector((state) => state.courseSlice.error);
    let successMessage = useAppSelector((state) => state.courseSlice.message);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const categories = useAppSelector((state) => state.courseSlice.categories) ?? []
    const createCategoriesSelector = useAppSelector((state) => state.courseSlice.selectCategories);

    const formikRef = useRef(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        dispatch(setMessageEmpty());
        //@ts-ignore
        dispatch(courseActions.getCategories());
    }, [dispatch]);

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
        const categoriesId: number[] = createCategoriesSelector.map((category: CategoryType) => {
            return category.id;
        });
        let statusValue = status === "Uncomplete" ? "0" : "1";
        const slug = slugify(values.title);
        let formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("slug", slug);
        formData.append("status", statusValue);
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

    const handleAddCategories = (id: number, oldIndex: number) => {
        const index = categories.findIndex((category: CategoryType) => category.id === id);
        dispatch(courseActions.addCategories(index));
    };

    const handleRemoveCategory = (id: number, oldIndex: number) => {
        const index = createCategoriesSelector.findIndex((category: CategoryType) => category.id === id);
        dispatch(courseActions.removeCategories(index));
    };

    const handleDisplay = () => {
        setdisplayCategorie(!displayCategories);
    };

    const onChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        setThumbnail(event.currentTarget.files![0]);
        const thumbnail = event.currentTarget.files![0];
        if (thumbnail && thumbnail.type.includes("image/")) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (imageRef.current) {
                    imageRef.current.src = e.target?.result as string;
                }
            };
            reader.readAsDataURL(thumbnail);
            return;
        }
    };

    const handleCancel = () => {
        setThumbnail(null);
        dispatch(courseActions.reset());
    };

    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: "\n    .top-100 {top: 100%}\n    .bottom-100 {bottom: 100%}\n    .max-h-select {\n        max-height: 300px;\n    }\n",
                }}
            />
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
                                        <div className="flex ">
                                            <img
                                                ref={imageRef}
                                                alt=""
                                                className="w-[120px] h-[120px] rounded-lg mr-3 bg-[#D9D9D9]"
                                            />
                                            <div className="flex flex-col">
                                                <div className="">
                                                    <p>Upload thumbnail</p>
                                                    <p>Size of the image is less than 4MB</p>
                                                </div>
                                                <Field
                                                    name="thumbnail"
                                                    type="file"
                                                    className="w-full h-full cursor-pointer"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        onChangeInputFile(event);
                                                    }}
                                                />
                                            </div>
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
                                                <div className="w-[100%] md:w-1/2">
                                                    <div className="flex flex-col items-center relative">
                                                        <div className="w-full  svelte-1l8159u">
                                                            <div className="my-2 p-1 flex border border-gray-200 bg-white rounded svelte-1l8159u">
                                                                <div className="flex flex-auto flex-wrap py-4">
                                                                    {createCategoriesSelector?.map(
                                                                        (category: CategoryType, index: number) => {
                                                                            return (
                                                                                <div
                                                                                    key={index}
                                                                                    className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-teal-700 bg-teal-100 border border-teal-300 "
                                                                                    onClick={() => {
                                                                                        handleRemoveCategory(
                                                                                            category.id,
                                                                                            index
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <div className="text-xs font-normal leading-none max-w-full flex-initial">
                                                                                        {category.title}
                                                                                    </div>
                                                                                    <div className="flex flex-auto flex-row-reverse">
                                                                                        <div>
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                width="100%"
                                                                                                height="100%"
                                                                                                fill="none"
                                                                                                viewBox="0 0 24 24"
                                                                                                stroke="currentColor"
                                                                                                strokeWidth={2}
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                                className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2"
                                                                                            >
                                                                                                <line
                                                                                                    x1={18}
                                                                                                    y1={6}
                                                                                                    x2={6}
                                                                                                    y2={18}
                                                                                                />
                                                                                                <line
                                                                                                    x1={6}
                                                                                                    y1={6}
                                                                                                    x2={18}
                                                                                                    y2={18}
                                                                                                />
                                                                                            </svg>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <input
                                                                            placeholder=""
                                                                            className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 svelte-1l8159u">
                                                                    <button
                                                                        type="button"
                                                                        className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
                                                                        onClick={handleDisplay}
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="100%"
                                                                            height="100%"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                            strokeWidth={2}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            className="feather feather-chevron-up w-4 h-4"
                                                                        >
                                                                            <polyline points="18 15 12 9 6 15" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {displayCategories && (
                                                            <div className="absolute shadow top-100 bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto svelte-5uyqqj">
                                                                <div className="flex flex-col w-full">
                                                                    {categories.map(
                                                                        (category: any, index: number) => {
                                                                            return (
                                                                                <div
                                                                                    key={index}
                                                                                    className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100"
                                                                                    onClick={() =>
                                                                                        handleAddCategories(
                                                                                            category.id,
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                                                                                        <div className="w-full items-center flex">
                                                                                            <div className="mx-2 leading-6  ">
                                                                                                {category.title}{" "}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="categories item ">
                                                <label htmlFor="category" className="text-lg mb-1 tablet:text-xl">
                                                    Status
                                                </label>
                                                <div className="w-[100%] md:w-1/2">

                                                        <div className="flex flex-col items-center relative">
                                                            <div className="w-full  svelte-1l8159u">
                                                                <div className="mt-2 p-1 flex border border-gray-200 bg-white rounded svelte-1l8159u">
                                                                    <div className="flex flex-auto flex-wrap py-4">
                                                                        <div>{status}</div>
                                                                    </div>
                                                                    <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 svelte-1l8159u">
                                                                        <button
                                                                            type="button"
                                                                            className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
                                                                            onClick={() => {
                                                                                setDisplayStatus(!displayStatus);
                                                                            }}
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="100%"
                                                                                height="100%"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor"
                                                                                strokeWidth={2}
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                className="feather feather-chevron-up w-4 h-4"
                                                                            >
                                                                                <polyline points="18 15 12 9 6 15" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {displayStatus && (
                                                                <div className="absolute shadow top-100 bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto svelte-5uyqqj">
                                                                    <div className="flex flex-col w-full">
                                                                        <div
                                                                            className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100"
                                                                            onClick={() => {
                                                                                setStatus("Uncomplete");
                                                                            }}
                                                                        >
                                                                            <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                                                                                <div className="w-full items-center flex">
                                                                                    <div className="mx-2 leading-6  ">
                                                                                        Uncomplete
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100"
                                                                            onClick={() => {
                                                                                setStatus("Completed");
                                                                            }}
                                                                        >
                                                                            <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                                                                                <div className="w-full items-center flex">
                                                                                    <div className="mx-2 leading-6  ">
                                                                                        Completed
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                </div>
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
