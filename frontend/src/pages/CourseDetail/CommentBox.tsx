import React from "react";
import TotalRating from "./TotalRating";
import { Rating } from "../../types/course";
type CommentBoxProps = {
    rating: Rating;
};
const CommentBox: React.FC<CommentBoxProps> = (props) => {
    const date = props.rating.created_at.toString().split("T");
    return (
        <div>
            <div className={` flex items-center justify-between w-full p-4 rounded-lg my-0 `}>
                <div className="avatar mr-1">
                    <div className=" items-center justify-between w-14 rounded-full">
                        <img alt="1" src="https://i.kym-cdn.com/photos/images/newsfeed/002/205/323/176.jpg" />
                    </div>
                </div>
                <div
                    className={` flex items-center justify-between w-full py-2 px-6 h-full  bg-primary rounded-lg my-1 `}
                >
                    <div className="">
                        <p className="comment-author mb-1 ">
                            {props.rating.user.first_name}
                            {props.rating.user.last_name}
                        </p>
                        <p className="comment w-full truncate line-height:1.5 max-height:1.5 ">
                            {props.rating.content}
                        </p>
                    </div>
                    <div className="">
                        <p className="comment-date mb-1 ">{date[0]}</p>
                        <TotalRating ratingId={props.rating.id} totalScore={props.rating.score} isForCourse={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CommentBox;
