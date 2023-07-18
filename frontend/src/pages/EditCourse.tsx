import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Formik, ErrorMessage, Field, Form } from "formik";
import { editCourseValidationSchema } from "../validations/course";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { sectionActions } from "../redux/slice";
import { useParams } from "react-router-dom";

const EditCourse: React.FC = () => {
    const [section, setSection] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const sectionLists: string[] = useAppSelector((state) => state.sectionSlice.sectionList) ?? [];

    let { course_id } = useParams();

    const initialValue = {
        title: "",
        summary: "",
        category: "",
        status: "",
        description: "",
    };

    const dispatch = useAppDispatch();

    const handleOnSubmit = () => {};

    const handleAddSection = () => {
        const values = {
            course_id: Number(course_id),
            title: section,
        };
        // @ts-ignore
        dispatch(sectionActions.addSection(values));
    };

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
                    {sectionLists.map((section, index) => (
                        <button key={index} onClick={() => setShow(!show)}>
                            {section}
                        </button>
                    ))}
                    {/* POPUP */}
                </div>
                {/* <div id="accordion-collapse" data-accordion="open">
                    <h2 id="accordion-collapse-heading-1">
                        <button
                            type="button"
                            className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            data-accordion-target="#accordion-collapse-body-1"
                            aria-expanded="true"
                            aria-controls="accordion-collapse-body-1"
                        >
                            <span>What is Flowbite?</span>
                            <svg
                                data-accordion-icon=""
                                className="w-3 h-3 rotate-180 shrink-0"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5 5 1 1 5"
                                />
                            </svg>
                        </button>
                    </h2>
                    <div
                        id="accordion-collapse-body-1"
                        className="hidden"
                        aria-labelledby="accordion-collapse-heading-1"
                    >
                        <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                Flowbite is an open-source library of interactive components built on top of Tailwind
                                CSS including buttons, dropdowns, modals, navbars, and more.
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                                Check out this guide to learn how to{" "}
                                <a
                                    href="/docs/getting-started/introduction/"
                                    className="text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    get started
                                </a>{" "}
                                and start developing websites even faster with components on top of Tailwind CSS.
                            </p>
                        </div>
                    </div>
                    <h2 id="accordion-collapse-heading-2">
                        <button
                            type="button"
                            className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            data-accordion-target="#accordion-collapse-body-2"
                            aria-expanded="false"
                            aria-controls="accordion-collapse-body-2"
                        >
                            <span>Is there a Figma file available?</span>
                            <svg
                                data-accordion-icon=""
                                className="w-3 h-3 rotate-180 shrink-0"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5 5 1 1 5"
                                />
                            </svg>
                        </button>
                    </h2>
                    <div
                        id="accordion-collapse-body-2"
                        className="hidden"
                        aria-labelledby="accordion-collapse-heading-2"
                    >
                        <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                Flowbite is first conceptualized and designed using the Figma software so everything you
                                see in the library has a design equivalent in our Figma file.
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                                Check out the{" "}
                                <a
                                    href="https://flowbite.com/figma/"
                                    className="text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    Figma design system
                                </a>{" "}
                                based on the utility classes from Tailwind CSS and components from Flowbite.
                            </p>
                        </div>
                    </div>
                    <h2 id="accordion-collapse-heading-3">
                        <button
                            type="button"
                            className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            data-accordion-target="#accordion-collapse-body-3"
                            aria-expanded="false"
                            aria-controls="accordion-collapse-body-3"
                        >
                            <span>What are the differences between Flowbite and Tailwind UI?</span>
                            <svg
                                data-accordion-icon=""
                                className="w-3 h-3 rotate-180 shrink-0"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5 5 1 1 5"
                                />
                            </svg>
                        </button>
                    </h2>
                    <div
                        id="accordion-collapse-body-3"
                        className="hidden"
                        aria-labelledby="accordion-collapse-heading-3"
                    >
                        <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                The main difference is that the core components from Flowbite are open source under the
                                MIT license, whereas Tailwind UI is a paid product. Another difference is that Flowbite
                                relies on smaller and standalone components, whereas Tailwind UI offers sections of
                                pages.
                            </p>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                However, we actually recommend using both Flowbite, Flowbite Pro, and even Tailwind UI
                                as there is no technical reason stopping you from using the best of two worlds.
                            </p>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                Learn more about these technologies:
                            </p>
                            <ul className="pl-5 text-gray-500 list-disc dark:text-gray-400">
                                <li>
                                    <a
                                        href="https://flowbite.com/pro/"
                                        className="text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        Flowbite Pro
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://tailwindui.com/"
                                        rel="nofollow"
                                        className="text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        Tailwind UI
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default EditCourse;
