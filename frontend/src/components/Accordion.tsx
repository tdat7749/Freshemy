import React, { useState } from "react";
import { Section } from "../types/section";
import AddIcon from "./icons/AddIcon";
import DeleteIcon from "./icons/DeleteIcon";
import EditSectionIcon from "./icons/EditSectionIcon";
// import { useAppSelector } from "../hooks/hooks";
// import { Lesson } from "../types/lesson";

type AccordionType = {
    section: Section;
    handleDeleteSection: (id: number) => void;
    handleDisplayDeleteModal: (id: number) => void;
    handleDisplayEditModal: (id: number, title: string) => void;
};

const Accordion: React.FC<AccordionType> = (props) => {
    const [show, setShow] = useState<boolean>(false);

    // const lessonList: Lesson[] = useAppSelector((state) => state.lessonSlice.lessontionList) ?? [];

    return (
        <>
            <div>
                <h2 id="accordion-collapse-heading-1">
                    <div className="flex items-center justify-between w-full p-4 bg-[#E9995C] rounded-lg mb-1 ">
                        <div className="flex gap-2 items-center cursor-pointer" onClick={() => setShow(!show)}>
                            <svg
                                className={`w-3 h-3 ${show ? "rotate-180" : ""} shrink-0`}
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
                            <span>{props.section.title}</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="cursor-pointer">
                                <AddIcon />
                            </div>
                            <div
                                className="cursor-pointer"
                                onClick={() => props.handleDisplayEditModal(props.section.id, props.section.title)}
                            >
                                <EditSectionIcon />
                            </div>
                            <div
                                className="cursor-pointer"
                                onClick={() => props.handleDisplayDeleteModal(props.section.id)}
                            >
                                <DeleteIcon />
                            </div>
                        </div>
                    </div>
                </h2>
            </div>
            {/* {show &&
                lessonList.map((lesson, index) => (
                    <div className="p-4 border rounded-lg" key={index}>
                        <p>{lesson}</p>
                    </div>
                ))} */}
        </>
    );
};

export default Accordion;
