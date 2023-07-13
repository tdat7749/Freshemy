import React from "react";
import UserIcon from "./icons/UserIcon";
import ChangePasswordIcon from "./icons/Edit_light";
import MyEnrollCourseIcon from "./icons/MyEnrollCourse";
import MyCourseIcon from "./icons/MyCourseIcon";
import LogoutIcon from "./icons/LogoutIcon";
import { Link } from "react-router-dom";

const UserDropDown: React.FC = () => {
    return (
        <>
            <div className="z-20 w-[342px] bg-white shadow-xl absolute top-[70px] right-0 py-4 flex flex-col justify-start items-start rounded-lg">
                <Link to={"/profile"} className="w-full hover:bg-backgroundHover">
                    <div className="flex justify-start items-center py-[10px] px-4">
                        <UserIcon />
                        <span className="ml-3">Profile Setting</span>
                    </div>
                </Link>
                <Link to={"/change-password"} className="w-full hover:bg-backgroundHover">
                    <div className="flex justify-start items-center py-[10px] px-4">
                        <ChangePasswordIcon />
                        <span className="ml-3">Change Password</span>
                    </div>
                </Link>
                <Link to={"my-enroll-courses"} className="w-full hover:bg-backgroundHover tablet:hidden">
                    <div className="flex justify-start items-center py-[10px] px-4">
                        <MyEnrollCourseIcon />
                        <span className="ml-3">My enroll courses</span>
                    </div>
                </Link>
                <Link to={"/my-courses"} className="w-full hover:bg-backgroundHover tablet:hidden">
                    <div className="flex justify-start items-center py-[10px] px-4">
                        <MyCourseIcon />
                        <span className="ml-3">My courses</span>
                    </div>
                </Link>
                <Link to={"/logout"} className="w-full hover:bg-backgroundHover">
                    <div className="flex justify-start items-center py-[10px] px-4">
                        <LogoutIcon />
                        <span className="text-error ml-3">Logout</span>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default UserDropDown;
