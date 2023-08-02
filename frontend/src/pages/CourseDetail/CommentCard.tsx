import React from "react";
import { TotalRating } from "@src/components";
import { RatingResponse } from "../../types/course";
type CommentCardProps = {
    rating: RatingResponse;
};
const CommentCard: React.FC<CommentCardProps> = (props) => {
    const date = props.rating.created_at.split(" ");
    return (
        <div>
            <div className={` flex items-center justify-between w-full p-4 rounded-lg my-0 `}>
                <div className="avatar mr-1">
                    <div className=" items-center justify-between w-14 rounded-full">
                        <img alt="1" src={props.rating.url_avatar as string} />
                    </div>
                </div>
                <div
                    className={` flex items-center justify-between w-full py-2 px-6 h-full  bg-primary rounded-lg my-1 `}
                >
                    <div className="">
                        <p className="comment-author mb-1 ">
                            {props.rating.first_name} {props.rating.last_name}
                        </p>
                        <p className="comment w-full truncate line-height:1.5 max-height:1.5 ">
                            {props.rating.content}
                        </p>
                    </div>
                    <div className="">
                        <p className="comment-date mb-1 ">{date[1] + " " + date[2] + " " + date[3]}</p>
                        <TotalRating ratingId={props.rating.id} totalScore={props.rating.ratings} isForCourse={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CommentCard;
