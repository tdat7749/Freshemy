import React from "react";
import { Link } from "react-router-dom";

interface CategoryProps {
    id: number;
    title: string;
    thumbnail: React.FC;
}

const CategoryCard: React.FC<CategoryProps> = (props) => {
    return (
        <Link to={`/all-courses?category=${props.id}`}>
            <div className="rounded-lg shadow-lg flex flex-col justify-between hover:scale-95 cursor-pointer max-w-[300px] p-2">
                <div className="h-fit">
                    <div className="flex justify-center items-center object-cover">
                        <props.thumbnail />
                    </div>
                </div>
                <h2 className="font-bold text-4xl text-ellipsis overflow-hidden whitespace-wrap text-center py-4">
                    {props.title}
                </h2>
            </div>
        </Link>
    );
};

export default CategoryCard;
