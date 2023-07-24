import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { Formik, ErrorMessage, Field } from "formik";
import { editCourseValidationSchema } from "../validations/course";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { sectionActions } from "../redux/slice";
import { useNavigate, useParams } from "react-router-dom";
import Accordion from "../components/Accordion";
import { AddSection as AddSectionType, Section as SectionType } from "../types/section";
import DeleteModal from "../components/DeleteModal";
import PopupAddLesson from "../components/PopupAddLesson";
import { courseActions } from "../redux/slice";
import { Category as CategoryType, CourseChangeInformation as CourseChangeInformationType } from "../types/course";
import { setMessageEmpty } from "../redux/slice/auth.slice";
import slugify from "slugify";

import toast from "react-hot-toast";

const EditCourse: React.FC = () => {
    const [section, setSection] = useState<string>("");
    const [isDisplayDeleteModal, setIsDisplayDeleteModal] = useState<boolean>(false);
    const [isDisplayEditModal, setIsDisplayEditModal] = useState<boolean>(false);
    const [isDisplayAddLessonModal, setIsDisplayAddLessonModal] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const [itemTitle, setItemTitle] = useState<string>("");
    const [displayCategories, setdisplayCategorie] = useState<boolean>(false);
    const [displayStatus, setDisplayStatus] = useState<boolean>(false);
    const [isDisplaySaveImg, setIsDisplaySaveImg] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("Uncomplete");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [errorImage, setErrorImage] = useState<boolean>(false);
    const [errorCategories, setErrorCategories] = useState<number>();
    let categoriesSelector = useAppSelector((state) => state.courseSlice.categories);
    let createCategoriesSelector = useAppSelector((state) => state.courseSlice.selectCategories);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);

    const navigate = useNavigate();

    const courseChangeDetail: CourseChangeInformationType = useAppSelector(
        (state) => state.courseSlice.courseChangeDetail
    );
    const sectionOfCourse: SectionType[] = useAppSelector((state) => state.sectionSlice.sectionList);

    const { course_id } = useParams();

    const initialValue: CourseChangeInformationType = {
        title: courseChangeDetail.title,
        summary: courseChangeDetail.summary,
        categories: courseChangeDetail.categories,
        status: courseChangeDetail.status,
        description: courseChangeDetail.description,
        id: Number(course_id),
        slug: courseChangeDetail.slug,
    };
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setMessageEmpty());
        //@ts-ignore
        dispatch(courseActions.getCategories());
        //@ts-ignore
        dispatch(courseActions.getCourseDetailById(course_id));
        //@ts-ignore
        dispatch(sectionActions.getSectionByCourseId(course_id));
    }, [dispatch, course_id]);

    const handleAddSection = () => {
        const values: AddSectionType = {
            course_id: Number(course_id),
            title: section,
        };
        // @ts-ignore
        dispatch(sectionActions.addSection(values)).then((response) => {
            if (response.payload.status_code === 201) {
                toast.success(response.payload.message);
                // @ts-ignore
                dispatch(sectionActions.getSectionByCourseId(course_id));
            } else {
                toast.error(response.payload.message);
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
                toast.success(response.payload.message);
                dispatch(sectionActions.setDeleteSection(idItem));
            } else {
                toast.error(response.payload.message);
            }
        });
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleEditSection = (id: number, title: string) => {
        // @ts-ignore
        dispatch(sectionActions.editSection({ id, title })).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(sectionActions.setEditSection({ id, title }));
            } else {
                toast.error(response.payload.message);
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
        if (createCategoriesSelector.length <= 3) {
            setErrorCategories(0);
            const index = categoriesSelector.findIndex((category: CategoryType) => category.id === id);
            dispatch(courseActions.addCategories(index));
        } else {
            setErrorCategories(1);
        }
    };

    const handleRemoveCategory = (id: number, oldIndex: number) => {
        console.log(createCategoriesSelector.length)
        if (createCategoriesSelector.length > 0) {
            setErrorCategories(0);
            const index = createCategoriesSelector.findIndex((category: CategoryType) => category.id === id);
            dispatch(courseActions.removeCategories(index));
        }
        if(createCategoriesSelector.length - 1 <= 0) {
            setErrorCategories(2);
        }
    };

    const imageRef = useRef<HTMLImageElement>(null);

    const handleDisplay = () => {
        if(createCategoriesSelector.length === 4) {
            setErrorCategories(0);
        }
        setdisplayCategorie(!displayCategories);
    };

    const onChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files![0].size > 1024 * 1024 * 4) {
            setErrorImage(true);
        } else {
            setErrorImage(false);
            setThumbnail(event.currentTarget.files![0]);
            const thumbnail = event.currentTarget.files![0];
            if (thumbnail && thumbnail.type.includes("image/")) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    if (imageRef.current) {
                        imageRef.current.src = e.target?.result as string;
                        setIsDisplaySaveImg(!isDisplaySaveImg);
                    }
                };
                reader.readAsDataURL(thumbnail);
                return;
            }
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
                                setIsDisplaySaveImg(!isDisplaySaveImg);
                            }
                        };
                        reader.readAsDataURL(thumbnail);
                        return;
                    }
                }
            });
        }
    };

    const changeInformation = (values: CourseChangeInformationType) => {
        const categories = createCategoriesSelector.map((item: CategoryType) => item.id);
        const data = {
            ...values,
            categories: categories,
            slug: slugify(values.title),
        };
        //@ts-ignore
        dispatch(courseActions.changeInformation(data)).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                // @ts-ignore
                dispatch(courseActions.getCourseDetailById(values.id));
            } else {
                toast.error(response.payload.message);
            }
        });
    };

    return (
        <>
            {isLoading !== true && (
                <>
                    <Navbar />
                    <div className="min-h-screen h-full px-4 tablet:px-[60px]">
                        <div className="flex-1 p-4 laptop:flex laptop:gap-4">
                            <div className="flex flex-col justify-center items-center gap-4 laptop:items-start laptop:justify-start">
                                <div className="">
                                    <img
                                        ref={imageRef}
                                        src={`${courseChangeDetail.thumbnail}`}
                                        alt={courseChangeDetail.title}
                                        className="w-60 h-60 rounded-lg outline-none border border-dashed border-black tablet:w-80 tablet:h-80 laptop:h-96 laptop:w-96"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="text-center tablet:text-start">
                                        <p className="text-lg font-medium">Upload thumbnail</p>
                                        <p className={`${errorImage ? "text-red-500" : ""}  italic`}>
                                            Size of the image is less than 4MB
                                        </p>
                                    </div>
                                    <input
                                        name="thumbnail"
                                        type="file"
                                        accept=".png, .jpg, .mp4"
                                        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            onChangeInputFile(event);
                                        }}
                                    />
                                    {isDisplaySaveImg && (
                                        <div className="">
                                            <button
                                                type="submit"
                                                onClick={handleChangeThumbnail}
                                                className="px-4 py-1 mr-1 bg-switch rounded-lg text-white text-xl hover:opacity-80"
                                            >
                                                {isLoading ? "Loading..." : "Save"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Formik
                                initialValues={initialValue}
                                validationSchema={editCourseValidationSchema}
                                onSubmit={changeInformation}
                            >
                                {(formik) => (
                                    <form
                                        onSubmit={formik.handleSubmit}
                                        className="mt-4 laptop:mt-0 flex-1 flex flex-col border border-dashed border-black rounded-lg p-4 bg-background shadow-lg"
                                    >
                                        <div className="flex flex-col gap-2 shrink-0 mb-2 tablet:flex-row tablet:gap-0">
                                            <div className="flex-1 flex flex-col tablet:mr-8">
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Title
                                                </label>
                                                <Field
                                                    id="title"
                                                    name="title"
                                                    type="text"
                                                    className={`px-2 py-4 rounded-lg border-[1px] outline-none w-full  ${
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
                                                <label
                                                    htmlFor="summary"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Summary
                                                </label>
                                                <Field
                                                    id="summary"
                                                    name="summary"
                                                    type="text"
                                                    className={`px-2 py-4 rounded-lg border-[1px] outline-none w-full ${
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
                                        <div className="flex flex-col gap-2 shrink-0 mb-2 tablet:flex-row tablet:gap-8">
                                            <div className="categories flex flex-col flex-1">
                                                <label
                                                    htmlFor="category"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Categories
                                                </label>
                                                <div className="flex flex-col items-center relative w-full">
                                                    <div className="w-full">
                                                        <div className="flex border border-gray-200 bg-white rounded">
                                                            <div className="flex flex-auto flex-wrap py-4 px-2">
                                                                {createCategoriesSelector?.map(
                                                                    (category: any, index: number) => {
                                                                        return (
                                                                            <div
                                                                                className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-teal-700"
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
                                                    {errorCategories === 1 ?  <span className="text-[14px] text-error font-medium">Categories Must be under 4</span> : ""}
                                                    {errorCategories === 2 ?  <span className="text-[14px] text-error font-medium">Categories is required</span> : ""}
                                                    {displayCategories && (
                                                        <div className="absolute shadow top-[100%] bg-white z-40 w-full left-0 rounded max-h-60 overflow-y-auto mt-1">
                                                            <div className="flex flex-col w-full">
                                                                {categoriesSelector.map(
                                                                    (category: any, index: number) => {
                                                                        return (
                                                                            <div
                                                                                className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-backgroundHover"
                                                                                onClick={() =>
                                                                                    handleAddCategories(
                                                                                        category.id,
                                                                                        index
                                                                                    )
                                                                                }
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
                                            <div className="status flex-1 flex flex-col">
                                                <label
                                                    htmlFor="status"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Status
                                                </label>
                                                <div className="flex flex-col items-center relative w-full">
                                                    <div className="w-full ">
                                                        <div className="flex border border-gray-200 rounded">
                                                            <div className="flex flex-auto flex-wrap py-4 px-2">
                                                                <div>{status}</div>
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
                                                                    <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:bg-backgroundHover">
                                                                        <div className="w-full items-center flex">
                                                                            <div className="mx-2 leading-6  ">
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
                                                id="description"
                                                as="textarea"
                                                name="description"
                                                type="text"
                                                className={`flex-1 w-full resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none ${
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
                                        <div className="flex justify-end mt-4">
                                            <button
                                                className="btn btn-primary text-lg"
                                                type="submit"
                                                // disabled={error !== "" ? true : false}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn text-lg ml-2"
                                                type="submit"
                                                onClick={() => navigate("/my-courses")}
                                                // disabled={error !== "" ? true : false}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>

                        <div className="flex-1 p-4 flex flex-col border border-dashed border-black rounded-lg m-4">
                            <div className="flex flex-col gap-4 tablet:flex-row tablet:justify-between">
                                <input
                                    type="text"
                                    className="px-2 py-2 rounded-lg border-[1px] outline-none flex-1 max-w-2xl"
                                    placeholder="Name's section"
                                    value={section}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setSection(e.target.value);
                                    }}
                                />
                                <button className="btn btn-primary text-lg flex-2" onClick={handleAddSection}>
                                    Add section
                                </button>
                            </div>
                            {/* handle list lesson */}
                            <div className="mt-2">
                                {sectionOfCourse.length <= 0 ? (
                                    <h1 className="text-center text-2xl text-error">There are no sections yet!</h1>
                                ) : (
                                    sectionOfCourse.map((section, index) => (
                                        <Accordion
                                            key={index}
                                            section={section}
                                            handleDeleteSection={handleDeleteSection}
                                            handleDisplayEditModal={handleDisplayEditModal}
                                            handleDisplayDeleteModal={handleDisplayDeleteModal}
                                            handleDisplayAddSectionModal={handleDisplayAddSectionModal}
                                            isDisplayBtn={true}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    {/* POPUP DELETE */}
                    {isDisplayDeleteModal && (
                        <DeleteModal handleDelete={handleDeleteSection} handleCancel={handleCancelModal} />
                    )}
                    {/* POPUP EDIT */}
                    {isDisplayEditModal && (
                        <div className="fixed z-50 w-full h-full top-0 bottom-0 bg-black/50 flex justify-center items-center shadow-lg">
                            <div className="bg-[#F8FFF8] p-4 w-[400px] flex flex-col items-center justify-center rounded-lg ">
                                <h1 className="text-3xl mb-1 font-bold text-center text-title">EDIT SECTION</h1>

                                <form className="flex flex-col gap-1 w-full">
                                    <div className="text-sm mb-1 tablet:text-xl font-medium">Section title</div>
                                    <input
                                        type="text"
                                        value={itemTitle}
                                        className="px-2 py-4 rounded-lg border-[1px] outline-none max-w-lg"
                                        onChange={(e) => setItemTitle(e.target.value)}
                                    />
                                </form>
                                <div className="mt-2 flex justify-end w-full">
                                    <button
                                        className="btn btn-primary text-lg"
                                        onClick={() => handleEditSection(idItem, itemTitle)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn text-lg ml-2"
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
