import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { courseActions } from "@redux/slice";
import { Category } from "../types/course";

const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const categoriesList: Category[] = useAppSelector((state) => state.courseSlice.categories) ?? [];

    useEffect(() => {
        // @ts-ignore
        dispatch(courseActions.getCategories());
    }, [dispatch]);

    return (
        <>
            <div className="w-full h-[80px] bg-backgroundHover mt-[100px] flex items-center justify-center">
                <ul className="px-20 grid grid-cols-4 overflow-hidden mx-auto">
                    {categoriesList.length > 0 &&
                        categoriesList.map((category, index) => {
                            return (
                                <li
                                    key={category.id}
                                    className="hover:bg-primary text-lg font-medium text-center cursor-pointer px-6 py-[26px]"
                                >
                                    {category.title}
                                </li>
                            );
                        })}
                </ul>
            </div>
        </>
    );
};

export default Navbar;
