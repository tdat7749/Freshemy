import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
// import CourseCard from "./CourseCard";
import { CourseCard, Pagination } from "@src/components";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Category, Course, SelectCourse } from "../../types/course";
import { courseActions } from "@redux/slice";
import { eveluateList, sortingBy } from "../../utils/helper";
import useQueryParams from "../../hooks/useQueryParams";
import { User } from "../../types/user";

const AllCourses: React.FC = () => {
    const { keyword, rating } = useQueryParams();

    const [evaluate, setEvaluate] = useState<number | undefined>(Number(rating));
    const [categories, setCategories] = useState<string[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);

    const dispatch = useAppDispatch();

    let courseList: Course[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    let totalPage: number = useAppSelector((state) => state.courseSlice.totalPage) ?? 1;
    let totalRecord: number = useAppSelector((state) => state.courseSlice.totalRecord) ?? 1;
    const categoriesList: Category[] = useAppSelector((state) => state.courseSlice.categories) ?? [];

    const handleSingleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setCategories((pre) => [...pre, value]);
        } else {
            setCategories((pre) => [...pre.filter((category) => category !== value)]);
        }
    };

    // HANDLE FILTER BTN CLICK
    const handleFilterCourse = () => {
        console.log("filter");
        const query: SelectCourse = {
            pageIndex: pageIndex,
            keyword: keyword as string,
            rating: evaluate,
            category: categories,
        };
        // @ts-ignore
        dispatch(courseActions.selectCourses(query));
    };

    // HANDLE SORTING BTN CLICK
    const handleSortingCourse = (sortBy: string) => {
        console.log("sorting");
        const query: SelectCourse = {
            pageIndex: pageIndex,
            keyword: keyword as string,
            rating: evaluate,
            sortBy: sortBy,
            category: categories,
        };
        // @ts-ignore
        dispatch(courseActions.selectCourses(query));
    };

    useEffect(() => {
        console.log("effect");
        // @ts-ignore
        dispatch(courseActions.getCategories());

        const query: SelectCourse = {
            pageIndex: pageIndex,
            keyword: keyword,
        };
        // @ts-ignore
        dispatch(courseActions.selectCourses(query));
        setPageIndex(1);
    }, [dispatch, keyword, pageIndex]);

    const handleChangePageIndex = () => {};
    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 mt-[100px] laptop:mt-0">
                <div className="">
                    <h1 className="text-2xl">{totalRecord} results have been found </h1>
                    <div className="flex flex-col gap-4 laptop:flex-row">
                        <div className="w-full tablet:w-[300px] mt-4">
                            <div className="">
                                <button className="btn btn-secondary text-lg mr-4" onClick={handleFilterCourse}>
                                    Filter
                                </button>
                                <div className="dropdown dropdown-bottom">
                                    <label
                                        tabIndex={0}
                                        className="btn btn-outline hover:bg-backgroundHover hover:text-black text-lg m-1"
                                    >
                                        Sorting by
                                    </label>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box min-w-[150px]"
                                    >
                                        {sortingBy.map((item, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className="p-2 hover:bg-backgroundHover rounded-lg cursor-pointer"
                                                    onClick={() => handleSortingCourse(item.value)}
                                                >
                                                    {item.title}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-3">
                                <h2 className="text-2xl font-bold mb-2">Evaluate</h2>
                                {eveluateList.map((evaluateItem, index) => {
                                    return (
                                        <div className="flex items-center gap-2 mb-1" key={index}>
                                            <input
                                                type="radio"
                                                className="radio radio-info"
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setEvaluate(Number(event.target.value));
                                                }}
                                                name="evaluate"
                                                value={evaluateItem.value}
                                                id={evaluateItem.title}
                                                checked={evaluate === evaluateItem.value}
                                            />
                                            <span className="text-xl">{evaluateItem.title}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="hidden tablet:flex divider"></div>
                            <div className="mt-3">
                                <h2 className="text-2xl font-bold mb-2">Category</h2>
                                <div className="grid grid-cols-2 laptop:grid-cols-1">
                                    {categoriesList.length > 0 &&
                                        categoriesList.map((category) => {
                                            return (
                                                <div className="flex items-center gap-2 mb-1" key={category.id}>
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-info"
                                                        name={category.title}
                                                        value={category.title}
                                                        onChange={handleSingleCategoryChange}
                                                    />
                                                    <span className="text-xl">{category.title}</span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 gap-3">
                            {courseList.map((course) => (
                                <div className="w-full max-w-xs tablet:max-w-full place-self-center">
                                    <CourseCard
                                        key={course.id}
                                        id={course.id}
                                        title={course.title}
                                        thumbnail={course.thumbnail}
                                        rating={course.rating}
                                        status={course.status}
                                        numberOfSection={course.number_section}
                                        slug={course.slug}
                                        summary={course.summary}
                                        author={course.author as User}
                                        isEditCourse={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {courseList.length > 0 ? (
                    <div className="flex justify-end my-4">
                        <Pagination
                            handleChangePageIndex={handleChangePageIndex}
                            totalPage={totalPage}
                            currentPage={pageIndex}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};

export default AllCourses;
