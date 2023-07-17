import { FC, useState } from "react";
import { Link } from "react-router-dom";
import ThreeDotIcon from "../components/icons/ThreedotIcon";
import EditIcon from "../components/icons/EditIcon";
import DeleteIcon from "../components/icons/DeleteIcon";

type Course = {
    title: string;
    summary: string;
    author: string;
};

const CourseCard: FC<Course> = (props: Course) => {
    const [isDisplayDropDown, setIsDisplayDropDown] = useState<boolean>(false);
    return (
        <div className="flex pt-4 pb-3 border-b-[1px]">
            <div className="flex flex-col tablet:flex-row">
                <div className="w-[256px] h-[180px] bg-gray-600 rounded-lg"></div>
                <div className="flex-2 tablet:ml-4">
                    <h2 className="text-xl">{props.title}</h2>
                    <p className="text-base italic">{props.summary}</p>
                    <span className="text-base">
                        Author:
                        <Link to={"/profile/:userID"} className="text-blue-600">
                            {props.author}
                        </Link>
                    </span>
                </div>
            </div>
            <div
                className="w-[33px] h-[33px] rounded-full bg-slate-200 hover:bg-slate-400 ml-auto flex justify-center items-center relative shrink-0"
                onClick={() => setIsDisplayDropDown(!isDisplayDropDown)}
            >
                <ThreeDotIcon />
                <div
                    className={`shadow-lg p-4 rounded-lg absolute top-full right-0 ${
                        isDisplayDropDown ? "block" : "hidden"
                    }`}
                >
                    <div className="flex items-center mb-2 hover:bg-backgroundHover cursor-pointer">
                        <EditIcon />
                        <span className="ml-2">Edit</span>
                    </div>
                    <div className="flex items-center hover:bg-backgroundHover cursor-pointer">
                        <DeleteIcon />
                        <span className="ml-2">Delete</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
