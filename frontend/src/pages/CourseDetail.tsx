import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Accordion from "../components/Accordion";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { courseAction } from "../redux/slice";
import { Section } from "../types/section";
import { CourseDetail as CourseDetailType } from "../types/course";
import { Link } from "react-router-dom";
import EditIcon from "../components/icons/EditIcon";
import DeleteIcon from "../components/icons/DeleteIcon";
import NotFound from "./NotFound";
import DeleteModal from "../components/DeleteModal";
// import { useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../hooks/hooks";

const CourseDetail: React.FC = () => {
    let { slug } = useParams();
    const dispatch = useAppDispatch();
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const navigate = useNavigate()

    const courseDetail: CourseDetailType = useAppSelector((state) => state.courseSlice.courseDetail) ?? {};

    const handleDeleteCourse = () => {
        //@ts-ignore
        dispatch(courseAction.deleteCourse(idItem)).then((response) => {
            if (response.payload.status_code === 200) {
                navigate('/my-courses')
            }
        });
        setIsOpenDeleteModal(!isOpenDeleteModal)
    };

    const handleCancelModal = () => {
        setIsOpenDeleteModal(!isOpenDeleteModal)
    };

    useEffect(() => {
        // @ts-ignore
        dispatch(courseAction.getCourseDetail(slug)).then((response) => {
            if (response.payload.status_code === 404) {
                setIsNotFound(true);
            }
        });
    }, [dispatch, slug, isNotFound]);

    if (isNotFound) return <NotFound />;

    return (
        <>
            {isOpenDeleteModal && <DeleteModal handleDelete={handleDeleteCourse} handleCancel={handleCancelModal} />}
            <Navbar />
            <div className="h-screen container mt-16 mx-auto flex justify-center">
                <div className="mt-4 container mx-auto p-4">
                    <div className="flex flex-col laptop:flex-row gap-4 h-[400px]">
                        <div className="flex-4 w-[600px] max-w-full bg-gray-600 rounded-lg">
                            <img
                                src={courseDetail.thumbnail}
                                alt={courseDetail.title}
                                className="w-full h-full rounded-lg"
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1">
                                <h2 className="text-[40px]">{courseDetail.title}</h2>
                                <p className="text-2xl tablet:text-2xl mb-3 italic text-[#666666]">
                                    {courseDetail.summary}
                                </p>

                                <div className="text-2xl tablet:text-2xl mb-3">
                                    <span>Author: </span>
                                    <Link to={"/profile/:userID"} className="text-blue-600">
                                        {courseDetail.author?.first_name}
                                        <span> </span>
                                        {courseDetail.author?.last_name}
                                    </Link>
                                </div>
                                <div className="flex items-center text-2xl tablet:text-2xl mb-3">
                                    <span className="mr-2">Ratings:</span>
                                    <p className="italic">{courseDetail.ratings}</p>
                                </div>
                                <div className="flex items-center text-2xl tablet:text-2xl mb-3">
                                    <span className="mr-2">Status:</span>
                                    <p>{courseDetail.status === false ? "Uncomplete" : " Completed"}</p>
                                </div>
                            </div>
                            <div className="flex mt-[42px] gap-2">
                                <button className="flex-3 flex py-4 px-4 bg-switch rounded-lg text-white hover:opacity-80">
                                    <EditIcon color="#ffffff" />
                                    <Link to={`/my-courses/edit/${courseDetail.id}`}>
                                    <span className="ml-2">Edit</span>
                                    
                                    </Link>
                                </button>
                                <button
                                    className="flex-3 flex py-4 px-4 bg-error rounded-lg text-white hover:opacity-80"
                                    onClick={() => {
                                        setIsOpenDeleteModal(!isOpenDeleteModal);
                                        setIdItem(courseDetail.id as number);
                                    }}
                                >
                                    <DeleteIcon color="#ffffff" />
                                    <span className="ml-2">Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="description my-4">
                            <h2 className="text-[32px]">Description</h2>
                            <span className="w-[60px] h-1 bg-black block"></span>
                            <p className="mt-2 text-[20px]">{courseDetail.description}</p>
                        </div>

                        <div className="table-of-content my-4">
                            <h2 className="text-[32px]">Table of Content</h2>
                            <span className="w-[60px] h-1 bg-black block mb-4"></span>
                            {courseDetail.sections.map((section: Section, index: number) => {
                                return <Accordion key={index} isDisplayBtn={false} section={section} />;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
