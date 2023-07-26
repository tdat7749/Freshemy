import React, { FC, useEffect, useRef, useState } from "react";
import { Formik, ErrorMessage, Field } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { NewCourse as CreateCourseType, Category as CategoryType } from "../../types/course";
import { courseActions, fileStorageActions } from "../../redux/slice";
import { createValidationSchema } from "../../validations/course";
import slugify from "slugify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";
import CustomeSelect from "../../components/Select";
import { previewImage } from "../../utils/helper";

type CategoriesOptions = {
    value: number;
    label: string;
};

const CreateCourse: FC = () => {
    const dispatch = useAppDispatch();
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const isUpload = useAppSelector((state) => state.fileStorageSlice.isLoading);
    const categories: CategoryType[] = useAppSelector((state) => state.courseSlice.categories) ?? [];
    const formikRef = useRef(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const navigate = useNavigate();
    const categoriesOptions: CategoriesOptions[] = [];
    const statusOptions = [
        {
            value: 1,
            label: "Completed",
        },
        {
            value: 0,
            label: "Uncomplete",
        },
    ];
    useEffect(() => {
        categories.forEach((category: CategoryType) => {
            const temp: CategoriesOptions = {
                value: category.id,
                label: category.title,
            };
            categoriesOptions.push(temp);
        });
    }, [categories, categoriesOptions]);
    useEffect(() => {
        //@ts-ignore
        dispatch(courseActions.getCategories());
        dispatch(courseActions.reset());

        setThumbnail(null);
    }, [dispatch]);

    const initialValues: CreateCourseType = {
        title: "",
        categories: [],
        status: 0,
        summary: "",
        description: "",
        thumbnail: "",
    };

    const handleOnSubmit = async (values: CreateCourseType) => {
        const formData = new FormData();
        formData.set("thumbnail", thumbnail as File);
        formData.set("upload_preset", "Freshemy");

        //@ts-ignore
        dispatch(fileStorageActions.uploadImage(formData)).then((response) => {
            if (response.payload && response.payload.status_code === 201) {
                const slug = slugify(values.title.toLowerCase());
                const categories = values.categories.map((item: any) => item.value);
                const data = {
                    ...values,
                    slug: slug,
                    categories: categories,
                    thumbnail: response.payload.data?.url as string,
                };
                //@ts-ignore
                dispatch(courseActions.createCourses(data)).then((createCourseResponse) => {
                    if (createCourseResponse.payload && createCourseResponse.payload.status_code === 201) {
                        toast.success(createCourseResponse.payload.message);
                        navigate("/my-courses");
                    } else {
                        toast.error(createCourseResponse.payload?.message as string);
                    }
                });
            } else {
                toast.error(response.payload?.message as string);
            }
        });
    };

    const handleChangeCategories = (event: any, formik: any) => {
        formik.setFieldValue("categories", event);
    };

    const handleChangeStatus = (event: any, formik: any) => {
        if (event.value === 0) {
            formik.setFieldValue("status", false);
        } else {
            formik.setFieldValue("status", true);
        }
    };

    const onChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        setThumbnail(event.currentTarget.files![0]);
        const thumbnail = event.currentTarget.files![0];
        previewImage(thumbnail, imageRef);
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
                                <form onSubmit={formik.handleSubmit} className="p-4">
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
                                                    value={undefined}
                                                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        formik.setFieldValue(
                                                            "thumbnail",
                                                            event.currentTarget.files![0]
                                                        );
                                                        formik.setFieldError("thumbnail", undefined);
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
                                            <div>
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Categories
                                                </label>
                                                <div
                                                    className={`${
                                                        formik.errors.categories && formik.touched.categories
                                                            ? "border-error"
                                                            : ""
                                                    } border-[1px]`}
                                                >
                                                    <Field
                                                        name="categories"
                                                        component={CustomeSelect}
                                                        handleOnchange={(e: any) => handleChangeCategories(e, formik)}
                                                        options={categoriesOptions}
                                                        isMulti={true}
                                                        defautlValues={""}
                                                    />
                                                </div>
                                                <ErrorMessage
                                                    name="categories"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Status
                                                </label>
                                                <Field
                                                    className="custom-select"
                                                    name="status"
                                                    component={CustomeSelect}
                                                    handleOnchange={(e: any) => handleChangeStatus(e, formik)}
                                                    options={statusOptions}
                                                    isMulti={false}
                                                    placeholder="Uncompleted"
                                                />
                                                <ErrorMessage
                                                    name="status"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
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
                                            disabled={isLoading || isUpload ? true : false}
                                            type="submit"
                                            className="btn btn-primary text-lg"
                                        >
                                            {isLoading || isUpload ? (
                                                <span className="loading loading-spinner"></span>
                                            ) : (
                                                ""
                                            )}
                                            {isLoading || isUpload ? "Loading..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn text-lg ml-2"
                                            disabled={isLoading || isUpload}
                                            onClick={() => {
                                                formik.resetForm(initialValues);
                                            }}
                                        >
                                            <Link to={`/my-courses`}>Cancel</Link>
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
