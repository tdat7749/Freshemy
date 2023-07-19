import React, { useEffect, useState } from "react";
import SearchIcon from "../components/icons/SearchIcon";
import CreateIcon from "../components/icons/CreateIcon";
import { Link, useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { courseAction } from "../redux/slice";
import { Course } from "../types/course";

const MyCourses: React.FC = () => {
    const [userInput, setUserInput] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");
    const [pageIndex, setPageIndex] = useState<number>(1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    let courseList: Course[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    let totalPage: number = useAppSelector((state) => state.courseSlice.totalPage) ?? 1;

    useEffect(() => {
        // @ts-ignore
        dispatch(courseAction.getMyCourses({ pageIndex, keyword }));
    }, [dispatch, keyword, pageIndex]);

    // handle pagination
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };

    // handle search input
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setKeyword(userInput);
    };

    const handleEditCourse = (slug: string) => {
        navigate(`/my-courses/edit/${slug}`);
    };

    const handleDeleteCourse = (courseId: number) => {
        //@ts-ignore
        dispatch(courseAction.deleteCourse({ courseId })).then((response) => {
            if (response.payload.status_code === 200) {
                dispatch(courseAction.setDeleteCourse(courseId));
            }
        });
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen h-full container px-4 m-auto">
                <h1 className="text-center text-[32px] mt-11 mb-5">MY COURSE</h1>
                <div className="w-full flex justify-between items-center shrink-0">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search for anything"
                                className="rounded-full py-4 px-10 w-[70%] border-[1px] border-black"
                                value={userInput}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleKeyWordSearch();
                                }}
                            />
                            <div className="cursor-pointer" onClick={handleKeyWordSearch}>
                                <SearchIcon />
                            </div>
                        </div>
                    </div>
                    <div className="flex-3 flex py-4 px-4 bg-switch rounded-lg text-white hover:opacity-80">
                        <CreateIcon />
                        <Link to={"/create-course"} className="ml-2">
                            Create New
                        </Link>
                    </div>
                </div>
                {courseList.map((course) => {
                    return (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            thumbnail={course.thumbnail}
                            slug={course.slug}
                            title={course.title}
                            summary={course.summary}
                            author={course.author}
                            handleDeleteCourse={handleDeleteCourse}
                            handleEditCourse={handleEditCourse}
                        />
                    );
                })}
                <div className="flex justify-end my-4">
                    <Pagination
                        handleChangePageIndex={handleChangePageIndex}
                        totalPage={totalPage}
                        currentPage={pageIndex}
                    />
                </div>
            </div>
        </>
    );
};

export default MyCourses;
