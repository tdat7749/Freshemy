import React from "react";
import { Link } from "react-router-dom";
import EditIcon from "@src/components/icons/EditIcon";
import DeleteIcon from "../../components/icons/DeleteIcon";
import { CourseDetail as CourseDetailType } from "../../types/course";

type AuthorButtonProps = {
    handleDelete(): void;
    courseDetail: CourseDetailType;
};

const AuthorButton: React.FC<AuthorButtonProps> = (props) => {
    return (
        <div>
            <div className="flex gap-2">
                <button className="btn btn-primary text-lg">
                    <EditIcon color="#ffffff" />
                    <Link to={`/my-courses/edit/${props.courseDetail.id}`}>
                        <span>Edit</span>
                    </Link>
                </button>
                <button
                    className="btn btn-error text-lg"
                    onClick={() => {
                        props.handleDelete();
                    }}
                >
                    <DeleteIcon color="#000000" />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
};

export default AuthorButton;
