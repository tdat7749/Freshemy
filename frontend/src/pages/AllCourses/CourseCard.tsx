import { FC } from "react";
import { Link } from "react-router-dom";

type Course = {
    isOwner: boolean;
    id: number;
    slug: string;
    title: string;
    summary: string;
    rating: number;
    status: boolean;
    numberOfSection: number;
    thumbnail: string;
    author: string;
    handleGetCourse?: (id: number) => void;
};

const CourseCard: FC<Course> = (props: Course) => {
    return (
        <div className="py-4 border-b-[1px]">
            <div className="flex flex-col gap-2 tablet:flex-row rounded-2xl hover:bg-backgroundHover/10 transition ease-in-out hover:shadow-lg duration-200">
                <div className="h-48 laptop:h-52 bg-gray-400 rounded-lg tablet:w-64 laptop:w-80">
                    <Link to={`/course-detail/${props.slug}`}>
                        <img src={props.thumbnail} alt={props.title} className="w-full h-full rounded-lg" />
                    </Link>
                </div>
                <div className="flex gap-4 tablet:flex-1 px-2 pb-2 tablet:px-0">
                    <div className="w-full">
                        <Link to={`/course-detail/${props.slug}`}>
                            <h2 className="text-xl tablet:text-2xl font-bold text-title">{props.title}</h2>
                        </Link>
                        <p className="text-base tablet:text-xl italic">{props.summary}</p>
                        <p className="text-base tablet:text-xl font-bold">
                            <span>Author: </span>
                            <Link to={"/profile/:userID"} className="text-blue-600 font-normal">
                                {props.author}
                            </Link>
                        </p>
                        <p className="text-base tablet:text-xl italic">{props.rating}</p>
                        <p className="text-base tablet:text-xl italic">{props.status}</p>
                        <p className="text-base tablet:text-xl italic">{props.numberOfSection}</p>
                    </div>
                    {props.isOwner ? <div className="btn btn-secondary">GET</div> : <></>}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
