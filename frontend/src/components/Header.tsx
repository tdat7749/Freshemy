import React, { useState } from "react";
import Logo from "../assets/images/logo.png";
import UserDropDown from "./UserDropDown";
import SearchIcon from "./icons/SearchIcon";
import DefaultAvatar from "../assets/images/default-avatar.png";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast"
interface HeaderProps {
    isLogin: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLogin }) => {
    const [display, setDisplay] = useState<boolean>(false);

    return (
        <>
            {display && (
                <div
                    className="fixed z-10 w-screen h-screen backdrop-brightness-90 tablet:hidden"
                    onClick={() => setDisplay(!display)}
                ></div>
            )}

            <header className="w-full h-[100px] max-w-full bg-background shadow-sm fixed top-0 left-0 z-[10]">
                <Toaster/>
                <div className="w-full h-full flex items-center py-[10px] px-4 tablet:px-[60px]">
                    <div className="flex-1 flex gap-4 laptop:gap-[120px] items-center">
                        <Link to={"/"} className="w-[60px] h-[60px] shrink-0">
                            <img src={Logo} alt="Logo" />
                        </Link>
                        <div className="hidden relative laptop:block flex-1">
                            <input
                                type="text"
                                placeholder="Search for anything"
                                className="rounded-full py-4 px-10 w-[70%] max-w-[700px] border-[1px] border-black"
                            />
                            <SearchIcon />
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
                                <div
                                    data-dropdown-toggle="dropdown"
                                    className="w-[60px] h-[60px] rounded-full flex items-center justify-center relative border-[1px] hover:cursor-pointer"
                                    onClick={() => {
                                        setDisplay(!display);
                                    }}
                                >
                                    <img
                                        src={DefaultAvatar}
                                        alt="A"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                    {display ? <UserDropDown /> : <></>}
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
