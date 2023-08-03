import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions, lessonActions } from "@redux/slice";
import NotFound from "../NotFound";
import { CourseDetail as CourseDetailType } from "../../types/course";
import { VideoPlayer, Accordion, Spin } from "@src/components";
import { Section } from "../../types/section";

const WatchVideo: React.FC = () => {
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const courseDetail: CourseDetailType = useAppSelector((state) => state.courseSlice.courseDetail);
    const nowUrlVideoSelector: string = useAppSelector((state) => state.lessonSlice.nowUrlVideo) || "";
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const [isDisplayBtn] = useState<boolean>(false);
    const handleChangeSourceVideo = (source: string) => {
        dispatch(lessonActions.setNowUrlVideo(source));
    };

    const dispatch = useAppDispatch();

    const { slug } = useParams();
    useEffect(() => {
        console.log(1);
        //@ts-ignore
        dispatch(courseActions.getCourseDetail(slug)).then((response) => {
            const firstUrlVideo = response.payload.data.sections[0]?.lessons;
            if (response.payload.status_code !== 200) {
                setIsNotFound(true);
            }
            if (firstUrlVideo && nowUrlVideoSelector === "") {
                dispatch(lessonActions.setNowUrlVideo(firstUrlVideo[0].url_video as string));
            }
        });
    }, [dispatch, slug, nowUrlVideoSelector]);

    if (isNotFound) return <NotFound />;

    return (
        <>
            {isLoading && <Spin />}
            <div className="container mx-auto mt-[100px] mb-[100px]">
                <div className="mt-[16px]">
                    <div className="w-full h-[130px] p-[16px] bg-backgroundHover rounded-[8px]">
                        <h2 className="text-black text-[24px] laptop:text-[32px] ">{courseDetail.title}</h2>
                        <h3 className=" text-[16px] laptop:text-[26px]">
                            Author:{" "}
                            <Link to={"/"}>
                                <span className="underline">
                                    {courseDetail.author.first_name} {courseDetail.author.last_name}
                                </span>
                            </Link>
                        </h3>
                    </div>
                </div>
                <div className="mt-[32px]">
                    <div className="flex flex-col laptop:flex-row justify-center gap-4">
                        <VideoPlayer sourse={nowUrlVideoSelector} />
                        <div className="flex-2 w-full mt-[-8px] laptop:w-[540px] laptop:max-h-[480px] laptop:mt-0 laptop:overflow-y-auto">
                            {courseDetail.sections.map((section: Section, index) => {
                                return (
                                    <Accordion
                                        key={index}
                                        source={nowUrlVideoSelector}
                                        handleChangeSourceVideo={handleChangeSourceVideo}
                                        isDisplayBtn={isDisplayBtn}
                                        section={section}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WatchVideo;
