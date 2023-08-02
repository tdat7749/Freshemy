import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions } from "@redux/slice";
import toast from "react-hot-toast";

type GuestButtonProps = {
    isLogin: boolean;
    course_id: number | undefined;
};

const GuestButton: React.FC<GuestButtonProps> = ({ isLogin, course_id }) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading) ?? false;
    const handleGetItClick = () => {
        if (!isLogin) {
            return;
        } else {
            //@ts-ignore
            dispatch(courseActions.subscribeCourse({ course_id })).then((response) => {
                if (response.payload.status_code === 201) {
                    toast.success(response.payload.message);
                } else {
                    toast.error(response.payload.message);
                }
            });
        }
    };
    return (
        <>
            <Link to={`${isLogin ? "" : "/register"}`}>
                <button
                    onClick={handleGetItClick}
                    className="btn btn-primary bg-backgroundHover border-backgroundHover hover:bg-backgroundHover hover:border-backgroundHover text-black text-lg"
                >
                    <span>{isLoading ? "Loading..." : "Get it"}</span>
                </button>
            </Link>
        </>
    );
};

export default GuestButton;
