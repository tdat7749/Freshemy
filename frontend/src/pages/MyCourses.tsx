import React, { useEffect } from "react";
import SearchIcon from "../components/icons/SearchIcon";
import CreateIcon from "../components/icons/CreateIcon";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { courseAction } from "../redux/slice";
import { Course, getMyCourses as getMyCoursesType } from "../types/course";

const MyCourses: React.FC = () => {
    const dispatch = useAppDispatch();
    let courseList:Course[] = useAppSelector((state) => state.courseSlice.course) ?? "";

    console.log("Courselist", courseList);

    const initialValue: getMyCoursesType = {
        page_index: 1,
        keyword: "",
    };

    useEffect(() => {
        // @ts-ignore
        dispatch(courseAction.getMyCourses(initialValue));
    }, [dispatch]);

    return (
        <>
            <Navbar />
            <div className="h-full container px-4 m-auto">
                <h1 className="text-center text-[32px] mt-11 mb-5">MY COURSE</h1>
                <div className="w-full flex justify-between items-center shrink-0">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for anything"
                                className="rounded-full py-4 px-10 w-[70%] border-[1px] border-black"
                            />
                            <SearchIcon />
                        </div>
                    </div>
                    <div className="flex-3 flex py-4 px-4 bg-switch rounded-lg text-white hover:opacity-80">
                        <CreateIcon />
                        <Link to={"/create-course"}>
                            <button className="ml-2">Create New</button>
                        </Link>
                    </div>
                </div>
                <CourseCard
                    id={1}
                    title="Khóa học MYSQL dành cho newbie"
                    summary="Đây là khóa học rẻ chưa từng có"
                    author="Dương Song"
                />
                <CourseCard
                    id={2}
                    title="Khóa học MYSQL dành cho newbie"
                    summary="Đây là khóa học rẻ chưa từng có"
                    author="Dương Song"
                />
                <CourseCard
                    id={3}
                    title="Khóa học MYSQL dành cho newbie"
                    summary="Đây là khóa học rẻ chưa từng có"
                    author="Dương Song"
                />
                <CourseCard
                    id={4}
                    title="Khóa học MYSQL dành cho newbie"
                    summary="Đây là khóa học rẻ chưa từng có"
                    author="Dương Song"
                />
                <CourseCard
                    id={5}
                    title="Khóa học MYSQL dành cho newbie"
                    summary="Đây là khóa học rẻ chưa từng có"
                    author="Dương Song"
                />
                <div className="flex justify-end my-4">
                    <Pagination />
                </div>
            </div>
        </>
    );
};

export default MyCourses;
