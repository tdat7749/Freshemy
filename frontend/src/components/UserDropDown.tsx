import React from "react";
import UserIcon from "./icons/UserIcon";
import ChangePasswordIcon from "./icons/ChangePasswordIcon";
import MyEnrollCourseIcon from "./icons/MyEnrollCourseIcon";
import AllcoursesIcon from "./icons/AllcourseIcon";
import MyCourseIcon from "./icons/MyCourseIcon";
import LogoutIcon from "./icons/LogoutIcon";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { authActions } from "../redux/slice";

const UserDropDown: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        // @ts-ignore
        dispatch(authActions.logout());
        navigate("/");
    };

    return (
        <>
            <Link to={"/my-profile"} className="w-full rounded-lg hover:bg-backgroundHover">
                <div className="flex justify-start items-center px-4 py-4">
                    <UserIcon />
                    <span className="ml-3 font-medium text-lg">Profile Setting</span>
                </div>
            </Link>
            <Link to={"/change-password"} className="w-full rounded-lg hover:bg-backgroundHover">
                <div className="flex justify-start items-center px-4 py-4">
                    <ChangePasswordIcon />
                    <span className="ml-3 font-medium text-lg">Change Password</span>
                </div>
            </Link>
            <Link to={"all-courses"} className="w-full rounded-lg hover:bg-backgroundHover tablet:hidden">
                <div className="flex justify-start items-center px-4 py-4">
                    <AllcoursesIcon />
                    <span className="ml-3 font-medium text-lg">All courses</span>
                </div>
            </Link>
            <Link to={"my-enrolled-courses"} className="w-full rounded-lg hover:bg-backgroundHover tablet:hidden">
                <div className="flex justify-start items-center px-4 py-4">
                    <MyEnrollCourseIcon />
                    <span className="ml-3 font-medium text-lg">My enroll courses</span>
                </div>
            </Link>
            <Link to={"/my-courses"} className="w-full rounded-lg hover:bg-backgroundHover tablet:hidden">
                <div className="flex justify-start items-center px-4 py-4">
                    <MyCourseIcon />
                    <span className="ml-3 font-medium text-lg">My courses</span>
                </div>
            </Link>
            <div
                className="w-full flex justify-start items-center px-4 py-4 rounded-lg hover:bg-backgroundHover cursor-pointer"
                onClick={handleLogout}
            >
                <LogoutIcon />
                <span className="text-error ml-3 font-medium text-lg">Logout</span>
            </div>
        </>
    );
};

export default UserDropDown;
