import React, { FC, useEffect, useRef,useState } from "react";
// import { Link } from "react-router-dom";
import { Formik, ErrorMessage, Field } from "formik";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
// import { Navigate } from "react-router-dom";
import { setMessageEmpty } from "../redux/slice/auth.slice";
import { CreateCourse as CreateCourseType, Category as CategoryType } from "../types/course";
import { createCourseActions } from "../redux/slice";
import { createValidationSchema } from "../validations/course";

const CreateCourse: FC = () => {
    const dispatch = useAppDispatch();

    const [thumbnail,setThumbnail] = useState<File | null>(null)

    // const isLogin = useAppSelector((state) => state.Slice.isLogin);
    let errorMessage = useAppSelector((state) => state.courseSlice.error);
    let successMessage = useAppSelector((state) => state.courseSlice.message);
    let categoriesSelector = useAppSelector((state) => state.courseSlice.categories);
    let categoriesCreateSelector = useAppSelector((state) => state.courseSlice.createCourse.categories);
    const formikRef = useRef(null);

    useEffect(() => {
        dispatch(setMessageEmpty());
    }, [dispatch]);
    useEffect(() => {
        //@ts-ignore
        dispatch(createCourseActions.getCategories());
    }, [dispatch]);

    // if (isLogin) return <Navigate to={"/"} />;

    const initialValues: CreateCourseType = {
        title: "",
        categories: [],
        status: "uncomplete",
        summary: "",
        description: "",
    };

    const handleOnSubmit = async (values: CreateCourseType) => {
        values.categories = categoriesCreateSelector
        const data = {
            ...values,
            thumbnail:thumbnail
        }
        // @ts-ignore
        dispatch(createCourseActions.createCourse(data));
    };

    const handleDeleteMessage = () => {
        errorMessage = "";
    };

    const handleAddCategories = (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = categoriesSelector.findIndex(
            (category: CategoryType) => category.id === parseInt(event.target.value)
        );
        dispatch(createCourseActions.addCategories(index));
    };

    const handleRemoveCategory = (id: number) => {
        const index = categoriesCreateSelector.findIndex((category: CategoryType) => category.id === id);
        dispatch(createCourseActions.removeCategories(index));
    };

    const onChangeInputFile = (event:React.ChangeEvent<HTMLInputElement>) =>{
        setThumbnail(event.currentTarget.files![0])
    }

    const handleCancel = () => {
        setThumbnail(null);
        dispatch(createCourseActions.reset());
    }

    return (
        <>
            <div className=" mt-[150px] h-screen flex items-center justify-center w-[990px] ">
                <div className="m-4 rounded-xl w-[990px] tablet:w-[506px] ">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={createValidationSchema}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                    >
                        {(formik) => (
                            <form
                                onSubmit={formik.handleSubmit}
                                className="p-4 w-[990px]"
                                onChange={handleDeleteMessage}
                            >
                                <h1 className="font-bold text-[32px] text-center">SIGN UP</h1>
                                <Field
                                    name="thumb"
                                    type="file"
                                    onChange={onChangeInputFile}
                                />

                                <div className="container flex flex-row h-full">
                                    <div className="container-item flex flex-col w-1/2 mr-8">
                                        <div className="title item">
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
                                        <div className="categories item ">
                                            <label htmlFor="category" className="text-[24px] text-text">
                                                Categories
                                            </label>
                                            <div className="flex flex-row">
                                                <div className="flex bg-white overflow-y-auto w-[90%]">
                                                    {categoriesCreateSelector?.map((category: CategoryType) => {
                                                        return (
                                                            <div key={category.id}>
                                                                <div>{category.category}</div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveCategory(category.id)}
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
                                                    } w-[10%] h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                                    onChange={handleAddCategories}
                                                    default=""
                                                >
                                                    {categoriesSelector?.map(
                                                        (category: CategoryType, index: number) => {
                                                            return (
                                                                <option key={index} value={category.id}>
                                                                    {category.category}
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
                                            <label
                                                htmlFor="status"
                                                className="text-[24px] text-xl mb-1 tablet:text-2xl"
                                            >
                                                Status
                                            </label>
                                            <Field
                                                name="status"
                                                as="select"
                                                className={`${
                                                    formik.errors.status && formik.touched.status ? "border-error" : ""
                                                } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                            >
                                                <option key="uncompleted" value="status1">
                                                    Uncompleted
                                                </option>
                                                <option key="complete" value="status2">
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
                                    <div className="item mb-5 description w-1/2 flex-1">
                                        <label
                                            htmlFor="description"
                                            className="mb-3 block text-base font-medium text-[#07074D]"
                                        >
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
                                            } block h-[95%] w-full resize-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:shadow-md1`}
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="sumary">
                                    <label htmlFor="summary" className="text-xl mb-1 tablet:text-2xl">
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
                                <div className="py-[12px]">
                                    <button
                                        type="submit"
                                        className="bg-switch hover:opacity-80 text-white h-[68px] py-[8px] font-medium text-[32px] rounded-lg w-full active:active:bg-green-700 disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-switch hover:opacity-80 text-white h-[68px] py-[8px] font-medium text-[32px] rounded-lg w-full active:active:bg-green-700 disabled:opacity-50"
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
        </>
    );
};

export default CreateCourse;
