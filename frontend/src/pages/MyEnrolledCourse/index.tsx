import React, { useEffect, useState } from "react";
import SearchIcon from "@src/components/icons/SearchIcon";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions } from "@redux/slice";
import { Course } from "../../types/course";
import { Spin, Navbar, Pagination, CourseCard } from "@src/components";

const MyEnrolledCourses: React.FC = () => {
    const [userInput, setUserInput] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");
    const [pageIndex, setPageIndex] = useState<number>(1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    let courseList: Course[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    let totalPage: number = useAppSelector((state) => state.courseSlice.totalPage) ?? 1;

    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);

    useEffect(() => {
        // @ts-ignore
        dispatch(courseActions.getEnrolledCourses({ pageIndex, keyword }));
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
        setUserInput("");
    };

    return (
        <>
            {isGetLoading && <Spin />}
            <Navbar />
            <div className="container mx-auto">
                <div className="px-4 tablet:px-[60px]">
                    <h1 className="text-center text-[32px] py-4 font-bold text-title">MY ENROLLED COURSE</h1>

                    <div className="flex justify-center items-center shrink-0">
                        <div className="relative w-1/2">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search your enrolled course"
                                className="rounded-full py-4 px-10 w-full border-[1px] border-black"
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

                    {courseList.map((course) => {
                        return (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                thumbnail={course.thumbnail}
                                slug={course.slug}
                                title={course.title}
                                summary={course.summary}
                                author={course.author as string}
                            />
                        );
                    })}
                    {courseList.length > 0 ? (
                        <div className="flex justify-end my-4">
                            <Pagination
                                handleChangePageIndex={handleChangePageIndex}
                                totalPage={totalPage}
                                currentPage={pageIndex}
                            />
                        </div>
                    ) : (
                        <p className="mt-4 text-2xl text-error text-center font-bold">
                            You don't have any enrolled courses!
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyEnrolledCourses;
