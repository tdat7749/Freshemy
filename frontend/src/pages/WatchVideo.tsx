import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { courseActions } from '../redux/slice'
import NotFound from './NotFound'
import { CourseDetail as CourseDetailType } from '../types/course'
import VideoPlayer from '../components/VideoPlayer'
import Accordion from '../components/Accordion'
import { Section } from '../types/section'
const WatchVideo: React.FC = () => {

    const [isNotFound, setIsNotFound] = useState<boolean>(false)
    const [isDisplayBtn] = useState<boolean>(false)


    const isLoading = useAppSelector(state => state.courseSlice.isLoading)
    const courseDetail: CourseDetailType = useAppSelector(state => state.courseSlice.courseDetail)

    const dispatch = useAppDispatch()

    const { slug } = useParams()


    useEffect(() => {
        //@ts-ignore
        dispatch(courseActions.getCourseDetail(slug)).then(response => {
            if (response.payload.status_code !== 200) {
                setIsNotFound(true)
            }
        })

    }, [dispatch, slug])

    if (isLoading) return (
        <h1 className='text-center text-4xl'>Loading...</h1>
    )

    if (isNotFound) return <NotFound />

    const fakeSections: Section[] = [
        {
            title: "Chương học 1",
            id: 1,
            lessons: [
                {
                    id: 1,
                    title: "Bài học 1",
                    url_video: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
                }
            ]
        },
        {
            title: "Chương học 2",
            id: 2,
            lessons: [
                {
                    id: 1,
                    title: "Bài học 1",
                    url_video: "https://live-par-2-abr.livepush.io/vod/bigbuckbunny/index.m3u8"
                }
            ]
        },
    ]

    return (
        <>
            <div className='container mx-auto mt-[100px]'>
                <div className='mt-[16px]'>
                    <div className='w-full h-[130px] p-[16px] bg-background rounded-[8px]'>
                        <h2 className='text-black text-[24px] laptop:text-[32px] '>{courseDetail.title}</h2>
                        <h3 className=' text-[16px] laptop:text-[26px]'>Author: <Link to={"/"}><span className='underline'>{courseDetail.author.first_name} {courseDetail.author.last_name}</span></Link></h3>
                    </div>
                </div>
                <div className='mt-[32px]'>
                    <div className='laptop:flex space-x-2'>
                        <VideoPlayer sourse={"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"} />
                        <div className='w-full mt-4 laptop:w-[540px] laptop:max-h-[480px] laptop:mt-0 laptop:overflow-y-auto'>
                            {/* {courseDetail.sections.map((section) => {
                                return <Accordion isDisplayBtn={isDisplayBtn} section={section} />
                            })} */}
                            {fakeSections.map((section: Section) => {
                                return <Accordion isDisplayBtn={isDisplayBtn} section={section} />
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WatchVideo