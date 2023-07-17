import React from "react";
import SearchIcon from "../components/icons/SearchIcon";
import CreateIcon from "../components/icons/CreateIcon";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";

const MyCourses: React.FC = () => {
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
                    title="Khóa học MYSQL dành cho newbie"
                    summary="Đây là khóa học rẻ chưa từng có"
                    author="Dương Song"
                />
                <CourseCard
                    title="Khóa học MYSQL dành cho newbie"
                    summary="Đây là khóa học rẻ chưa từng có"
                    author="Dương Song"
                />
                <CourseCard
                    title="Khóa học MYSQL dành cho newbie"
                    summary="Đây là khóa học rẻ chưa từng có"
                    author="Dương Song"
                />
                <CourseCard
                    title="Khóa học MYSQL dành cho newbie"
                    summary="Đây là khóa học rẻ chưa từng có"
                    author="Dương Song"
                />
                <CourseCard
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
