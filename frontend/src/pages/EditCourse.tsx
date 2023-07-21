import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { Formik, ErrorMessage, Field } from "formik";
import { editCourseValidationSchema } from "../validations/course";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { sectionActions } from "../redux/slice";
import { useParams } from "react-router-dom";
import Accordion from "../components/Accordion";
import { AddSection as AddSectionType } from "../types/section";
import DeleteModal from "../components/DeleteModal";
import PopupAddLesson from "../components/PopupAddLesson";
import { courseActions } from "../redux/slice";
import {
    Category as CategoryType,
    CourseDetail as CourseDetailType,
    ChangeInformation as ChangeInformationType,
} from "../types/course";
import { setMessageEmpty } from "../redux/slice/auth.slice";
import slugify from "slugify";

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
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    let categoriesSelector = useAppSelector((state) => state.courseSlice.categories);
    let createCategoriesSelector = useAppSelector((state) => state.courseSlice.selectCategories);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);

    let errorMessage = useAppSelector((state) => state.courseSlice.error);
    let successMessage = useAppSelector((state) => state.courseSlice.message);

    let errorSection = useAppSelector((state) => state.sectionSlice.error) ?? "";
    let successSection = useAppSelector((state) => state.sectionSlice.message) ?? "";

    const courseDetail: CourseDetailType = useAppSelector((state) => state.courseSlice.courseDetail);

    const { course_id } = useParams();

    const initialValue: ChangeInformationType = {
        title: courseDetail.title,
        summary: courseDetail.summary,
        categories: courseDetail.categories,
        status: courseDetail.status,
        description: courseDetail.description,
        id: Number(course_id),
        slug: courseDetail.slug,
    };

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setMessageEmpty());
        //@ts-ignore
        dispatch(courseActions.getCategories());
        //@ts-ignore
        dispatch(courseActions.getCourseDetailById(course_id));
    }, [dispatch, course_id]);

    const handleAddSection = () => {
        const values: AddSectionType = {
            course_id: Number(course_id),
            title: section,
        };
        // @ts-ignore
        dispatch(sectionActions.addSection(values)).then((response) => {
            if (response.payload.status_code === 200) {
                console.log(response.payload);
                dispatch(courseActions.addSection(values));
            }
        });
    };

    const handleDisplayDeleteModal = (id: number) => {
        setIdItem(id);
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleDisplayAddSectionModal = (id: number) => {
        setIdItem(id);
        setIsDisplayAddLessonModal(!isDisplayAddLessonModal);
    };

    const handleDeleteSection = () => {
        //@ts-ignore
        dispatch(sectionActions.deleteSection(idItem)).then((response) => {
            if (response.payload.status_code === 200) {
                dispatch(courseActions.setDeleteSection(idItem));
            }
        });
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleEditSection = (id: number, title: string) => {
        // @ts-ignore
        dispatch(sectionActions.editSection({ id, title })).then((response) => {
            if (response.payload.status_code === 200) {
                dispatch(courseActions.setEditSection({ id, title }));
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

    const imageRef = useRef<HTMLImageElement>(null);

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

    const handleChangeThumbnail = () => {
        if (thumbnail) {
            const formData = new FormData();
            formData.append("thumbnail", thumbnail as File);
            formData.append("course_id", course_id as string);

            //@ts-ignore
            dispatch(courseActions.changeThumbnail(formData)).then((response) => {
                if (response.payload.status_code === 200) {
                    if (thumbnail) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            if (imageRef.current) {
                                imageRef.current.src = e.target?.result as string;
                            }
                        };
                        reader.readAsDataURL(thumbnail);
                        return;
                    }
                }
            });
        }
    };

    const changeInformation = (values: ChangeInformationType) => {
        const categories = createCategoriesSelector.map((item: CategoryType) => item.id);
        const data = {
            ...values,
            categories: categories,
            slug: slugify(values.title),
        };
        console.log(data);
        //@ts-ignore
        dispatch(courseActions.changeInformation(data));
    };

    return (
        <>
            {isLoading !== true && (
                <>
                    <Navbar />
                    <div className="min-h-screen h-full container px-4 m-auto flex flex-col mt-11 laptop:flex-row laptop:gap-[76px]">
                        <div className="flex-1 p-4">
                            <div className="flex">
                                <div className="flex ">
                                    <img
                                        ref={imageRef}
                                        src={`${courseDetail.thumbnail}`}
                                        alt=""
                                        className="w-[120px] h-[120px] rounded-lg mr-3 bg-[#D9D9D9]"
                                    />
                                    <div className="flex flex-col">
                                        <div className="">
                                            <p>Upload thumbnail</p>
                                            <p>Size of the image is less than 4MB</p>
                                        </div>
                                        <input
                                            name="thumbnail"
                                            type="file"
                                            className="w-full h-full cursor-pointer"
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                onChangeInputFile(event);
                                            }}
                                        />
                                        <div className="">
                                            <button
                                                type="submit"
                                                onClick={handleChangeThumbnail}
                                                className="px-4 py-1 mr-1 bg-switch rounded-lg text-white text-xl hover:opacity-80"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Formik
                                initialValues={initialValue}
                                validationSchema={editCourseValidationSchema}
                                onSubmit={changeInformation}
                            >
                                {(formik) => (
                                    <form onSubmit={formik.handleSubmit} className="flex flex-col mb-3">
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
                                                        formik.errors.title && formik.touched.title
                                                            ? "border-error"
                                                            : ""
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
                                            <div className="categories item flex-1">
                                                <label htmlFor="category" className="text-lg mb-1 tablet:text-xl">
                                                    Categories
                                                </label>
                                                <div className="flex flex-col">
                                                    <div className="w-full  svelte-1l8159u">
                                                        <div className="my-2 p-4 flex border border-gray-200 bg-white rounded svelte-1l8159u">
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
                                                                        disabled
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
                                                        <div className="shadow top-100 bg-white z-[99] w-full lef-0 rounded max-h-select overflow-y-auto svelte-5uyqqj">
                                                            <div className="flex flex-col w-full overflow-y-scroll">
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
                                            <div className="categories item flex-1">
                                                <label htmlFor="category" className="text-lg mb-1 tablet:text-xl">
                                                    Status
                                                </label>
                                                <div className="flex flex-col">
                                                    <div className="w-full  svelte-1l8159u">
                                                        <div className="my-2 p-4 flex border border-gray-200 bg-white rounded svelte-1l8159u">
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
                                                        <div className="shadow top-100 bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto svelte-5uyqqj">
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
                                        {errorMessage !== "" && (
                                            <span className="text-[14px] text-error font-medium">{errorMessage}</span>
                                        )}
                                        {successMessage !== "" && (
                                            <span className="text-[14px] text-success font-medium">
                                                {successMessage}
                                            </span>
                                        )}
                                        <div className="flex justify-end mt-4">
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
                                    </form>
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
                            {errorSection !== "" && (
                                <span className="text-[14px] text-error font-medium">{errorSection}</span>
                            )}
                            {successSection !== "" && (
                                <span className="text-[14px] text-success font-medium">{successSection}</span>
                            )}
                            {/* handle list lesson */}
                            <div className="mt-2">
                                {courseDetail.sections.map((section, index) => (
                                    <Accordion
                                        key={index}
                                        section={section}
                                        handleDeleteSection={handleDeleteSection}
                                        handleDisplayEditModal={handleDisplayEditModal}
                                        handleDisplayDeleteModal={handleDisplayDeleteModal}
                                        handleDisplayAddSectionModal={handleDisplayAddSectionModal}
                                        isDisplayBtn={true}
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
                        <PopupAddLesson
                            handleDelete={handleDeleteSection}
                            handleCancel={handleCancelModalAddLesson}
                            id={idItem}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default EditCourse;
