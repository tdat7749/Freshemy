import React, { useState } from "react";
import Logo from "../assets/images/logo.png";
import UserDropDown from "./UserDropDown";
import SearchIcon from "./icons/SearchIcon";
import DefaultAvatar from "../assets/images/default-avatar.png";
import { Link } from "react-router-dom";

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

            <div className="w-full h-[100px] max-w-full bg-background shadow-sm fixed top-0 left-0 z-[10]">
                <div className="w-full flex items-center py-[10px] px-4 tablet:px-[60px]">
                    <img src={Logo} alt="Logo" />
                    <div className="hidden relative ml-[120px] tablet:block tablet:w-[1000px]">
                        <input
                            type="text"
                            placeholder="Search for anything"
                            className="rounded-full py-4 px-10 w-[70%] border-[1px] border-black"
                        />
                        <SearchIcon />
                    </div>
                    {isLogin ? (
                        <>
                            <div className="ml-auto flex shrink-0 items-center">
                                <span className="hidden tablet:block min-w-fit mr-5">All Courses</span>
                                <span className="hidden tablet:block min-w-fit mr-5">Enroll Course</span>
                                <span className="hidden tablet:block min-w-fit mr-5">My Courses</span>
                                <div
                                    data-dropdown-toggle="dropdown"
                                    className="w-[60px] h-[60px] rounded-full flex items-center justify-center relative border-[1px]"
                                    onClick={() => {
                                        setDisplay(!display);
                                    }}
                                >
                                    <img src={DefaultAvatar} alt="A" className="w-10 h-10 rounded-ful"/>
                                    {display ? <UserDropDown /> : <></>}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="ml-auto flex sh items-center">
                            <span className="hidden tablet:block min-w-fit mr-4">All Courses</span>
                            <Link to="/login">
                                <button className="py-2 px-4 mr-1 bg-switch rounded-lg text-white hover:opacity-80">
                                    Login
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="py-[7px] px-4 border-[1px] border-black rounded-lg">Signup</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
