import React from "react";

interface CategoryProps {
    id: number;
    title: string;
    thumbnail: React.FC;
}

const CategoryCard: React.FC<CategoryProps> = (props) => {
    return (
        <div className="rounded-lg shadow-lg flex flex-col justify-between hover:scale-95 hover:duration-300 cursor-pointer h-[300px] max-w-[300px] p-2">
            <div className="flex justify-center items-center object-cover h-3/4">
                <props.thumbnail />
            </div>
            <h2 className="font-bold text-4xl text-ellipsis overflow-hidden whitespace-wrap text-center py-4">
                {props.title}
            </h2>
        </div>
    );
};

export default CategoryCard;
