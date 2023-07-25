import React from "react";
import { Category } from "../../types/course";

interface CardVideoProps {
    thumbnail: string;
    title: string;
    author: string;
    rating: number;
    categories: Category[];
}

const CardVideo: React.FC<CardVideoProps> = (props) => {
    return (
        <div className="rounded-lg bg-primary shadow-lg flex flex-col hover:scale-95 cursor-pointer max-w-[200px]">
            <img
                src={props.thumbnail}
                alt={props.title}
                className="w-full h-[140px] rounded-t-lg bg-black object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
                <h2 className="font-bold text-title text-lg text-ellipsis overflow-hidden whitespace-wrap">
                    {props.title}
                </h2>
                <div className="items-end">
                    <div className="font-medium mt-1">{props.author}</div>
                    <div className="font-medium mt-1">{props.rating}</div>
                    <div className="categori flex flex-wrap gap-1">
                        {props.categories &&
                            props.categories.map((category: Category) => (
                                <div key={category.id} className="mt-1 badge badge-outline">
                                    {category.title}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardVideo;
