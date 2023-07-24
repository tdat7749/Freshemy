import React, { FC, useEffect, useRef, useState } from "react";

import { Formik, ErrorMessage, Field } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import { setMessageEmpty } from "../../redux/slice/auth.slice";
import { NewCourse as CreateCourseType, Category as CategoryType } from "../../types/course";
import { courseActions } from "../../redux/slice";
import { createValidationSchema } from "../../validations/course";
import slugify from "slugify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

import toast from "react-hot-toast";

const CreateCourse: FC = () => {
    const dispatch = useAppDispatch();

    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [displayCategories, setdisplayCategorie] = useState<boolean>(false);
    const [displayStatus, setDisplayStatus] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("Uncomplete");
    const [errorCategories, setErrorCategories] = useState<number>(0);
    let errorMessage = useAppSelector((state) => state.courseSlice.error);
    let successMessage = useAppSelector((state) => state.courseSlice.message);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const categories = useAppSelector((state) => state.courseSlice.categories) ?? [];
    const createCategoriesSelector = useAppSelector((state) => state.courseSlice.selectCategories);

    const formikRef = useRef(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setMessageEmpty());
        //@ts-ignore
        dispatch(courseActions.getCategories());
        dispatch(courseActions.reset());
        setThumbnail(null);
    }, [dispatch]);

    const initialValues: CreateCourseType = {
        title: "",
        categories: 0,
        status: 0,
        summary: "",
        description: "",
        thumbnail: null,
    };
    

    const handleOnSubmit = async (values: CreateCourseType) => {
        // Trong request form thì value chỉ được là text hoặc file

        if (!errorCategories) {
            const categoriesId: number[] = createCategoriesSelector.map((category: CategoryType) => {
                return category.id;
            });
            let statusValue = status === "Uncomplete" ? "0" : "1";
            const slug = slugify(values.title.toLowerCase());
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
            dispatch(courseActions.createCourses(formData)).then((response) => {
                if (response.payload.status_code === 201) {
                    toast.success(response.payload.message);
                    navigate("/my-courses");
                } else {
                    toast.error(response.payload.message);
                }
            });
        }
    };

    const handleDeleteMessage = () => {
        errorMessage = "";
    };

    const handleAddCategories = (id: number, oldIndex: number) => {
        console.log("add" + errorCategories)
        if (createCategoriesSelector.length <= 3) {
            setErrorCategories(0);
            const index = categories.findIndex((category: CategoryType) => category.id === id);
            dispatch(courseActions.addCategories(index));
        } else {
            setErrorCategories(1);
        }
    };

    const handleRemoveCategory = (id: number, oldIndex: number) => {
        console.log(errorCategories);
        if (createCategoriesSelector.length > 0) {
            setErrorCategories(0);
            const index = createCategoriesSelector.findIndex((category: CategoryType) => category.id === id);
            dispatch(courseActions.removeCategories(index));
        }
        if (createCategoriesSelector.length - 1 <= 0) {
            setErrorCategories(2);
        }
    };

    const handleDisplay = () => {
        if (createCategoriesSelector.length === 4) {
            setErrorCategories(0);
        }
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

    return (
        <>
            <Navbar />
            <div className="min-h-screen h-full px-4 tablet:px-[60px]">
                <h1 className="text-center text-[32px] py-4 font-bold text-title">CREATE COURSE</h1>
                <div className="w-full flex justify-center items-center shrink-0">
                    <div className="m-4 rounded-xl border border-black w-full max-w-[982px] bg-background">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={createValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <form onSubmit={formik.handleSubmit} className="p-4" onChange={handleDeleteMessage}>
                                    <div className="flex">
                                        <div className="flex rounded-lg items-start">
                                            <img
                                                ref={imageRef}
                                                alt="Thumbnail"
                                                className="w-32 h-32 rounded-lg mr-3 outline-none border border-dashed border-black tablet:w-60 tablet:h-60"
                                            />
                                            <div className="flex flex-col gap-3">
                                                <div className="">
                                                    <p className="text-lg font-medium">Upload thumbnail</p>
                                                    <p className="italic">Size of the image is less than 4MB</p>
                                                </div>
                                                <Field
                                                    name="thumbnail"
                                                    type="file"
                                                    value={null}
                                                    accept=".png, .jpg"
                                                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        formik.setFieldValue(
                                                            "thumbnail",
                                                            event.currentTarget.files![0]
                                                        );
                                                        onChangeInputFile(event);
                                                    }}
                                                />
                                                <ErrorMessage
                                                    name="thumbnail"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-4 my-3">
                                        <div className="flex-1 flex flex-col gap-3">
                                            <div className="flex flex-col">
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Title
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="title"
                                                    className={`${
                                                        formik.errors.title && formik.touched.title
                                                            ? "border-error"
                                                            : ""
                                                    } px-2 py-4 rounded-lg border-[1px] outline-none max-w-lg`}
                                                />
                                                <ErrorMessage
                                                    name="title"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label
                                                    htmlFor="category"
                                                    className="text-sm mb-1 tablet:text-xl font-medium"
                                                >
                                                    Categories
                                                </label>
                                                <div className="flex flex-col items-center relative max-w-lg">
                                                    <div className="w-full">
                                                        <div className="flex border border-gray-200 bg-white rounded">
                                                            <div className="flex flex-auto flex-wrap py-4 px-2 h-full w-full">
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
                                                                        readOnly
                                                                        name="categories"
                                                                        className="bg-transparent px-2 appearance-none outline-none h-full w-full text-gray-800"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
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
                                                    {errorCategories === 1 ? (
                                                        <span className="text-[14px] text-error font-medium">
                                                            Categories Must be under 4
                                                        </span>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {errorCategories === 2 ? (
                                                        <span className="text-[14px] text-error font-medium">
                                                            Categories is required
                                                        </span>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {displayCategories && (
                                                        <div className="absolute shadow top-[100%] bg-white z-40 w-full left-0 rounded max-h-60 overflow-y-auto mt-1">
                                                            <div className="flex flex-col w-full overflow-y-auto">
                                                                {categories.map(
                                                                    (category: CategoryType, index: number) => {
                                                                        return (
                                                                            <div
                                                                                key={index}
                                                                                className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-backgroundHover"
                                                                                onClick={() => {
                                                                                    handleAddCategories(
                                                                                        category.id,
                                                                                        index
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-bgHovbg-backgroundHover">
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
                                            <div className="flex flex-col">
                                                <label
                                                    htmlFor="status"
                                                    className="text-sm mb-1 tablet:text-xl font-medium"
                                                >
                                                    Status
                                                </label>
                                                <div className="flex flex-col items-center relative max-w-lg">
                                                    <div className="w-full">
                                                        <div className="flex border border-gray-200 bg-white rounded">
                                                            <div className="flex flex-auto flex-wrap py-4 px-2">
                                                                <div className="flex-1">{status}</div>
                                                            </div>
                                                            <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
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
                                                        <div className="absolute shadow top-[100%]  mt-1 bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto">
                                                            <div className="flex flex-col w-full">
                                                                <div
                                                                    className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-backgroundHover"
                                                                    onClick={() => {
                                                                        setStatus("Uncomplete");
                                                                    }}
                                                                >
                                                                    <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:bg-bgHo">
                                                                        <div className="w-full items-center flex">
                                                                            <div className="mx-2 leading-6 ">
                                                                                Uncomplete
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-backgroundHover"
                                                                    onClick={() => {
                                                                        setStatus("Completed");
                                                                    }}
                                                                >
                                                                    <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative">
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
                                        <div className="flex-1 flex flex-col">
                                            <label
                                                htmlFor="description"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Description
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                placeholder="Description about your course..."
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
                                        <label htmlFor="summary" className="text-sm mb-1 font-medium tablet:text-xl">
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

                                    <div className="py-[12px] flex justify-end">
                                        <button
                                            disabled={isLoading ? true : false}
                                            type="submit"
                                            className="btn btn-primary text-lg"
                                        >
                                            {isLoading ? "Loading..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn text-lg ml-2"
                                            onClick={() => {
                                                formik.resetForm(initialValues);
                                            }}
                                        >
                                            <Link to={`/my-courses`}>Cancel</Link>
                                        </button>
                                        {errorMessage !== "" && (
                                            <span className="text-[14px] text-error font-medium">{errorMessage}</span>
                                        )}
                                        {successMessage !== "" && (
                                            <span className="text-[14px] text-success font-medium">
                                                {successMessage}
                                            </span>
                                        )}
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
