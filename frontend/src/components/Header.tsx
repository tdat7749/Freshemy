import React, { useEffect, useState } from "react";
import Logo from "../assets/images/logo.png";
import UserDropDown from "./UserDropDown";
import SearchIcon from "./icons/SearchIcon";
import DefaultAvatar from "../assets/images/default-avatar.png";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Category } from "../types/course";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { courseActions } from "@redux/slice";
interface HeaderProps {
    isLogin: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLogin }) => {
    const [keyword, setKeyword] = useState<string>("");
    const [isDisplayUserDrawer, setIsDisplayUserDrawer] = useState<boolean>(false);
    const [isDisplayCategoryDrawer, setIsDisplayCategoryDrawer] = useState<boolean>(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const categoriesList: Category[] = useAppSelector((state) => state.courseSlice.categories) ?? [];

    const handleKeyWordSearch = () => {
        navigate(`/all-courses?keyword=${keyword}`);
        setKeyword("");
    };

    useEffect(() => {
        // @ts-ignore
        dispatch(courseActions.getCategories());
    }, [dispatch]);

    return (
        <>
            <header className="w-full h-[100px] max-w-full bg-background shadow-sm fixed top-0 left-0 z-[10]">
                <Toaster />
                <div className="w-full h-full flex items-center py-[10px] px-4 tablet:px-[60px]">
                    <div className="flex-1 flex gap-4 laptop:gap-[120px] items-center">
                        <Link to={"/"} className="w-[60px] h-[60px] shrink-0">
                            <img src={Logo} alt="Logo" />
                        </Link>
                        <div className="laptop:hidden drawer">
                            <input
                                id="my-drawer"
                                type="checkbox"
                                className="drawer-toggle"
                                checked={isDisplayCategoryDrawer}
                                onChange={() => setIsDisplayCategoryDrawer(!isDisplayCategoryDrawer)}
                            />
                            <div className="drawer-content">
                                <label htmlFor="my-drawer" className="font-medium hover:opacity-80 drawer-button">
                                    Categories
                                </label>
                            </div>
                            <div className="drawer-side">
                                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                                <ul className="menu p-4 w-80 h-full bg-white text-base-content">
                                    {categoriesList.length > 0 &&
                                        categoriesList.map((category) => {
                                            return (
                                                <li
                                                    onClick={() => setIsDisplayCategoryDrawer(!isDisplayCategoryDrawer)}
                                                    key={category.id}
                                                    className="hover:bg-backgroundHover text-lg font-medium text-center cursor-pointer px-6 py-4 laptop:py-[26px] min-w-fit rounded-lg"
                                                >
                                                    {category.title}
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>
                        </div>
                        <div className="hidden relative laptop:block flex-1">
                            <input
                                type="text"
                                placeholder="Search for anything"
                                className="rounded-full py-4 px-10 w-[70%] max-w-[700px] border-[1px] border-black"
                                value={keyword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleKeyWordSearch();
                                }}
                            />
                            <div className="cursor-pointer" onClick={handleKeyWordSearch}>
                                <SearchIcon />
                            </div>
                        </div>
                    </div>
                    {isLogin ? (
                        <>
                            <div className="ml-auto flex shrink-0 items-center">
                                <Link
                                    to={"/all-courses"}
                                    className="hidden tablet:block min-w-fit mr-5 font-medium hover:opacity-80 cursor-pointer"
                                >
                                    All Courses
                                </Link>
                                <Link
                                    to={"/my-enrolled-courses"}
                                    className="hidden tablet:block min-w-fit mr-5 font-medium hover:opacity-80 cursor-pointer"
                                >
                                    Enroll Course
                                </Link>
                                <Link
                                    to={"/my-courses"}
                                    className="hidden tablet:block min-w-fit mr-5 font-medium hover:opacity-80 cursor-pointer"
                                >
                                    My Courses
                                </Link>
                                {/* DRAWER AVATAR */}
                                <div className="drawer drawer-end">
                                    <input
                                        id="user-drawer"
                                        type="checkbox"
                                        className="drawer-toggle"
                                        checked={isDisplayUserDrawer}
                                        onChange={() => setIsDisplayUserDrawer(!isDisplayUserDrawer)}
                                    />
                                    <div className="drawer-content">
                                        <label
                                            data-dropdown-toggle="dropdown"
                                            htmlFor="user-drawer"
                                            className="w-[60px] h-[60px] rounded-full flex items-center justify-center relative border-[1px] hover:cursor-pointer"
                                        >
                                            <img
                                                src={DefaultAvatar}
                                                alt="A"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </label>
                                    </div>
                                    <div className="drawer-side">
                                        <label htmlFor="user-drawer" className="drawer-overlay"></label>
                                        <div
                                            className="menu p-4 w-80 h-full bg-white shadow-sm"
                                            onClick={() => setIsDisplayUserDrawer(!isDisplayUserDrawer)}
                                        >
                                            <UserDropDown />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-2 flex justify-end items-center gap-3">
                            <span className="hidden tablet:block min-w-fit font-medium hover:opacity-80 cursor-pointer">
                                All Courses
                            </span>
                            <Link to="/login">
                                <button className="text-white btn btn-primary text-lg">Login</button>
                            </Link>
                            <Link to="/register">
                                <button className="btn btn-outline text-lg">Signup</button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
