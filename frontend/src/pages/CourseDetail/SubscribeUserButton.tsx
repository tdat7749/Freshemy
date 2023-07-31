import React from "react";
import { Link } from "react-router-dom";
import WatchVideoIcon from "@src/components/icons/WatchVideoIcon";
import RatingIcon from "@src/components/icons/RatingIcon";
import { CourseDetail } from "../../types/course";
import DeleteIcon from "@src/components/icons/DeleteIcon";
type SubscribeUserButtonProps = {
    handleTogglePopupRating(): void;
    handleToggleUnsubscribeCourse(): void;
    courseDetail: CourseDetail;
};

const SubscribeUserButton: React.FC<SubscribeUserButtonProps> = (props) => {
    return (
        <div>
            <div className="flex gap-2">
                {props.courseDetail.sections.length > 0 && (
                    <button className="text-white btn btn-primary text-lg">
                        <WatchVideoIcon />
                        <Link to={`/course-detail/${props.courseDetail.slug}/watch`}>
                            <span>Learn Now</span>
                        </Link>
                    </button>
                )}
                <button
                    onClick={props.handleTogglePopupRating}
                    className="btn bg-backgroundHover border-backgroundHover hover:bg-backgroundHover hover:border-backgroundHover btn-primary text-black text-lg"
                >
                    <RatingIcon />
                    <span>Vote</span>
                </button>
                <button onClick={props.handleToggleUnsubscribeCourse} className="btn btn-error text-lg">
                    <DeleteIcon color="#000000" />
                    <span>Unsubcribe</span>
                </button>
            </div>
        </div>
    );
};

export default SubscribeUserButton;
