import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Accordion from "../components/Accordion";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { Section } from "../types/section";
import { CourseDetail as CourseDetailType } from "../types/course";
import { Link } from "react-router-dom";
import EditIcon from "../components/icons/EditIcon";
import DeleteIcon from "../components/icons/DeleteIcon";
import NotFound from "./NotFound";
import DeleteModal from "../components/DeleteModal";
import { courseActions } from "../redux/slice";
// import { useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../hooks/hooks";

const CourseDetail: React.FC = () => {
    let { slug } = useParams();
    const dispatch = useAppDispatch();
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const navigate = useNavigate();

    const courseDetail: CourseDetailType = useAppSelector((state) => state.courseSlice.courseDetail) ?? {};

    const handleDeleteCourse = () => {
        //@ts-ignore
        dispatch(courseActions.deleteCourse(idItem)).then((response) => {
            if (response.payload.status_code === 200) {
                navigate("/my-courses");
            }
        });
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };

    const handleCancelModal = () => {
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };

    useEffect(() => {
        // @ts-ignore
        dispatch(courseActions.getCourseDetail(slug)).then((response) => {
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
            <div className="container mx-auto">
                <div className="min-h-screen h-full px-4 tablet:px-[60px]">
                    <div className="mt-4 container mx-auto p-4">
                        <div className="flex flex-col gap-4 laptop:flex-row  bg-primary rounded-lg">
                            <div className=" flex-1 object-left max-w-[600px] max-h-[400px] rounded-lg">
                                <img
                                    src={courseDetail.thumbnail}
                                    alt={courseDetail.title}
                                    className="h-[300px] m-auto rounded-lg border-black border-[2px] shadow-lg align-self: center tablet:h-[400px]"
                                />
                            </div>
                            <div className=" flex-1 object-right flex flex-col gap-4 px-2 pb-2 ">
                                <div className="flex-1">
                                    <h2 className="text-2xl tablet:text-[32px] font-bold text-title mb-3">{courseDetail.title}</h2>
                                    <p className="text-xl tablet:text-3xl font-medium italic mb-3">
                                        {courseDetail.summary}
                                    </p>

                                    <div className=" mb-3">
                                        <span className="text-xl tablet:text-3xl font-medium">Author: </span>
                                        <Link to={"/profile/:userID"} className="text-xl underline tablet:text-3xl font-medium text-blue-600">
                                            {courseDetail.author?.first_name}
                                            <span> {courseDetail.author?.last_name} </span>
                                            
                                        </Link>
                                    </div>
                                    <div className="flex items-center text-xl tablet:text-3xl font-medium mb-3">
                                        <span className="mr-2">Ratings:</span>
                                        <p className="italic">{courseDetail.ratings}</p>
                                    </div>
                                    <div className="flex items-center text-xl tablet:text-3xl font-medium">
                                        <span className="mr-2">Status:</span>
                                        <p className="font-normal">{courseDetail.status === false ? "Uncomplete" : " Completed"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-primary text-lg">
                                        <EditIcon color="#ffffff" />
                                        <Link to={`/my-courses/edit/${courseDetail.id}`}>
                                            <span>Edit</span>
                                        </Link>
                                    </button>
                                    <button
                                        className="btn btn-error text-lg"
                                        onClick={() => {
                                            setIsOpenDeleteModal(!isOpenDeleteModal);
                                            setIdItem(courseDetail.id as number);
                                        }}
                                    >
                                        <DeleteIcon color="#000000" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>            
                        </div>
                        <div>
                            <div className="description my-4">
                                <h2 className="text-xl tablet:text-3xl font-bold mb-3">Description</h2>
                                <span className="w-[60px] h-1 bg-black block"></span>
                                <p className="mt-2 text-[20px]">{courseDetail.description}</p>
                            </div>

                            <div className="table-of-content my-4">
                                <h2 className="text-xl tablet:text-3xl font-bold mb-3">Table of Content</h2>
                                <span className="w-[60px] h-1 bg-black block mb-4"></span>
                                {courseDetail.sections.map((section: Section, index: number) => {
                                    return <Accordion key={index} isDisplayBtn={false} section={section} />;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
