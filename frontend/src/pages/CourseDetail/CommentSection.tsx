import React from "react";
import { RatingResponse } from "../../types/course";
import CommentCard from "./CommentCard";
type CommentSectionProps = {
    ratings: RatingResponse[];
};
const CommentSection: React.FC<CommentSectionProps> = (props) => {
    return (
        <div>
            <div className="comment my-4">
                <h2 className="text-xl tablet:text-3xl font-bold mb-3">Ratings</h2>
                <span className="w-[60px] h-1 bg-black block mb-4"></span>
                {props.ratings.map((rating: RatingResponse, index: number) => {
                    return <CommentCard key={index} rating={rating} />;
                })}
            </div>
        </div>
    );
};
export default CommentSection;
