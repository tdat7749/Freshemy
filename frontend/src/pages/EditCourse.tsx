import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Formik, ErrorMessage, Field, Form } from "formik";
import { editCourseValidationSchema } from "../validations/course";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { sectionActions } from "../redux/slice";
import { useParams } from "react-router-dom";
import Accordion from "../components/Accordion";
import { AddSection as AddSectionType, Section } from "../types/section";
import DeleteModal from "../components/DeleteModal";
import PopupAddLesson from "../components/PopupAddLesson";
import { courseActions } from "../redux/slice";
import { Category as CategoryType } from "../types/course";
import { setMessageEmpty } from "../redux/slice/auth.slice";
const EditCourse: React.FC = () => {
    const [section, setSection] = useState<string>("");
    const [isDisplayDeleteModal, setIsDisplayDeleteModal] = useState<boolean>(false);
    const [isDisplayEditModal, setIsDisplayEditModal] = useState<boolean>(false);
    const [isDisplayAddLessonModal, setIsDisplayAddLessonModal] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const [itemTitle, setItemTitle] = useState<string>("");
    const [displayCategories, setdisplayCategorie] = useState<boolean>(false);
    const [displayStatus, setDisplayStatus] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("Uncomplete");
    const sectionLists: Section[] = useAppSelector((state) => state.sectionSlice.sectionList) ?? [];
    let categoriesSelector = useAppSelector((state) => state.courseSlice.categories);
    let createCategoriesSelector = useAppSelector((state) => state.courseSlice.selectCategories);
    let { course_id } = useParams();

    const initialValue = {
        title: "",
        summary: "",
        category: "",
        status: "",
        description: "",
    };

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setMessageEmpty());
        //@ts-ignore
        dispatch(courseActions.getCategories());
    }, [dispatch]);
    const handleAddSection = () => {
        const values: AddSectionType = {
            course_id: Number(course_id),
            title: section,
        };
        // @ts-ignore
        dispatch(sectionActions.addSection(values));
    };

    const handleDisplayDeleteModal = (id: number) => {
        setIdItem(id);
    };

    const handleDisplayAddSectionModal = (id: number) => {
        setIsDisplayAddLessonModal(!isDisplayAddLessonModal);
    };

    const handleDeleteSection = () => {
        //@ts-ignore
        dispatch(sectionActions.deleteSection(idItem)).then((response) => {
            if (response.payload.status_code === 200) {
                dispatch(sectionActions.setDeleteSection(idItem));
            }
        });
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleEditSection = (id: number, title: string) => {
        console.log(id, title);
        // @ts-ignore
        dispatch(sectionActions.editSection({ id, title })).then((response) => {
            if (response.payload.status_code === 200) {
                dispatch(sectionActions.setEditSection({ id, title }));
            }
        });
        setIsDisplayEditModal(!isDisplayEditModal);
    };

    const handleCancelModal = () => {
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleCancelModalAddLesson = () => {
        setIsDisplayAddLessonModal(!isDisplayAddLessonModal);
    };

    const handleDisplayEditModal = (id: number, title: string) => {
        setIdItem(id);
        setItemTitle(title);
        setIsDisplayEditModal(!isDisplayEditModal);
    };
    const handleAddCategories = (id: number, oldIndex: number) => {
        const index = categoriesSelector.findIndex((category: CategoryType) => category.id === id);
        dispatch(courseActions.addCategories(index));
    };

    const handleRemoveCategory = (id: number, oldIndex: number) => {
        const index = createCategoriesSelector.findIndex((category: CategoryType) => category.id === id);
        dispatch(courseActions.removeCategories(index));
    };

    const handleDisplay = () => {
        setdisplayCategorie(!displayCategories);
    };
    const handleOnSubmit = () => {};
    return (
        <>
            <Navbar />
            <div className="h-screen container px-4 m-auto flex flex-col mt-11 laptop:flex-row laptop:gap-[76px]">
                <div className="flex-1 p-4">
                    <div className="flex">
                        <div className="w-[120px] h-[120px] rounded-lg mr-3 bg-[#D9D9D9]">
                            <input type="file" className="opacity-0 w-full h-full cursor-pointer" />
                        </div>
                        <div className="">
                            <p>Upload logo</p>
                            <p>Size of the image is less than 18MB</p>
                        </div>
                    </div>
                    <Formik
                        initialValues={initialValue}
                        validationSchema={editCourseValidationSchema}
                        onSubmit={handleOnSubmit}
                    >
                        {(formik) => (
                            <Form onSubmit={formik.handleSubmit}>
                                <form className="flex flex-col mb-3">
                                    <div className="flex gap-[30px] shrink-0 mb-4">
                                        <div className="flex-1 flex flex-col">
                                            <label htmlFor="title" className="text-lg mb-1 tablet:text-xl">
                                                Title
                                            </label>
                                            <Field
                                                id="title"
                                                name="title"
                                                type="text"
                                                className={`px-2 py-[21px] rounded-lg border-[1px] outline-none ${
                                                    formik.errors.title && formik.touched.title ? "border-error" : ""
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="title"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label htmlFor="summary" className="text-lg mb-1 tablet:text-xl">
                                                Summary
                                            </label>
                                            <Field
                                                id="summary"
                                                name="summary"
                                                type="text"
                                                className={`px-2 py-[21px] rounded-lg border-[1px] outline-none ${
                                                    formik.errors.summary && formik.touched.summary
                                                        ? "border-error"
                                                        : ""
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="summary"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                            {/* {error !== "" && (
                                        <span className="text-[14px] text-error font-medium">{error}</span>
                                    )} */}
                                        </div>
                                    </div>
                                    <div className="flex gap-[30px] shrink-0 mb-4">
                                        <div className="categories item ">
                                            <label htmlFor="category" className="text-lg mb-1 tablet:text-xl">
                                                Categories
                                            </label>
                                            <div className="w-[100%] md:w-1/2 flex flex-col items-center">
                                                <div className="w-full px-4">
                                                    <div className="flex flex-col items-center relative">
                                                        <div className="w-full  svelte-1l8159u">
                                                            <div className="my-2 p-1 flex border border-gray-200 bg-white rounded svelte-1l8159u">
                                                                <div className="flex flex-auto flex-wrap">
                                                                    {createCategoriesSelector?.map(
                                                                        (category: any, index: number) => {
                                                                            return (
                                                                                <div
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
                                                                    {categoriesSelector.map(
                                                                        (category: any, index: number) => {
                                                                            return (
                                                                                <div
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
                                        </div>
                                        <div className="categories item ">
                                            <label htmlFor="category" className="text-lg mb-1 tablet:text-xl">
                                                Status
                                            </label>
                                            <div className="w-[100%] md:w-1/2 flex flex-col items-center">
                                                <div className="w-full px-4">
                                                    <div className="flex flex-col items-center relative">
                                                        <div className="w-full  svelte-1l8159u">
                                                            <div className="my-2 p-1 flex border border-gray-200 bg-white rounded svelte-1l8159u">
                                                                <div className="flex flex-auto flex-wrap">
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
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="description" className="text-lg mb-1 tablet:text-xl">
                                            Description
                                        </label>
                                        <Field
                                            id="description"
                                            as="textarea"
                                            name="description"
                                            type="text"
                                            className={`px-2 py-[21px] rounded-lg border-[1px] outline-none ${
                                                formik.errors.description && formik.touched.description
                                                    ? "border-error"
                                                    : ""
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                </form>
                                <div className="flex justify-end">
                                    <button
                                        className="py-2 px-4 mr-1 bg-switch rounded-lg text-white text-xl hover:opacity-80"
                                        type="submit"
                                        // disabled={error !== "" ? true : false}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="py-2 px-4 rounded-lg text-xl border-[1px] hover:bg-slate-100"
                                        type="submit"
                                        // disabled={error !== "" ? true : false}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="flex-1 p-4 flex flex-col">
                    <div className="flex gap-6">
                        <input
                            type="text"
                            className="px-2 py-[14px] rounded-lg border-[1px] outline-none flex-1"
                            placeholder="Name's section"
                            value={section}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setSection(e.target.value);
                            }}
                        />
                        <button
                            className="py-[14px] px-4 mr-1 bg-switch rounded-lg text-white text-xl hover:opacity-80 flex-3"
                            onClick={handleAddSection}
                        >
                            Add section
                        </button>
                    </div>
                    {/* handle list lesson */}
                    <div className="mt-2">
                        {sectionLists.map((section, index) => (
                            <Accordion
                                key={index}
                                section={section}
                                handleDeleteSection={handleDeleteSection}
                                handleDisplayEditModal={handleDisplayEditModal}
                                handleDisplayDeleteModal={handleDisplayDeleteModal}
                                handleDisplayAddSectionModal={handleDisplayAddSectionModal}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {/* POPUP DELETE */}
            {isDisplayDeleteModal && (
                <DeleteModal handleDelete={handleDeleteSection} handleCancel={handleCancelModal} />
            )}
            {/* POPUP EDIT */}
            {isDisplayEditModal && (
                <div className="absolute z-50 w-full h-full top-0 bg-black/50 flex justify-center items-center ">
                    <div className="bg-[#F8FFF8] p-4 w-[400px] flex flex-col items-center justify-center rounded-lg">
                        <form className="flex flex-col gap-1 w-full">
                            <div className="">Title</div>
                            <input
                                type="text"
                                value={itemTitle}
                                className="px-2 py-[14px] rounded-lg border-[1px] outline-none flex-1"
                                onChange={(e) => setItemTitle(e.target.value)}
                            />
                        </form>
                        <div className="mt-2 flex justify-end w-full">
                            <button
                                className="py-2 px-4 mr-1 bg-switch rounded-lg text-white text-xl hover:opacity-80"
                                onClick={() => handleEditSection(idItem, itemTitle)}
                            >
                                Save
                            </button>
                            <button
                                className="py-2 px-4 mr-1 bg-white rounded-lg text-xl hover:opacity-80 border-[1px] border-black"
                                onClick={() => setIsDisplayEditModal(!isDisplayEditModal)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* POPUP ADD LESSON */}
            {isDisplayAddLessonModal && (
                <PopupAddLesson handleDelete={handleDeleteSection} handleCancel={handleCancelModalAddLesson} />
            )}
        </>
    );
};

export default EditCourse;
