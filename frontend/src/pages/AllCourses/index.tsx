import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { CourseCard, Pagination } from "@src/components";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Category, Course, SelectCourse } from "../../types/course";
import { courseActions } from "@redux/slice";
import { eveluateList, sortingBy } from "../../utils/helper";
import useQueryParams from "../../hooks/useQueryParams";
import { User } from "../../types/user";
import { useNavigate } from "react-router-dom";
import i18n from "../../utils/i18next";

const AllCourses: React.FC = () => {
    const { keyword, rating, category } = useQueryParams();

    let categoryQuery = category;

    if (typeof categoryQuery === "string") {
        categoryQuery = [Number(category)];
    } else if (typeof categoryQuery === "object") {
        categoryQuery = category.map((cate: string) => Number(cate));
    } else {
        categoryQuery = [];
    }

    const [evaluate, setEvaluate] = useState<number | undefined>(Number(rating));
    const [pageIndex, setPageIndex] = useState<number>(Number(i18n.t("PAGE_INDEX.FIRST_PAGE")));
    const [sortBy, setSortBy] = useState<string>("");
    const [categoryChecked, setCategoryChecked] = useState<number[]>(categoryQuery);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    let courseList: Course[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    let totalPage: number =
        useAppSelector((state) => state.courseSlice.totalPage) ?? Number(i18n.t("PAGE_INDEX.FIRST_PAGE"));
    const categoriesList: Category[] = useAppSelector((state) => state.courseSlice.categories) ?? [];

    const handleSingleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>, categoryId: number) => {
        const { value, checked } = event.target;

        if (checked) {
            setCategoryChecked((pre) => [...pre, categoryId]);
        } else {
            setCategoryChecked((pre) => [...pre.filter((cate) => cate !== Number(value))]);
        }
    };

    // HANDLE FILTER BTN CLICK
    const handleFilterCourse = () => {
        const query: SelectCourse = {
            pageIndex: pageIndex,
            keyword: keyword as string,
            sortBy: sortBy,
            rating: evaluate,
            category: categoryChecked,
        };
        // @ts-ignore
        dispatch(courseActions.selectCourses(query));
    };

    // HANDLE SORTING BTN CLICK
    const handleSortingCourse = (sortBy: string) => {
        setSortBy(sortBy);
    };

    // HANDLE RESET BTN CLICK
    const handleResetFilter = () => {
        setEvaluate(undefined);
        setCategoryChecked([]);
        navigate("/all-courses", { replace: true });
        const query: SelectCourse = {
            pageIndex: Number(i18n.t("PAGE_INDEX.FIRST_PAGE")),
        };
        // @ts-ignore
        dispatch(courseActions.selectCourses(query));
    };

    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < Number(i18n.t("PAGE_INDEX.FIRST_PAGE"))) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(Number(i18n.t("PAGE_INDEX.FIRST_PAGE")));
        else {
            setPageIndex(pageIndex);
        }
    };

    useEffect(() => {
        setCategoryChecked(categoryQuery);
    }, [JSON.stringify(categoryQuery)]);

    useEffect(() => {
        // @ts-ignore
        dispatch(courseActions.getCategories());

        const query: SelectCourse = {
            pageIndex: pageIndex,
            keyword: keyword,
            sortBy: sortBy,
            rating: evaluate,
            category: categoryChecked,
        };

        // @ts-ignore
        dispatch(courseActions.selectCourses(query));
    }, [dispatch, keyword, pageIndex, sortBy]);

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 mt-[100px] laptop:mt-0">
                <div className="">
                    <div className="flex flex-col gap-4 laptop:flex-row">
                        <div className="w-full laptop:w-[250px]">
                            <div className="">
                                <button className="btn btn-secondary text-lg mr-1" onClick={handleFilterCourse}>
                                    Filter
                                </button>
                                <div className="dropdown dropdown-bottom mr-1">
                                    <label
                                        tabIndex={0}
                                        className="btn btn-secondary hover:bg-backgroundHover hover:text-black text-lg m-1"
                                    >
                                        Sort by
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
                                <button className="btn btn-outline text-lg" onClick={handleResetFilter}>
                                    Reset
                                </button>
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
                            <div className="hidden tablet:flex divider my-1"></div>
                            <div className="">
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
                                                        value={category.id}
                                                        checked={categoryChecked.includes(category.id)}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleSingleCategoryChange(event, category.id)
                                                        }
                                                    />
                                                    <span className="text-xl">{category.title}</span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                        <div className="border-t-[1px] laptop:border-l-[1px] laptop:border-t-0">
                            {courseList.length === Number(i18n.t("COURSES_LENGTH.EMPTY")) && (
                                <p className="text-error text-2xl ml-3">Don't have any course yet!</p>
                            )}
                            {courseList.length >= Number(i18n.t("COURSES_LENGTH.ONLY_ONE")) && (
                                <p className="text-2xl ml-3 font-medium">
                                    {courseList.length} result(s) have been found
                                </p>
                            )}
                            <div className="flex-1 grid grid-cols-1 pl-3">
                                {courseList.length > Number(i18n.t("COURSES_LENGTH.EMPTY")) &&
                                    courseList.map((course, index) => (
                                        <div
                                            className="w-full max-w-xs tablet:max-w-full place-self-center laptop:place-self-start"
                                            key={index}
                                        >
                                            <CourseCard
                                                id={course.id}
                                                title={course.title}
                                                thumbnail={course.thumbnail}
                                                rating={course.rating}
                                                status={course.status}
                                                slug={course.slug}
                                                summary={course.summary}
                                                attendees={course.attendees}
                                                numberOfSection={course.number_section}
                                                author={course.author as User}
                                                isEditCourse={false}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
                {totalPage > Number(i18n.t("PAGE_INDEX.FIRST_PAGE")) && (
                    <div className="flex justify-end my-4">
                        <Pagination
                            handleChangePageIndex={handleChangePageIndex}
                            totalPage={totalPage}
                            currentPage={pageIndex}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default AllCourses;
