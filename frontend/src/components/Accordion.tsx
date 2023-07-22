import React, { useState } from "react";
import { Section } from "../types/section";
import AddIcon from "./icons/AddIcon";
import DeleteIcon from "./icons/DeleteIcon";
import EditSectionIcon from "./icons/EditSectionIcon";
// import { useAppSelector } from "../hooks/hooks";
// import { Lesson } from "../types/lesson";

type AccordionType = {
    section: Section;
    handleDisplayAddSectionModal?: (id: number) => void;
    isDisplayBtn: boolean;
    handleDeleteSection?: (id: number) => void;
    handleDisplayDeleteModal?: (id: number) => void;
    handleDisplayEditModal?: (id: number, title: string) => void;
};

const Accordion: React.FC<AccordionType> = (props) => {
    const [show, setShow] = useState<boolean>(false);

    return (
        <>
            <div>
                <h2 id="accordion-collapse-heading-1">
                    <div className="flex items-center justify-between w-full p-4 bg-primary rounded-lg my-1 ">
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
                        {props.isDisplayBtn && (
                            <div className="flex gap-2">
                                <div className="cursor-pointer" onClick={() => {
                                    if (props.handleDisplayAddSectionModal) {
                                        props.handleDisplayAddSectionModal(props.section.id);
                                    }
                                }} >
                                    <AddIcon />
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayEditModal) {
                                            props.handleDisplayEditModal(props.section.id, props.section.title);
                                        }
                                    }}
                                >
                                    <EditSectionIcon />
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayDeleteModal) {
                                            props.handleDisplayDeleteModal(props.section.id);
                                        }
                                    }}
                                >
                                    <DeleteIcon />
                                </div>
                            </div>
                        )}
                    </div>
                </h2>
            </div>
            {show &&
                props.section.lessons &&
                props.section?.lessons.map((lesson, index) => (
                    <div className="py-4 pl-8 border rounded-lg my-2" key={index}>
                        <p>{lesson.title}</p>
                    </div>
                ))}
        </>
    );
};

export default Accordion;
