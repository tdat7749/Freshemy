import React, { useEffect } from "react";
import { CourseCard, Navbar } from "@src/components";
import { DefaultAvatar } from "@src/assets";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { userActions } from "@redux/slice";
import { User } from "../../types/user";
import { useParams } from "react-router-dom";
import { Course } from "../../types/course";
import i18n from "../../utils/i18next";

const AuthorProfile: React.FC = () => {
    const user: User = useAppSelector((state) => state.userSlice.user);
    const courseList: Course[] = useAppSelector((state) => state.userSlice.course) ?? [];

    const dispatch = useAppDispatch();
    const { id } = useParams();

    useEffect(() => {
        // @ts-ignore
        dispatch(userActions.getAuthorInformation(id));
    }, [dispatch, id]);

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 mt-[100px] laptop:mt-0">
                <div className="px-4 tablet:px-[60px] flex gap-4 bg-primary mt-4 p-4 rounded-lg">
                    <div className="w-32 h-32 rounded-full border">
                        <img
                            src={user.url_avatar || DefaultAvatar}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <div className="">
                        <h1 className="text-3xl font-bold mb-2">
                            {((user.first_name as string) + " " + user.last_name) as string}
                        </h1>
                        <p className="text-lg">
                            <span className="font-bold">About me: </span>
                            {user.description}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-3 place-self-center my-3">
                    {courseList.length > Number(i18n.t("COURSES_LENGTH.EMPTY")) &&
                        courseList.map((course) => {
                            return (
                                <div className="laptop:w-3/4 max-w-xs tablet:max-w-full place-self-center">
                                    <CourseCard
                                        key={course.id}
                                        id={course.id}
                                        title={course.title}
                                        thumbnail={course.thumbnail}
                                        rating={course.rating}
                                        status={course.status}
                                        numberOfSection={course.number_section}
                                        slug={course.slug}
                                        summary={course.summary}
                                        author={course.author as User}
                                        isEditCourse={false}
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default AuthorProfile;
