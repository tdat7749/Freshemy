import React, { useEffect, useState } from "react";
import { Navbar, Accordion, DeleteModal } from "@src/components";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { Section } from "../../types/section";
import { CourseDetail as CourseDetailType, Rating } from "../../types/course";
import { Link } from "react-router-dom";
// import EditIcon from "@src/components/icons/EditIcon";
// import DeleteIcon from "../../components/icons/DeleteIcon";
import NotFound from "../NotFound";
import { courseActions } from "@redux/slice";
import PopupRating from "./PopupRating";

import TotalRating from "./TotalRating";
import CommentBox from "./CommentBox";
import toast from "react-hot-toast";
import AuthorButton from "./AuthorButton";
// import WatchVideoIcon from "@src/components/icons/WatchVideoIcon";

const CourseDetail: React.FC = () => {
    let { slug } = useParams();
    const dispatch = useAppDispatch();
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    // const [isOpenPopupRating, setIsOpenPopupRating] = useState<boolean>(true);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const navigate = useNavigate();

    const courseDetail: CourseDetailType = useAppSelector((state) => state.courseSlice.courseDetail) ?? {};
    // const isLoading:boolean = useAppSelector((state => state.courseSlice.isLoading))

    const handleDeleteCourse = () => {
        //@ts-ignore
        dispatch(courseActions.deleteCourse(idItem)).then((response) => {
            if (response.payload) {
                if (response.payload.status_code === 200) {
                    toast.success(response.payload.message);
                    navigate("/my-courses");
                } else {
                    toast.error(response.payload.message);
                }
            }
        });
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };

    const handleCancelModal = () => {
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };
    const ratingScore = (): number => {
        let score: number = 0;
        courseDetail.ratings.map((rating) => (score += rating.score));
        return Number((score / courseDetail.ratings.length).toFixed(1));
    };
    useEffect(() => {
        // @ts-ignore
        dispatch(courseActions.getCourseDetail(slug)).then((response) => {
            if (response.payload && response.payload.status_code !== 200) {
                setIsNotFound(true);
            }
        });
    }, [dispatch, slug, isNotFound]);

    // if(isLoading) return <Spin/>;

    if (isNotFound) return <NotFound />;

    return (
        <>
            {/* {isOpenPopupRating && <PopupRating />} */}
            {false && <PopupRating course_id={courseDetail.id} />}
            {isOpenDeleteModal && <DeleteModal handleDelete={handleDeleteCourse} handleCancel={handleCancelModal} />}
            <Navbar />
            <div className="container mx-auto">
                <div className="min-h-screen h-full px-4 tablet:px-[60px]">
                    <div className="mt-4 container mx-auto p-4">
                        <div className="flex flex-col gap-4 laptop:flex-row shadow-xl bg-primary rounded-lg">
                            <div className=" flex-1 w-full laptop:max-w-[600px] max-h-[400px] bg-gray-600 rounded-lg">
                                <img
                                    src={courseDetail.thumbnail}
                                    alt={courseDetail.title}
                                    className="h-[300px] w-full m-auto rounded-lg tablet:h-[400px] object-cover"
                                />
                            </div>
                            <div className=" flex-1 object-right flex flex-col gap-4 px-3 pb-3 laptop:pt-3">
                                <div className="flex-1">
                                    <h2 className="text-2xl laptop:text-3xl font-bold text-title mb-3">
                                        {courseDetail.title}
                                    </h2>
                                    <p className="text-xl laptop:text-2xl font-medium italic mb-3">
                                        {courseDetail.summary}
                                    </p>

                                    <div className=" mb-3">
                                        <span className="text-xl laptop:text-2xl font-bold">Author: </span>
                                        <Link
                                            to={`/profile/${courseDetail.author.id}`}
                                            className="text-xl laptop:text-2xl underline font-medium text-blue-600"
                                        >
                                            {courseDetail.author?.first_name}
                                            <span> {courseDetail.author?.last_name} </span>
                                        </Link>
                                    </div>
                                    <div className="flex items-center text-xl laptop:text-3xl font-medium mb-3">
                                        <span className="text-xl laptop:text-2xl font-bold mr-2">Ratings:</span>
                                        <TotalRating ratingId={0} totalScore={ratingScore()} isForCourse={true} />
                                        <p className="italic text-xl laptop:text-2xl ml-2 ">{ratingScore() || 0}</p>
                                    </div>
                                    <div className="flex items-center text-xl laptop:text-2xl font-bold">
                                        <span className="mr-2">Status:</span>
                                        <p className="font-normal">
                                            {courseDetail.status === false ? "Uncomplete" : " Completed"}
                                        </p>
                                    </div>
                                </div>
                                <AuthorButton
                                    handleDelete={() => {
                                        setIsOpenDeleteModal(!isOpenDeleteModal);
                                        setIdItem(courseDetail.id as number);
                                    }}
                                    courseDetail={courseDetail}
                                />
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
                            <div className="comment my-4">
                                <h2 className="text-xl tablet:text-3xl font-bold mb-3">Ratings</h2>
                                <span className="w-[60px] h-1 bg-black block mb-4"></span>
                                {courseDetail.ratings.map((rating: Rating, index: number) => {
                                    return <CommentBox key={index} rating={rating} />;
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
