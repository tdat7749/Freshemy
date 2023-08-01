import React, { useEffect } from "react";
import { Navbar } from "@src/components";
import { DefaultAvatar } from "@src/assets";
import CardVideo from "../HomePage/CardVideo";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { userActions } from "@redux/slice";
import { User } from "../../types/user";
import { useParams } from "react-router-dom";
import { Course } from "../../types/course";

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
            <div className="container mx-auto px-4">
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
                <div className="flex justify-center items-center flex-wrap my-4 gap-4">
                    {courseList.length > 0 &&
                        courseList.map((course, index) => {
                            return (
                                <CardVideo
                                    key={index}
                                    slug={course.slug}
                                    thumbnail={course.thumbnail}
                                    title={course.title}
                                    author={user.last_name + " " + user.first_name}
                                    rating={course.rating}
                                    categories={course.categories}
                                />
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default AuthorProfile;
