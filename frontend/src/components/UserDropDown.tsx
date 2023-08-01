import React from "react";
import UserIcon from "./icons/UserIcon";
import ChangePasswordIcon from "./icons/ChangePasswordIcon";
import MyEnrollCourseIcon from "./icons/MyEnrollCourseIcon";
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
            <div className="w-60 bg-white shadow-xl absolute top-[70px] right-0 py-4 flex flex-col justify-start items-start rounded-lg">
                <Link to={"/my-profile"} className="w-full hover:bg-backgroundHover rounded-lg">
                    <div className="flex justify-start items-center py-[10px] px-4">
                        <UserIcon />
                        <span className="ml-3">Profile Setting</span>
                    </div>
                </Link>
                <Link to={"/change-password"} className="w-full hover:bg-backgroundHover rounded-lg">
                    <div className="flex justify-start items-center py-[10px] px-4">
                        <ChangePasswordIcon />
                        <span className="ml-3">Change Password</span>
                    </div>
                </Link>
                <Link to={"my-enroll-courses"} className="w-full hover:bg-backgroundHover rounded-lg tablet:hidden">
                    <div className="flex justify-start items-center py-[10px] px-4">
                        <MyEnrollCourseIcon />
                        <span className="ml-3">My enroll courses</span>
                    </div>
                </Link>
                <Link to={"/my-courses"} className="w-full hover:bg-backgroundHover rounded-lg tablet:hidden">
                    <div className="flex justify-start items-center py-[10px] px-4">
                        <MyCourseIcon />
                        <span className="ml-3">My courses</span>
                    </div>
                </Link>
                <div
                    className="w-full flex justify-start items-center py-[10px] px-4 hover:bg-backgroundHover rounded-lg cursor-pointer"
                    onClick={handleLogout}
                >
                    <LogoutIcon />
                    <span className="text-error ml-3">Logout</span>
                </div>
            </div>
        </>
    );
};

export default UserDropDown;
