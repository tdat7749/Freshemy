import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
// import { useAppDispatch } from "../hooks/hooks";
import { courseActions } from "../redux/slice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import EditIcon from "../components/icons/EditIcon";
import DeleteIcon from "../components/icons/DeleteIcon";

const CourseDetail: React.FC = () => {
    let { slug } = useParams();
    const dispatch = useAppDispatch();
    // const [courseDetail, setCourseDetail] = useState({});
    let courseDetailSelector = useAppSelector((state) => state.courseSlice.courseDetail);
    useEffect(() => {
        //@ts-ignore
        dispatch(courseActions.getCourseDetail(slug || ""));
    }, [dispatch, slug]);
    return (
        <>
            <div className="h-screen container mt-[100px] mx-auto flex justify-center">
                <div className="mt-4 container mx-auto p-4">
                    <div className="flex flex-col laptop:flex-row gap-4 h-[400px]">
                        <div className="flex-4 w-[600px] max-w-full bg-gray-600 rounded-lg">
                            <img
                                src={courseDetailSelector.thumbnail}
                                alt={courseDetailSelector.title}
                                className="w-full h-full rounded-lg"
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1">
                                <h2 className="text-[40px]">{courseDetailSelector.title}</h2>
                                <p className="text-2xl tablet:text-2xl mb-3 italic text-[#666666]">
                                    {courseDetailSelector.summary}
                                </p>

                                <div className="text-2xl tablet:text-2xl mb-3">
                                    <span>Author: </span>
                                    <Link to={"/profile/:userID"} className="text-blue-600">
                                        {courseDetailSelector.author?.first_name}
                                        {courseDetailSelector.author?.last_name}
                                    </Link>
                                </div>
                                <div className="flex items-center text-2xl tablet:text-2xl mb-3">
                                    <span className="mr-2">Ratings:</span>
                                    <p className="italic">{courseDetailSelector.ratings}</p>
                                </div>
                                <div className="flex items-center text-2xl tablet:text-2xl mb-3">
                                    <span className="mr-2">Status:</span>
                                    <p className="italic">{courseDetailSelector.status}</p>
                                </div>
                                <div className="flex items-center text-2xl tablet:text-2xl mb-3">
                                    <span className="mr-2">Atendees:</span>
                                    <p className="italic">{courseDetailSelector.atendees}</p>
                                </div>
                            </div>
                            <div className="flex mt-[42px] gap-2">
                                <button className="flex-3 flex py-4 px-4 bg-switch rounded-lg text-white hover:opacity-80">
                                    <EditIcon color="#ffffff"/>
                                    <span className="ml-2">Edit</span>
                                </button>
                                <button className="flex-3 flex py-4 px-4 bg-error rounded-lg text-white hover:opacity-80">
                                    <DeleteIcon color="#ffffff"/>
                                    <span className="ml-2">Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
