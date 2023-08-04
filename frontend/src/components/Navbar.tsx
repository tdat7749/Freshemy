import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { courseActions } from "@redux/slice";
import { Category } from "../types/course";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const categoriesList: Category[] = useAppSelector((state) => state.courseSlice.categories) ?? [];

    useEffect(() => {
        // @ts-ignore
        dispatch(courseActions.getCategories());
    }, [dispatch]);

    return (
        <>
            <div className="hidden w-full h-[80px] bg-backgroundHover mt-[100px] laptop:flex">
                <ul className="min-w-fit px-20 flex justify-center mx-auto">
                    {categoriesList.length > 0 &&
                        categoriesList.map((category, index) => {
                            return (
                                <Link key={category.id} to={`/all-courses?category=${category.id}`}>
                                    <li
                                        key={category.id}
                                        className="hover:bg-primary text-lg font-medium text-center cursor-pointer px-6 py-[26px] min-w-fit"
                                    >
                                        {category.title}
                                    </li>
                                </Link>
                            );
                        })}
                </ul>
            </div>
        </>
    );
};

export default Navbar;
