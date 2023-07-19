import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Formik, ErrorMessage, Field, Form } from "formik";
import { editCourseValidationSchema } from "../validations/course";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { sectionActions } from "../redux/slice";
import { useParams } from "react-router-dom";
import Accordion from "../components/Accordion";
import { AddSection as AddSectionType, Section } from "../types/section";
import DeleteModal from "../components/DeleteModal";

const EditCourse: React.FC = () => {
    const [section, setSection] = useState<string>("");
    const [isDisplayDeleteModal, setIsDisplayDeleteModal] = useState<boolean>(false);
    const [isDisplayEditModal, setIsDisplayEditModal] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const [itemTitle, setItemTitle] = useState<string>("");

    const sectionLists: Section[] = useAppSelector((state) => state.sectionSlice.sectionList) ?? [];

    let { course_id } = useParams();

    const initialValue = {
        title: "",
        summary: "",
        category: "",
        status: "",
        description: "",
    };

    const dispatch = useAppDispatch();

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
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
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
                dispatch(sectionActions.setDeleteSection(idItem));
            }
        });
        setIsDisplayEditModal(!isDisplayEditModal);
    };

    const handleCancelModal = () => {
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleDisplayEditModal = (id: number, title: string) => {
        setIdItem(id);
        setItemTitle(title);
        setIsDisplayEditModal(!isDisplayEditModal);
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
                                        <div className="flex-1 flex flex-col">
                                            <label htmlFor="category" className="text-lg mb-1 tablet:text-xl">
                                                Category
                                            </label>
                                            <Field
                                                as="select"
                                                name="category"
                                                className={`px-2 py-[21px] rounded-lg border-[1px] outline-none ${
                                                    formik.errors.category && formik.touched.category
                                                        ? "border-error"
                                                        : ""
                                                }`}
                                            >
                                                <option disabled value="">
                                                    Select category
                                                </option>
                                                <option value={"nodejs"}>Nodejs</option>
                                                <option value={"nodejs"}>Nodejs</option>
                                                <option value={"nodejs"}>Nodejs</option>
                                                <option value={"nodejs"}>Nodejs</option>
                                            </Field>
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label htmlFor="status" className="text-lg mb-1 tablet:text-xl">
                                                Status
                                            </label>
                                            <Field
                                                as="select"
                                                name="status"
                                                className={`px-2 py-[21px] rounded-lg border-[1px] outline-none${
                                                    formik.errors.status && formik.touched.status ? "border-error" : ""
                                                }`}
                                            >
                                                <option disabled value="">
                                                    Select status
                                                </option>
                                                <option value={"complete"}>Complete</option>
                                                <option value={"uncomplete"}>Uncomplete</option>
                                            </Field>
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
                        <div className="flex flex-col gap-1 w-full">
                            <div className="">Title</div>
                            <input
                                type="text"
                                value={itemTitle}
                                className="px-2 py-[14px] rounded-lg border-[1px] outline-none flex-1"
                                onChange={(e) => setItemTitle(e.target.value)}
                            />
                        </div>
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
        </>
    );
};

export default EditCourse;
