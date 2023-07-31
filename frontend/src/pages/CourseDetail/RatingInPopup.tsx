import React from "react";

type RatingInPopupProps = {
    handleCheck: (event: any) => void;
};

const RatingInPopup: React.FC<RatingInPopupProps> = (props) => {
    return (
        <div className="rating mt-[-4px] space-x-1">
            <input
                type="radio"
                name="rating-1"
                id="1"
                className="mask mask-star-2 bg-yellow-400"
                onChange={props.handleCheck}
            />
            <input
                type="radio"
                name="rating-1"
                id="2"
                className="mask mask-star-2 bg-yellow-400"
                onChange={props.handleCheck}
            />
            <input
                type="radio"
                name="rating-1"
                id="3"
                className="mask mask-star-2 bg-yellow-400"
                onChange={props.handleCheck}
            />
            <input
                type="radio"
                name="rating-1"
                id="4"
                className="mask mask-star-2 bg-yellow-400"
                onChange={props.handleCheck}
            />
            <input
                type="radio"
                name="rating-1"
                id="5"
                className="mask mask-star-2 bg-yellow-400"
                onChange={props.handleCheck}
            />
        </div>
    );
};

export default RatingInPopup;
