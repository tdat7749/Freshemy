import { FC, useState } from "react";
import { Link } from "react-router-dom";
import ThreeDotIcon from "../components/icons/ThreedotIcon";
import EditIcon from "../components/icons/EditIcon";
import DeleteIcon from "../components/icons/DeleteIcon";

type Course = {
    id: number;
    slug: string;
    title: string;
    summary: string;
    thumbnail: string;
    author: string;
    handleDeleteCourse: (courseId: number) => void;
    handleEditCourse: (id: number) => void;
};

const CourseCard: FC<Course> = (props: Course) => {
    const [isDisplayDropDown, setIsDisplayDropDown] = useState<boolean>(false);

    return (
        <div className="py-4 border-b-[1px]">
            <div className="flex flex-col gap-2 tablet:flex-row rounded-2xl hover:bg-backgroundHover/10 transition ease-in-out hover:shadow-lg duration-200">
                <div className="h-48 bg-gray-400 rounded-lg tablet:w-64 laptop:w-80">
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
                            <Link to={`/profile/${props.id}`} className="text-blue-600 font-normal">
                                {props.author}
                            </Link>
                        </p>
                    </div>
                    <div
                        className="w-[33px] h-[33px] rounded-full bg-slate-200 hover:bg-slate-400 ml-auto flex justify-center items-center relative shrink-0 cursor-pointer tablet:m-1"
                        onClick={() => setIsDisplayDropDown(!isDisplayDropDown)}
                    >
                        <ThreeDotIcon />
                        <div
                            className={`shadow-lg p-2 rounded-lg absolute top-10 right-0 bg-white ${
                                isDisplayDropDown ? "block" : "hidden"
                            }`}
                        >
                            <div
                                className="flex items-center p-2 rounded-lg hover:bg-backgroundHover cursor-pointer"
                                onClick={() => props.handleEditCourse(props.id)}
                            >
                                <EditIcon />
                                <span className="ml-2">Edit</span>
                            </div>
                            <div
                                className="flex items-center p-2 rounded-lg hover:bg-backgroundHover cursor-pointer"
                                onClick={() => props.handleDeleteCourse(props.id)}
                            >
                                <DeleteIcon />
                                <span className="ml-2">Delete</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
