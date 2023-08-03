import React, { useEffect, useState } from "react";
import SearchIcon from "@src/components/icons/SearchIcon";
import CreateIcon from "@src/components/icons/CreateIcon";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions } from "@redux/slice";
import { Course } from "../../types/course";
import toast from "react-hot-toast";
import { Spin, DeleteModal, Navbar, Pagination, CourseCard } from "@src/components";
import { User } from "../../types/user";

const MyCourses: React.FC = () => {
    const [userInput, setUserInput] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    let courseList: Course[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    let totalPage: number = useAppSelector((state) => state.courseSlice.totalPage) ?? 1;

    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);

    useEffect(() => {
        // @ts-ignore
        dispatch(courseActions.getMyCourses({ pageIndex, keyword }));
    }, [dispatch, keyword, pageIndex]);

    // handle pagination
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };

    // handle search input
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setKeyword(userInput);
    };

    const handleEditCourse = (id: number) => {
        navigate(`/my-courses/edit/${id}`);
    };

    const handleDeleteCourse = () => {
        //@ts-ignore
        dispatch(courseActions.deleteCourse(idItem)).then((response) => {
            if (response.payload.status_code === 200) {
                dispatch(courseActions.setDeleteCourse(idItem));
                toast.success(response.payload.message);
            } else {
                toast.error(response.payload.message);
            }
        });
        setIsOpenDeleteModal(false);
    };

    const handleCancelDeleteModal = () => {
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };

    const handleDiplayDeleteModal = (courseId: number) => {
        setIdItem(courseId);
        setIsOpenDeleteModal(true);
    };

    return (
        <>
            {isGetLoading && <Spin />}
            <Navbar />
            <div className="container mx-auto mt-[100px] laptop:mt-0">
                <div className="px-4 tablet:px-[60px]">
                    <h1 className="text-center text-[32px] py-4 font-bold text-title">MY COURSE</h1>
                    <div className="w-full flex flex-col gap-4 justify-between shrink-0 tablet:flex-row">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search for anything"
                                    className="rounded-full py-4 px-10 w-full tablet:w-[70%] border-[1px] border-black"
                                    value={userInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleKeyWordSearch();
                                    }}
                                />
                                <div className="cursor-pointer" onClick={handleKeyWordSearch}>
                                    <SearchIcon />
                                </div>
                            </div>
                        </div>
                        <Link to={"/create-course"}>
                            <div className="text-white flex-3 flex btn btn-primary text-lg">
                                <CreateIcon />
                                Create New
                            </div>
                        </Link>
                    </div>
                    <div className="flex-1 grid grid-cols-1">
                        {courseList.map((course) => {
                            return (
                                <div className="w-full max-w-xs tablet:max-w-full place-self-center" key={course.id}>
                                    <CourseCard
                                        id={course.id}
                                        thumbnail={course.thumbnail}
                                        slug={course.slug}
                                        title={course.title}
                                        summary={course.summary}
                                        author={course.author as User}
                                        isEditCourse={true}
                                        handleDeleteCourse={handleDiplayDeleteModal}
                                        handleEditCourse={handleEditCourse}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {courseList.length > 0 ? (
                        <div className="flex justify-end my-4">
                            <Pagination
                                handleChangePageIndex={handleChangePageIndex}
                                totalPage={totalPage}
                                currentPage={pageIndex}
                            />
                        </div>
                    ) : (
                        <p className="mt-4 text-2xl text-error text-center font-bold">You don't have any courses!</p>
                    )}
                </div>
            </div>
            {/* POPUP DELETE */}
            {isOpenDeleteModal && (
                <DeleteModal handleDelete={handleDeleteCourse} handleCancel={handleCancelDeleteModal} />
            )}
        </>
    );
};

export default MyCourses;
