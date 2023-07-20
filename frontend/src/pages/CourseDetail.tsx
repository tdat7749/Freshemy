import React, { useEffect } from "react";

import Navbar from "../components/Navbar";
import Accordion from "../components/Accordion";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useParams } from "react-router-dom";
import { courseAction } from "../redux/slice";
import { Section } from "../types/section";
import { CourseDetail as CourseDetailType} from "../types/course";
// import { useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../hooks/hooks";

const CourseDetail: React.FC = () => {
    let { slug } = useParams();
    const dispatch = useAppDispatch();

    const courseDetail:CourseDetailType = useAppSelector(state => state.courseSlice.courseDetail) ?? {}



    useEffect(() => {
        // @ts-ignore
        dispatch(courseAction.getCourseDetail(slug))
    }, [dispatch, slug])
    return (
        <>
            <Navbar />
            <div className="min-h-screen h-full container px-4 m-auto">
                <div>
                    <div className="description">
                        <h2 className="text-[32px]">Description</h2>
                        <span className="w-[60px] h-1 bg-black block"></span>
                        <p>{courseDetail.description}</p>
                    </div>

                    <div className="table-of-content">
                        <h2 className="text-[32px]">Table of Content</h2>
                        <span className="w-[60px] h-1 bg-black block mb-4"></span>
                        {courseDetail.sections.map((section: Section, index:number) => {
                            return <Accordion key={index} isDisplayBtn={false} section={section} />;
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
