import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import CardVideo from "./CardVideo";
import Category from "./CategoryCard";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions } from "../../redux/slice";
import { Course as CourseType } from "../../types/course";

const Home: React.FC = () => {
    const dispatch = useAppDispatch();

    const top10Course: CourseType[] = useAppSelector((state) => state.courseSlice.courses) ?? [];

    useEffect(() => {
        // @ts-ignore
        dispatch(courseActions.getTop10Courses());
    }, [dispatch]);

    return (
        <>
            <Navbar />
            <div className="h-[200px] tablet:h-[400px] flex items-center bg-hero-pattern bg-cover">
                <div className="px-24">
                    <h1 className="text-title text-2xl tablet:text-[40px] font-bold min-w-fit">LEARN NEW SKILLS</h1>
                    <p className="text-xl font-medium">Learn as hard as you can</p>
                </div>
            </div>
            <div className="container mx-auto">
                <div className="my-4 px-4">
                    <h2 className="text-xl tablet:text-3xl font-bold mb-3">Popular video</h2>
                    <span className="w-[60px] h-1 bg-black block"></span>
                    <div className="w-full flex overflow-x-scroll">
                        <div className="mt-3 flex shrink-0 gap-3 py-2">
                            {top10Course.map((course: CourseType) => {
                                return (
                                    <CardVideo
                                        thumbnail={course.thumbnail}
                                        title={course.title}
                                        author={course.author}
                                        rating={course.rate}
                                        categories={course.categories}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="my-4 px-4">
                    <h2 className="text-xl tablet:text-3xl font-bold mb-3">Most category</h2>
                    <span className="w-[60px] h-1 bg-black block"></span>
                    <div className="mt-3 grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 gap-3">
                        <Category />
                    </div>
                </div>
            </div>
            <div className="w-full h-[120px] bg-backgroundHover flex flex-col justify-center items-center mt-4">
                <p className="text-xl mb-2 font-bold">Trusted by more than 13400 amazing teams</p>
                <p className="text-lg">Top companies use these same courses to help employees hone their skills.</p>
            </div>
        </>
    );
};

export default Home;
