import React from "react";
import { Link } from "react-router-dom";
import EditIcon from "@src/components/icons/EditIcon";
import DeleteIcon from "../../components/icons/DeleteIcon";
import { CourseDetail as CourseDetailType } from "../../types/course";
import WatchVideoIcon from "@src/components/icons/WatchVideoIcon";
import { useAppDispatch } from "../../hooks/hooks";
import { lessonActions } from "@redux/slice";
import i18n from "../../utils/i18next";
type AuthorButtonProps = {
    handleDelete(): void;
    courseDetail: CourseDetailType;
};

const AuthorButton: React.FC<AuthorButtonProps> = (props) => {
    const dispatch = useAppDispatch();
    const clearUrlVideo = () => {
        dispatch(lessonActions.setNowUrlVideo(""));
    };
    return (
        <>
            {props.courseDetail.sections.length > Number(i18n.t("COURSES_LENGTH.EMPTY")) && (
                <Link to={`/course-detail/${props.courseDetail.slug}/watch`} onClick={clearUrlVideo}>
                    <button className="text-white btn btn-primary text-lg">
                        <WatchVideoIcon />
                        <span>Learn Now</span>
                    </button>
                </Link>
            )}
            <Link to={`/my-courses/edit/${props.courseDetail.id}`}>
                <button className="btn btn-primary text-white text-lg">
                    <EditIcon color="#ffffff" />

                    <span>Edit</span>
                </button>
            </Link>
            <button
                className="btn btn-error text-lg"
                onClick={() => {
                    props.handleDelete();
                }}
            >
                <DeleteIcon color="#000000" />
                <span>Delete</span>
            </button>
        </>
    );
};

export default AuthorButton;
